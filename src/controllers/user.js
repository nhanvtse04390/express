const User = require("../models/User");

exports.getUserById = async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    let { page = 1, rowsPerPage } = req.query;

    // Chuyển đổi thành số nguyên
    page = parseInt(page, 10);
    rowsPerPage = parseInt(rowsPerPage, 10);

    // Kiểm tra nếu giá trị không hợp lệ, gán mặc định
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(rowsPerPage) || rowsPerPage < 1) rowsPerPage;

    // Tính toán offset
    const skip = (page - 1) * rowsPerPage;

    // Lấy dữ liệu có phân trang
    const list = await User.find({ isActive: true })
      .skip(skip)
      .limit(rowsPerPage);

    // Đếm tổng số sản phẩm
    const totalItems = await User.countDocuments({ isActive: true });

    return res.status(200).json({
      status: 200,
      list,
      pagination: {
        page,
        rowsPerPage,
        totalItems,
        totalPages: Math.ceil(totalItems / rowsPerPage),
      },
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Lỗi server nội bộ!" });
  }
};

exports.editUser = async (req, res) => {
  try {
    const user = req.body;
    const { _id, phone } = req.body;
    const userPhoneAlready = await User.findOne({ phone });
    if (userPhoneAlready) {
      return res
        .status(409)
        .json({ status: 409, message: "Số điện thoại đã được sử dụng" });
    } else {
      const updatedUser = await User.findByIdAndUpdate(_id, user, {
        new: true, // Trả về dữ liệu đã cập nhật
        runValidators: true, // Chạy validate nếu có schema validation
      });
      if (updatedUser) {
        res
          .status(200)
          .json({ message: "Cập nhật thành công", user: updatedUser });
      }
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Lỗi server nội bộ!" });
  }
};
