import ProductModel from "../../models/product.model.js"; 

console.log("🧪 Nombre de la colección usada:", ProductModel.collection.name);
class ProductDAO {
    async getAll() {
        return await ProductModel.find().lean();
    }

async getById(id) {
    return await ProductModel.findById(id).lean();
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