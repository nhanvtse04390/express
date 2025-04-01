const Product = require("../models/Product");

exports.addNew = async (req, res) => {
  try {
    const { name, price } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ status: 400, message: "Tên sản phẩm không được bỏ trống!" });
    }
    if (!price || isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ status: 400, message: "Giá sản phẩm không hợp lệ!" });
    }

    // Kiểm tra xem sản phẩm đã tồn tại chưa
    const isExist = await Product.findOne({ name });
    if (isExist) {
      return res
        .status(400)
        .json({ status: 400, message: "Tên sản phẩm này đã tồn tại!" });
    }

    // Tạo sản phẩm mới
    const product = new Product({ ...req.body });
    await product.save();

    return res
      .status(201)
      .json({ status: 201, message: "Sản phẩm đã được tạo thành công!" });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    return res.status(500).json({ status: 500, message: "Lỗi server nội bộ!" });
  }
};

exports.getList = async (req, res) => {
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
    const list = await Product.find({ isActive: true })
      .skip(skip)
      .limit(rowsPerPage);

    // Đếm tổng số sản phẩm
    const totalItems = await Product.countDocuments({ isActive: true });

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

exports.getProductById = async (req, res) => {
  try {
    const { _id } = req.params;
    const product = await Product.findById(_id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { productId } = req.params;
    const { imageUrl } = req.body; // Ảnh cần xóa

    if (!imageUrl) {
      return res.status(400).json({ message: "Thiếu đường dẫn ảnh cần xóa!" });
    }

    // Tìm sản phẩm và cập nhật mảng image
    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: productId },
      { $pull: { image: imageUrl } }, // Xóa ảnh cụ thể khỏi mảng
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }

    return res.json({
      message: "Xóa ảnh thành công!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params; // Lấy ID sản phẩm từ request

    const updateData = req.body; // Dữ liệu cập nhật từ client

    // Cập nhật sản phẩm bằng findByIdAndUpdate
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true, // Trả về dữ liệu đã cập nhật
        runValidators: true, // Chạy validate nếu có schema validation
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    res
      .status(200)
      .json({ message: "Cập nhật thành công", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { _id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      { isActive: false }, // Cập nhật trạng thái active thành false
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ status: 404, error: "Sản phẩm không tồn tại" });
    }

    res.json({
      status: 200,
      message: "Sản phẩm đã được vô hiệu hóa!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, error: "Lỗi khi vô hiệu hóa sản phẩm" });
  }
};
