import { Category } from "./category.model.js";

export const CategoryRepository = {
  findByName: async (name) => {
    return await Category.findOne({
      name: name.toLowerCase().trim(),
      is_deleted: false,
    });
  },

  findById: async (id) => {
    return await Category.findOne({
      _id: id,
      is_active: true,
      is_deleted: false,
    }).select("-__v -is_active -is_deleted");
  },

  findBySlug: async (slug) => {
    return await Category.findOne({
      slug,
      is_active: true,
      is_deleted: false,
    }).select("-__v -is_active -is_deleted");
  },

  findByNameOrSlug: async (identifier) => {
    return await Category.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${identifier}$`, "i") } },
        { slug: identifier },
      ],
      is_active: true,
      is_deleted: false,
    });
  },

  findAllPaginated: async (filter, skip, limitNumber) => {
    const totalItems = await Category.countDocuments(filter);
    const categories = await Category.find(filter)
      .select("-__v -is_active -is_deleted")
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    return { totalItems, categories };
  },

  createCategory: async (categoryData) => {
    return await Category.create(categoryData);
  },

  updateById: async (id, updateData) => {
    return await Category.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-__v");
  },

  softDelete: async (id) => {
    return await Category.findByIdAndUpdate(
      id,
      { is_deleted: true, is_active: false },
      { new: true },
    );
  },
};
