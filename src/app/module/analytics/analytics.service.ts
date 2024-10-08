import httpStatus from "http-status";
import User from "../user/user.model";
import AppError from "../../errors/AppError";
import Post from "../post/post.model";

const getAnalyticsFromDB = async () => {
  const analytics = await User.aggregate([
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "author",
        as: "userPosts",
      },
    },
    {
      $lookup: {
        from: "payments",
        localField: "_id",
        foreignField: "user",
        as: "userPayments",
      },
    },
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: { $sum: { $cond: [{ $gt: [{ $size: "$userPosts" }, 0] }, 1, 0] } },
        totalPosts: { $sum: { $size: "$userPosts" } },
        totalRevenue: { $sum: { $sum: "$userPayments.packagePrice" } },
        totalPayments: { $sum: { $size: "$userPayments" } },
        usersWithPayments: { $sum: { $cond: [{ $gt: [{ $size: "$userPayments" }, 0] }, 1, 0] } },
      },
    },
    {
      $project: {
        _id: 0,
        totalUsers: 1,
        activeUsers: 1,
        totalPosts: 1,
        averagePostsPerUser: { $cond: [{ $eq: ["$activeUsers", 0] }, 0, { $divide: ["$totalPosts", "$activeUsers"] }] },
        totalRevenue: 1,
        averagePaymentAmount: { $cond: [{ $eq: ["$totalPayments", 0] }, 0, { $divide: ["$totalRevenue", "$totalPayments"] }] },
        usersWithPayments: 1,
        averagePaymentsPerUser: { $cond: [{ $eq: ["$usersWithPayments", 0] }, 0, { $divide: ["$totalPayments", "$usersWithPayments"] }] },
      },
    },
  ]);

  return analytics[0];
}

const getUserAnalyticsFromDB = async (email: string) => {
  const user = await User.isUserExists(email)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!")
  }

  if (user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User is deleted!")
  }

  if (user?.status === 'block') {
    throw new AppError(httpStatus.BAD_REQUEST, "User is blocked!")
  }

  const userAnalytics = await Post.aggregate([
    { $match: { author: user._id } },
    {
      $group: {
        _id: { 
          month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
        },
        totalPosts: { $sum: 1 },
        totalLikes: { $sum: { $size: "$upVotes" } },
        totalDislikes: { $sum: { $size: "$downVotes" } },
        totalComments: { $sum: { $size: "$comments" } }
      }
    },
    {
      $lookup: {
        from: "payments",
        localField: "_id.month", 
        foreignField: "createdAt",
        as: "payments"
      }
    },
    {
      $addFields: {
        totalPayments: { $size: "$payments" }
      }
    },
    {
      $lookup: {
        from: "followers",
        localField: "_id.month",
        foreignField: "followedAt",
        as: "followers"
      }
    },
    {
      $lookup: {
        from: "followings",
        localField: "_id.month",
        foreignField: "followedAt",
        as: "followings"
      }
    },
    {
      $addFields: {
        totalFollowers: { $size: "$followers" },
        totalFollowings: { $size: "$followings" }
      }
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        totalPosts: 1,
        totalLikes: 1,
        totalDislikes: 1,
        totalComments: 1,
        totalPayments: 1,
        totalFollowers: 1,
        totalFollowings: 1
      }
    },

    { $sort: { month: 1 } }
  ]);

  return userAnalytics;
}

export const AnalyticsService = {
  getAnalyticsFromDB,
  getUserAnalyticsFromDB,
}