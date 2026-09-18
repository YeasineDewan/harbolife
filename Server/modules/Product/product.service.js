import { ProductRepository } from "./product.repository.js";
import { CategoryService } from "../Category/category.service.js";
import { ReviewService } from "../Review/review.service.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";
import { NotificationService } from "../Notification/notification.service.js";
import { getEmbedding } from "../../services/embedding.service.js";

const uploadStream = (buffer, options = { folder: "products" }) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => (error ? reject(error) : resolve(result)),
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const processStripsLogic = (data) => {
  const isHasStrips = data.has_strips === "true" || data.has_strips === true;
  const stripCount = Number(data.strip_count || 0);
  const stripsPerBox = Number(data.strips_per_box || 0);

  data.has_strips = isHasStrips;

  if (!isHasStrips) {
    data.strip_count = 0;
    data.strips_per_box = 0;
  } else {
    if (stripsPerBox <= 0) {
      throw new BadRequestError(
        "Strips per box must be greater than 0 if product has strips.",
      );
    }
    if (stripCount >= stripsPerBox) {
      throw new BadRequestError(
        `Strip count (${stripCount}) cannot be greater than or equal to strips per box (${stripsPerBox}).`,
      );
    }
    data.strip_count = stripCount;
    data.strips_per_box = stripsPerBox;
  }
  return data;
};

