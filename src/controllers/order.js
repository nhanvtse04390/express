const Order = require("../models/Order");

exports.addNew = async (req, res) => {
  try {
    const { userId, items, totalAmount, paymentMethod, shippingAddress } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!userId || !items || items.length === 0 || !totalAmount || !paymentMethod || !shippingAddress) {
      return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin đơn hàng." });
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

