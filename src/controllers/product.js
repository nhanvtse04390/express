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
        const product = new Product({ name, price });
        await product.save();

        return res.status(201).json({ status: 201, message: "Sản phẩm đã được tạo thành công!" });
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        return res.status(500).json({ status: 500, message: "Lỗi server nội bộ!" });
    }
};
