import ProductModel from "../../models/product.model.js"; 
class ProductDAO {
    async getAll() {
        return await ProductModel.find().lean();
    }

async getById(id) {
    const product = await ProductModel.findById(id);
    if (!product) console.warn("Producto no encontrado en la base de datos:", id);
    return product;
}

async create(productData) {
    return await ProductModel.create(productData);
}

async update(id, updateData) {
    return await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
}

async delete(id) {
    return await ProductModel.findByIdAndDelete(id);
}



}

export default new ProductDAO();