export const ProductService = {
  createProduct: async (bodyData, file) => {
    const data = { ...bodyData };

    if (!file) throw new BadRequestError("Product image is required");
    if (!data.category) throw new BadRequestError("Category is required");

    const categoryExists = await CategoryService.getCategoryById(data.category);

    if (data.price) data.price = Number(data.price);
    if (data.stock) data.stock = Number(data.stock);
    if (typeof data.requires_prescription !== "undefined") {
      data.requires_prescription =
        data.requires_prescription === "true" ||
        data.requires_prescription === true;
    }

    processStripsLogic(data);

    const result = await uploadStream(file.buffer);
    data.image = result.secure_url;

    try {
      const embeddingText = `Product: ${data.name}. Category: ${categoryExists.name}. Description: ${data.description}`;
      data.embeddings = await getEmbedding(embeddingText);
    } catch (embedError) {
      console.error(
        "Failed to generate embedding for new product:",
        embedError.message,
      );
    }

    const newProduct = await ProductRepository.createProduct(data);
    NotificationService.checkAndNotifyLowStock(newProduct).catch((err) =>
      console.error(err.message),
    );

    return newProduct;
  },

  getAllProducts: async (queryParams) => {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = queryParams.sort || "createdAt";
    const sortOrder = queryParams.order === "asc" ? 1 : -1;

    if (isNaN(page) || page < 1)
      throw new BadRequestError("Invalid page number");
    if (isNaN(limit) || limit < 1 || limit > 100)
      throw new BadRequestError("Limit must be between 1 and 100");

    const filters = { is_deleted: false, is_active: true };

    if (queryParams.search) {
      filters.$or = [
        { name: { $regex: queryParams.search, $options: "i" } },
        { description: { $regex: queryParams.search, $options: "i" } },
      ];
    } else if (queryParams.name) {
      filters.name = { $regex: queryParams.name, $options: "i" };
    }

    if (queryParams.top_selling !== undefined)
      filters.top_selling = queryParams.top_selling === "true";
    if (queryParams.is_active !== undefined)
      filters.is_active =
        queryParams.is_active === "false" ? { $ne: true } : true;

    if (queryParams.category) {
      filters.category = queryParams.category;
    } else if (queryParams.categoryName) {
      const categoryDoc = await CategoryService.getCategoryByNameOrSlug(
        queryParams.categoryName,
      );
      if (categoryDoc) {
        filters.category = categoryDoc._id;
      } else {
        return {
          products: [],
          pagination: {
            totalItems: 0,
            totalPages: 0,
            currentPage: page,
            limit,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
      }
    }

    if (queryParams.minPrice || queryParams.maxPrice) {
      filters.price = {};
      if (queryParams.minPrice)
        filters.price.$gte = Number(queryParams.minPrice);
      if (queryParams.maxPrice)
        filters.price.$lte = Number(queryParams.maxPrice);
    }

    if (
      queryParams.requires_prescription !== undefined &&
      queryParams.requires_prescription !== ""
    ) {
      filters.requires_prescription =
        queryParams.requires_prescription === "true";
    }

    if (queryParams.has_strips !== undefined && queryParams.has_strips !== "")
      filters.has_strips = queryParams.has_strips === "true";
    if (queryParams.inStock !== undefined && queryParams.inStock !== "")
      filters.stock = queryParams.inStock === "true" ? { $gt: 0 } : 0;
    if (queryParams.minRating)
      filters.rating = { $gte: Number(queryParams.minRating) };

    const sortObj = { [sortBy]: sortOrder };

    const [products, total] = await Promise.all([
      ProductRepository.findProductsPaginated(filters, skip, limit, sortObj),
      ProductRepository.countProducts(filters),
    ]);

    return {
      products,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  },

  getOneProduct: async (id) => {
    const product = await ProductRepository.findProductById(id);
    if (!product) throw new NotFoundError("Product not found");

    product.reviews = await ReviewService.getReviewsForProduct(id);
    return product;
  },

  deleteProduct: async (id) => {
    const product = await ProductRepository.softDeleteProduct(id);
    if (!product) throw new NotFoundError("Product not found");
  },

  updateProduct: async (id, bodyData, file) => {
    const body = { ...bodyData };

    if (file) {
      const result = await uploadStream(file.buffer, {
        folder: "products",
        fetch_format: "auto",
        quality: "auto",
        width: 600,
        crop: "limit",
      });
      body.image = result.secure_url;
    }

    if (!body || Object.keys(body).length === 0)
      throw new BadRequestError("Update data is required");

    if (body.price) body.price = Number(body.price);
    if (body.stock) body.stock = Number(body.stock);
    if (typeof body.requires_prescription !== "undefined") {
      body.requires_prescription =
        body.requires_prescription === "true" ||
        body.requires_prescription === true;
    }

    if (
      typeof body.has_strips !== "undefined" ||
      body.strip_count ||
      body.strips_per_box
    ) {
      processStripsLogic(body);
    }

    let categoryExists = null;
    if (body.category) {
      categoryExists = await CategoryService.getCategoryById(body.category);
    }

    if (body.name || body.description || body.category) {
      try {
        const existingProduct =
          await ProductRepository.findProductByIdForUpdate(id);
        if (existingProduct) {
          await existingProduct.populate("category");
          const finalName = body.name || existingProduct.name;
          const finalDescription =
            body.description || existingProduct.description;
          const finalCategoryName = categoryExists
            ? categoryExists.name
            : existingProduct.category
              ? existingProduct.category.name
              : "";

          const embeddingText = `Product: ${finalName}. Category: ${finalCategoryName}. Description: ${finalDescription}`;
          body.embeddings = await getEmbedding(embeddingText);
        }
      } catch (embedError) {
        console.error(
          "Failed to generate embedding for updated product:",
          embedError.message,
        );
      }
    }

    const product = await ProductRepository.updateProduct(id, body);
    if (!product) throw new NotFoundError("Product not found");

    NotificationService.checkAndNotifyLowStock(product).catch((err) => console.error(err.message));
    return product;
  },

  getSavedProducts: async (userId) => {
    const saved = await ProductRepository.findSavedProductsByUser(userId);
    return saved
      .map((item) => item.product)
      .filter((product) => product && !product.is_deleted);
  },

  toggleSavedProduct: async (userId, productId) => {
    const productExists =
      await ProductRepository.findProductByIdForUpdate(productId);
    if (!productExists) throw new NotFoundError("Product not found");

    const existingSave = await ProductRepository.findSavedProduct(
      userId,
      productId,
    );

    if (existingSave) {
      await Promise.all([
        ProductRepository.deleteSavedProduct(existingSave._id),
        ProductRepository.incrementSaveCount(productId, -1),
      ]);
      return { isSaved: false };
    } else {
      await Promise.all([
        ProductRepository.createSavedProduct(userId, productId),
        ProductRepository.incrementSaveCount(productId, 1),
      ]);
      return { isSaved: true };
    }
  },

  findProductByIdAndActive: async (productId) => {
    return await ProductRepository.findProductByIdForUpdate(productId);
  },

  updateProductStats: async (productId, rating, numReviews) => {
    return await ProductRepository.updateProduct(productId, {
      rating,
      num_reviews: numReviews,
    });
  },

  searchProductsIdsByName: async (regex) => {
    return await ProductRepository.findMatchingProducts(regex);
  },

  getProductByIdForTransaction: async (productId, session) => {
    return await ProductRepository.getProductByIdForTransaction(
      productId,
      session,
    );
  },

  countProducts: async (query) => await ProductRepository.countProducts(query),

  getProductsByIds: async (productIds, selectFields) =>
    await ProductRepository.findProductsByIds(productIds, selectFields),

  getActiveProducts: async (selectFields) =>
    await ProductRepository.findActiveProducts(selectFields),

  updateProductStock: async (productId, incValue, session = null) => {
    return await ProductRepository.updateProductStock(
      productId,
      incValue,
      session,
    );
  },

  searchProductsForChat: async (cleanWords) => {
    return await ProductRepository.searchByWordsForChat(cleanWords);
  },

  getTopRecommendedProducts: async () => {
    return await ProductRepository.findTopRecommendedForChat();
  },
};
