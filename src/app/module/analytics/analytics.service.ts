import User from "../user/user.model";

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

export const AnalyticsService = {
  getAnalyticsFromDB,
}