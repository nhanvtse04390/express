const Order = require("../models/Order");
const User = require("../models/User");

exports.getUsersWithReferralOrders = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "users", // Lấy danh sách referrals (người được giới thiệu)
          localField: "_id", // ID của user
          foreignField: "codeRef", // codeRef của người khác trỏ đến _id của user này
          as: "referrals",
        },
      },
      {
        $addFields: {
          totalReferrals: { $size: "$referrals" }, // Đếm số lượng referrals
        },
      },
      {
        $lookup: {
          from: "orders", // Tìm đơn hàng của các referrals
          localField: "referrals._id", // ID của referrals
          foreignField: "userId", // So sánh với userId trong Order
          as: "referralOrders",
        },
      },
      {
        $addFields: {
          totalOrdersFromReferrals: { $size: "$referralOrders" }, // Đếm số lượng đơn hàng
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          totalReferrals: 1,
          totalOrdersFromReferrals: 1,
        },
      },
      { $sort: { totalOrdersFromReferrals: -1 } }, // Sắp xếp theo số đơn hàng nhiều nhất
    ]);

    return res.status(200).json({
      status: 200,
      users,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách referrals:", error);
    return res.status(500).json({ status: 500, message: "Lỗi server nội bộ!" });
  }
};
