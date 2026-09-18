import Product from "./product.model.js";
import SavedProduct from "./savedProduct.model.js";

export const ProductRepository = {
  createProduct: async (productData) => {
    const product = new Product(productData);
    await product.save();
    return await product.populate("category");
  },

  findProductsPaginated: async (filters, skip, limit, sortObj) => {
    return await Product.find(filters)
      .skip(skip)
      .limit(limit)
      .sort(sortObj)
      .select("-is_deleted -__v")
      .populate("category")
      .lean();
  },

  countProducts: async (filters) => {
    return await Product.countDocuments(filters);
  },

  findProductById: async (id) => {
    return await Product.findOne({ _id: id, is_deleted: false })
      .select("-is_deleted -__v")
      .populate("category")
      .lean();
  },

  findProductByIdForUpdate: async (id) => {
    return await Product.findOne({ _id: id, is_deleted: false });
  },

  softDeleteProduct: async (id) => {
    return await Product.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true },
    ).select("-__v");
  },

  updateProduct: async (id, updateData) => {
    return await Product.findOneAndUpdate(
      { _id: id, is_deleted: false },
      { $set: updateData },
      { new: true, runValidators: true },
    )
      .select("-is_deleted -__v")
      .populate("category");
  },

  incrementSaveCount: async (id, value) => {
    return await Product.findByIdAndUpdate(id, { $inc: { save_count: value } });
  },

  findSavedProductsByUser: async (userId) => {
    return await SavedProduct.find({ user: userId })
      .populate({
        path: "product",
        populate: { path: "category" },
      })
      .lean();
  },

  findSavedProduct: async (userId, productId) => {
    return await SavedProduct.findOne({ user: userId, product: productId });
  },

  createSavedProduct: async (userId, productId) => {
    const saved = new SavedProduct({ user: userId, product: productId });
    return await saved.save();
  },

  deleteSavedProduct: async (savedId) => {
    return await SavedProduct.deleteOne({ _id: savedId });
  },

  findMatchingProducts: async (regex) => {
    return await Product.find({ name: regex }).select("_id");
  },

  findProductsByIds: async (productIds, selectFields) => {
    return await Product.find({ _id: { $in: productIds } }, selectFields);
  },
  findActiveProducts: async (selectFields) => {
    return await Product.find(
      { is_deleted: false, is_active: true },
      selectFields,
    );
  },
  updateProductStock: async (productId, incValue, session = null) => {
    let query = Product.findByIdAndUpdate(productId, {
      $inc: { stock: incValue },
    });
    if (session) query = query.session(session);
    return await query;
  },

  searchByWordsForChat: async (cleanWords) => {
    const queryConditions = cleanWords.map((word) => ({
      $or: [
        { name: { $regex: word, $options: "i" } },
        { description: { $regex: word, $options: "i" } },
      ],
    }));
    return await Product.find({
      $or: queryConditions,
      is_active: true,
      is_deleted: false,
    })
      .limit(5)
      .populate("category")
      .lean();
  },

  findTopRecommendedForChat: async () => {
    return await Product.find({ is_active: true, is_deleted: false })
      .sort({ top_selling: -1, rating: -1 })
      .limit(5)
      .populate("category")
      .lean();
  },

  getProductByIdForTransaction: async (productId, session) => {
    let query = Product.findOne({ _id: productId, is_deleted: false });
    if (session) query = query.session(session);
    return await query;
  },
};
