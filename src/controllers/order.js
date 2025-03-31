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
    let { page = 1, rowsPerPage, orderStatus } = req.query;

    // Chuyển đổi thành số nguyên
    page = parseInt(page, 10);
    rowsPerPage = parseInt(rowsPerPage, 10);

    // Kiểm tra nếu giá trị không hợp lệ, gán mặc định
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(rowsPerPage) || rowsPerPage < 1) rowsPerPage = 10;

    // Xử lý orderStatus: Nếu là chuỗi, chuyển thành mảng
    let filter = {};
    if (orderStatus) {
      if (typeof orderStatus === "string") {
        orderStatus = orderStatus.split(","); // Chuyển chuỗi thành mảng
      }
      filter.orderStatus = { $in: orderStatus };
    }

    // Tính toán offset
    const skip = (page - 1) * rowsPerPage;

    // Lấy dữ liệu có phân trang
    const list = await Order.find(filter)
      .populate("userId", "username email phone codeRef")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(rowsPerPage)
      .lean();

    // Đếm tổng số đơn hàng sau khi lọc
    const totalItems = await Order.countDocuments(filter);

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
    console.error("Error fetching orders:", error);
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

exports.updateOrderById = async (req, res) => {
  try {
    const { _id } = req.params;
    const orderStatus  = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      _id,
      orderStatus,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    res
      .status(200)
      .json({ message: "Cập nhật thành công", product: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};