const Order = require("../models/Order");

exports.addNew = async (req, res) => {
  try {
    const { userId, items, totalAmount, paymentMethod, shippingAddress } =
      req.body;

    // Kiểm tra dữ liệu đầu vào
    if (
      !userId ||
      !items ||
      items.length === 0 ||
      !totalAmount ||
      !paymentMethod ||
      !shippingAddress
    ) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ thông tin đơn hàng." });
    }

    // Tạo đơn hàng mới
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
      paymentStatus: "pending", // Mặc định là chưa thanh toán
      orderStatus: "pending", // Mặc định là đang chờ xác nhận
    });

    // Lưu đơn hàng vào DB
    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Đơn hàng đã được tạo thành công!",
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Có lỗi xảy ra khi tạo đơn hàng.",
      error: error.message,
    });
  }
};

exports.getListOrder = async (req, res) => {
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
    const list = await Order.find()
      .populate("userId", "username email phone codeRef")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(rowsPerPage)
	  .lean();

    // Đếm tổng số sản phẩm
    const totalItems = await Order.countDocuments();

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

exports.getOrderById = async (req, res) => {
  try {
    const { _id } = req.params;
    const order = await Order.findById(_id).populate("userId", "username email phone codeRef");

    if (!order) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};