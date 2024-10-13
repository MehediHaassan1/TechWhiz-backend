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
  const user = await User.isUserExists(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  if (user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User is deleted!");
  }

  if (user?.status === 'block') {
    throw new AppError(httpStatus.BAD_REQUEST, "User is blocked!");
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
        let: { postMonth: "$_id.month", userId: user._id },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", "$$userId"] },
                  { $eq: [{ $dateToString: { format: "%Y-%m", date: "$createdAt" } }, "$$postMonth"] }
                ]
              }
            }
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: { $toDouble: "$packagePrice" } }
            }
          },
          {
            $project: {
              _id: 0,
              totalAmount: 1
            }
          }
        ],
        as: "payments"
      }
    },
    {
      $addFields: {
        totalAmount: {
          $ifNull: [{ $arrayElemAt: ["$payments.totalAmount", 0] }, 0]
        }
      }
    },
    {
      // Add the correct lookup for followers and following with ObjectId casting
      $lookup: {
        from: "users",
        localField: "author", // Match author's ID from 'Post' collection
        foreignField: "_id", // Match against the '_id' field in 'users'
        as: "userDetails" // Store the result in 'userDetails'
      }
    },
    {
      $addFields: {
        user: { $arrayElemAt: ["$userDetails", 0] }, // Get the first element (should be the user)
      }
    },
    {
      $addFields: {
        totalFollowers: { $size: { $ifNull: ["$user.followers", []] } }, // Fallback to empty array if null
        totalFollowings: { $size: { $ifNull: ["$user.following", []] } } // Fallback to empty array if null
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
        totalAmount: 1,
        totalFollowers: 1,
        totalFollowings: 1
      }
    },
    { $sort: { month: 1 } },
    {
      $group: {
        _id: null,
        totalPosts: { $sum: "$totalPosts" },
        totalLikes: { $sum: "$totalLikes" },
        totalDislikes: { $sum: "$totalDislikes" },
        totalComments: { $sum: "$totalComments" },
        totalAmount: { $sum: "$totalAmount" },
        totalFollowers: { $first: "$totalFollowers" },
        totalFollowings: { $first: "$totalFollowings" },
        monthlyData: { $push: "$$ROOT" }
      }
    },
    {
      $project: {
        _id: 0,
        totalPosts: 1,
        totalLikes: 1,
        totalDislikes: 1,
        totalComments: 1,
        totalAmount: 1,
        totalFollowers: 1,
        totalFollowings: 1,
        monthlyData: 1
      }
    }
  ]);

  return userAnalytics;
};




export const AnalyticsService = {
  getAnalyticsFromDB,
  getUserAnalyticsFromDB,
}