import { ProductService } from "./product.service.js";
import { validateObjectId } from "../../utils/validateObjectId.js";

export const createProductController = async (req, res, next) => {
  try {
    const product = await ProductService.createProduct(req.body, req.file);
    res
      .status(201)
      .json({ message: "Product created successfully", data: product });
  } catch (error) {
    next(error);
  }
};

export const GetAllProductsController = async (req, res, next) => {
  try {
    if (req.query.category) validateObjectId(req.query.category, "category id");
    const result = await ProductService.getAllProducts(req.query);
    res.json({
      message: "Products fetched successfully",
      data: result.products,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const GetOneProductController = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectId(id, "product id");
    const product = await ProductService.getOneProduct(id);
    res.json({ message: "Product fetched successfully", data: product });
  } catch (error) {
    next(error);
  }
};

export const DeleteProductController = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectId(id, "product id");
    await ProductService.deleteProduct(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateProductController = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectId(id, "product id");
    if (req.body.category) validateObjectId(req.body.category, "category id");
    const product = await ProductService.updateProduct(id, req.body, req.file);
    res.json({ message: "Product updated successfully", data: product });
  } catch (error) {
    next(error);
  }
};

export const GetSavedProductsController = async (req, res, next) => {
  try {
    const products = await ProductService.getSavedProducts(req.user._id);
    res
      .status(200)
      .json({ message: "Saved products fetched successfully", data: products });
  } catch (error) {
    next(error);
  }
};

export const ToggleSavedProductController = async (req, res, next) => {
  try {
    const { productId } = req.params;
    validateObjectId(productId, "product id");
    const result = await ProductService.toggleSavedProduct(
      req.user._id,
      productId,
    );
    res.status(200).json({
      message: result.isSaved
        ? "Product added to wishlist"
        : "Product removed from wishlist",
      isSaved: result.isSaved,
    });
  } catch (error) {
    next(error);
  }
};
