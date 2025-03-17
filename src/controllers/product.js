const Product = require('../models/Product');

exports.addNew = async (req, res) => {
    try {
        const { name, price } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!name || name.trim() === "") {
            return res.status(400).json({ status: 400, message: "Tên sản phẩm không được bỏ trống!" });
        }
        if (!price || isNaN(price) || price <= 0) {
            return res.status(400).json({ status: 400, message: "Giá sản phẩm không hợp lệ!" });
        }

        // Kiểm tra xem sản phẩm đã tồn tại chưa
        const isExist = await Product.findOne({ name });
        if (isExist) {
            return res.status(400).json({ status: 400, message: "Tên sản phẩm này đã tồn tại!" });
        }

        // Tạo sản phẩm mới
        const product = new Product({ ...req.body });
        await product.save();

        return res.status(201).json({ status: 201, message: "Sản phẩm đã được tạo thành công!" });
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        return res.status(500).json({ status: 500, message: "Lỗi server nội bộ!" });
    }
};

exports.getList = async (req, res) => {
  try {
    let { page = 1, rowsPerPage = 10 } = req.query;

    // Chuyển đổi thành số nguyên
    page = parseInt(page, 10);
    rowsPerPage = parseInt(rowsPerPage, 10);

    // Kiểm tra nếu giá trị không hợp lệ, gán mặc định
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(rowsPerPage) || rowsPerPage < 1) rowsPerPage = 10;

    // Tính toán offset
    const skip = (page - 1) * rowsPerPage;

    // Lấy dữ liệu có phân trang
    const list = await Product.find().skip(skip).limit(rowsPerPage);

    // Đếm tổng số sản phẩm
    const totalItems = await Product.countDocuments();

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

