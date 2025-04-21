import ProductDAO from "../dao/models/products.dao.js";

class ProductRepository {
async getAll() {
    return await ProductDAO.getAll(); 
}

async getById(id) {
    return await ProductDAO.getById(id); 
}

async create(productData) {
    return await ProductDAO.create(productData); 
}

async update(id, updateData) {
    return await ProductDAO.update(id, updateData); 
}

async delete(id) {
    return await ProductDAO.delete(id); 
}
}

export default new ProductRepository();