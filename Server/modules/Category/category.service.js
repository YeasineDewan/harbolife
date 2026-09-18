import { CategoryRepository } from "./category.repository.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../utils/errors.js";
import cloudinary from "../../config/cloudinary.js";
import slugify from "slugify";

const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(buffer);
  });
};

export const CategoryService = {
  createCategory: async (name, description, file) => {
    if (!name) throw new BadRequestError("Category name is required");
    if (!file) throw new BadRequestError("Category image is required");

    const existing = await CategoryRepository.findByName(name);
    if (existing) throw new ConflictError("Category already exists");

    const uploadResult = await uploadToCloudinary(file.buffer, {
      folder: "categories",
      format: "webp",
      public_id: `category_${name.toLowerCase().replace(/\s+/g, "_")}`,
      overwrite: true,
    });

    const slug = slugify(name, { lower: true, strict: true, trim: true });

    return await CategoryRepository.createCategory({
      name,
      description,
      image: uploadResult.secure_url,
      slug,
    });
  },

  getAllCategories: async (search, page = 1, limit = 10) => {
    const filter = { is_active: true, is_deleted: false };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const limitNumber = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * limitNumber;

    const { totalItems, categories } =
      await CategoryRepository.findAllPaginated(filter, skip, limitNumber);
    const totalPages = Math.ceil(totalItems / limitNumber);

    return {
      categories,
      pagination: {
        totalItems,
        totalPages,
        currentPage: parseInt(page, 10),
        limit: limitNumber,
      },
    };
  },

  getCategoryById: async (id) => {
    const category = await CategoryRepository.findById(id);
    if (!category) throw new NotFoundError("Category not found");
    return category;
  },

  getCategoryBySlug: async (slug) => {
    const category = await CategoryRepository.findBySlug(slug);
    if (!category) throw new NotFoundError("Category not found");
    return category;
  },

  getCategoryByNameOrSlug: async (identifier) => {
    return await CategoryRepository.findByNameOrSlug(identifier);
  },

  deleteCategory: async (id) => {
    const category = await CategoryRepository.softDelete(id);
    if (!category) throw new NotFoundError("Category not found");
    return category;
  },

  updateCategory: async (id, bodyData, file) => {
    const existingCategory = await CategoryRepository.findById(id);
    if (!existingCategory) throw new NotFoundError("Category not found");

    if ((!bodyData || Object.keys(bodyData).length === 0) && !file) {
      throw new BadRequestError("Update data is required");
    }

    const allowedFields = ["name", "description"];
    const updateData = Object.keys(bodyData)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = bodyData[key];
        return obj;
      }, {});

    if (file) {
      const uploadResult = await uploadToCloudinary(file.buffer, {
        folder: "categories",
        format: "webp",
        public_id: `category_${id}`,
        overwrite: true,
      });
      updateData.image = uploadResult.secure_url;
    }

    if (updateData.name) {
      updateData.slug = slugify(updateData.name, {
        lower: true,
        strict: true,
        trim: true,
      });
    }

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestError("No valid fields provided");
    }

    return await CategoryRepository.updateById(id, updateData);
  },
};
