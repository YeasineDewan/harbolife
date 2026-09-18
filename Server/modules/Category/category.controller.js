import { CategoryService } from "./category.service.js";
import { validateObjectId } from "../../utils/validateObjectId.js";

export const createCategoryController = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const category = await CategoryService.createCategory(
      name,
      description,
      req.file,
    );

    res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategoriesController = async (req, res, next) => {
  try {
    const { search, page, limit } = req.query;
    const result = await CategoryService.getAllCategories(search, page, limit);

    res.json({
      message: "Categories fetched successfully",
      data: result.categories,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getOneCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectId(id, "category id");
    const category = await CategoryService.getCategoryById(id);

    res.json({
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryBySlugController = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await CategoryService.getCategoryBySlug(slug);

    res.json({
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectId(id, "category id");
    await CategoryService.deleteCategory(id);

    res.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectId(id, "category id");
    const category = await CategoryService.updateCategory(
      id,
      req.body,
      req.file,
    );

    res.json({
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
