const User = require("../models/User");

exports.getUsersWithReferralOrders = async (req, res) => {
  try {
    let { page, rowsPerPage } = req.query;

    // Chuyển đổi thành số nguyên
    page = parseInt(page, 10);
    rowsPerPage = parseInt(rowsPerPage, 10);

    // Kiểm tra nếu giá trị không hợp lệ, gán mặc định
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(rowsPerPage) || rowsPerPage < 1) rowsPerPage;
    // Xác định số lượng bản ghi bỏ qua
    const skip = (page - 1) * rowsPerPage;

    const users = await User.aggregate([
      {
        $lookup: {
          from: "orders",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: [{ $toObjectId: "$codeRef" }, "$$userId"] }
              }
            }
          ],
          as: "referredOrders"
        }
      },
      {
        $match: {
          referredOrders: { $ne: [] } // Chỉ lấy User có đơn hàng được giới thiệu
        }
      },
      {
        $addFields: {
          totalAmount: { $sum: "$referredOrders.totalAmount" }
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          totalAmount: 1,
          phone: 1,
        }
      },
      { $skip: skip },
      { $limit: rowsPerPage }
    ]);

    // Đếm tổng số Users đủ điều kiện
    const totalUsers = await User.aggregate([
      {
        $lookup: {
          from: "orders",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: [{ $toObjectId: "$codeRef" }, "$$userId"] }
              }
            }
          ],
          as: "referredOrders"
        }
      },
      { $match: { referredOrders: { $ne: [] } } },
      { $count: "total" }
    ]);

    const totalItems = totalUsers.length > 0 ? totalUsers[0].total : 0;

    return res.status(200).json({
      status: 200,
      users,
      pagination: {
        page,
        rowsPerPage,
        totalItems,
        totalPages: Math.ceil(totalItems / rowsPerPage),
      },
    });

  } catch (error) {
    console.error("Lỗi khi lấy danh sách users:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
