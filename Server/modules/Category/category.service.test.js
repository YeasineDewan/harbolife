import { describe, it, expect, vi, beforeEach } from "vitest";
import { CategoryService } from "./category.service.js";
import { CategoryRepository } from "./category.repository.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../utils/errors.js";
import cloudinary from "../../config/cloudinary.js";

vi.mock("./category.repository.js");
vi.mock("../../config/cloudinary.js", () => ({
  default: {
    uploader: {
      upload_stream: vi.fn(),
    },
  },
}));

describe("CategoryService", () => {
  const mockFile = { buffer: Buffer.from("test-buffer") };
  const mockCategory = {
    _id: "cat123",
    name: "Test Category",
    slug: "test-category",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    cloudinary.uploader.upload_stream.mockImplementation((options, cb) => {
      cb(null, { secure_url: "https://cloudinary.com/test.webp" });
      return { end: vi.fn() };
    });
  });

  describe("createCategory", () => {
    it("should throw BadRequestError if name is missing", async () => {
      await expect(
        CategoryService.createCategory(null, "description", mockFile),
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw BadRequestError if file is missing", async () => {
      await expect(
        CategoryService.createCategory("Test Category", "description", null),
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw ConflictError if category already exists", async () => {
      CategoryRepository.findByName.mockResolvedValue(mockCategory);
      await expect(
        CategoryService.createCategory(
          "Test Category",
          "description",
          mockFile,
        ),
      ).rejects.toThrow(ConflictError);
    });

    it("should throw error if cloudinary upload fails", async () => {
      CategoryRepository.findByName.mockResolvedValue(null);
      cloudinary.uploader.upload_stream.mockImplementation((options, cb) => {
        cb(new Error("Cloudinary error"), null);
        return { end: vi.fn() };
      });

      await expect(
        CategoryService.createCategory(
          "Test Category",
          "description",
          mockFile,
        ),
      ).rejects.toThrow("Cloudinary error");
    });

    it("should create category successfully and return it", async () => {
      CategoryRepository.findByName.mockResolvedValue(null);
      CategoryRepository.createCategory.mockResolvedValue(mockCategory);

      const result = await CategoryService.createCategory(
        "Test Category",
        "description",
        mockFile,
      );

      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        expect.objectContaining({ folder: "categories", format: "webp" }),
        expect.any(Function),
      );
      expect(CategoryRepository.createCategory).toHaveBeenCalledWith({
        name: "Test Category",
        description: "description",
        image: "https://cloudinary.com/test.webp",
        slug: "test-category",
      });
      expect(result).toEqual(mockCategory);
    });
  });

  describe("getAllCategories", () => {
    it("should return paginated categories without search", async () => {
      CategoryRepository.findAllPaginated.mockResolvedValue({
        totalItems: 20,
        categories: [mockCategory],
      });

      const result = await CategoryService.getAllCategories(null, 2, 5);

      expect(CategoryRepository.findAllPaginated).toHaveBeenCalledWith(
        { is_active: true, is_deleted: false },
        5,
        5,
      );
      expect(result.pagination).toEqual({
        totalItems: 20,
        totalPages: 4,
        currentPage: 2,
        limit: 5,
      });
      expect(result.categories).toEqual([mockCategory]);
    });

    it("should return paginated categories with search filter", async () => {
      CategoryRepository.findAllPaginated.mockResolvedValue({
        totalItems: 1,
        categories: [mockCategory],
      });

      await CategoryService.getAllCategories("keyword", 1, 10);

      expect(CategoryRepository.findAllPaginated).toHaveBeenCalledWith(
        {
          is_active: true,
          is_deleted: false,
          $or: [
            { name: { $regex: "keyword", $options: "i" } },
            { description: { $regex: "keyword", $options: "i" } },
          ],
        },
        0,
        10,
      );
    });
  });

  describe("getCategoryById", () => {
    it("should throw NotFoundError if category not found", async () => {
      CategoryRepository.findById.mockResolvedValue(null);
      await expect(CategoryService.getCategoryById("123")).rejects.toThrow(
        NotFoundError,
      );
    });

    it("should return category if found", async () => {
      CategoryRepository.findById.mockResolvedValue(mockCategory);
      const result = await CategoryService.getCategoryById("123");
      expect(result).toEqual(mockCategory);
    });
  });

  describe("getCategoryBySlug", () => {
    it("should throw NotFoundError if category not found", async () => {
      CategoryRepository.findBySlug.mockResolvedValue(null);
      await expect(
        CategoryService.getCategoryBySlug("slug-test"),
      ).rejects.toThrow(NotFoundError);
    });

    it("should return category if found", async () => {
      CategoryRepository.findBySlug.mockResolvedValue(mockCategory);
      const result = await CategoryService.getCategoryBySlug("slug-test");
      expect(result).toEqual(mockCategory);
    });
  });

  describe("getCategoryByNameOrSlug", () => {
    it("should return category from repository", async () => {
      CategoryRepository.findByNameOrSlug.mockResolvedValue(mockCategory);
      const result =
        await CategoryService.getCategoryByNameOrSlug("identifier");
      expect(CategoryRepository.findByNameOrSlug).toHaveBeenCalledWith(
        "identifier",
      );
      expect(result).toEqual(mockCategory);
    });
  });

  describe("deleteCategory", () => {
    it("should throw NotFoundError if category not found", async () => {
      CategoryRepository.softDelete.mockResolvedValue(null);
      await expect(CategoryService.deleteCategory("123")).rejects.toThrow(
        NotFoundError,
      );
    });

    it("should delete and return category", async () => {
      CategoryRepository.softDelete.mockResolvedValue(mockCategory);
      const result = await CategoryService.deleteCategory("123");
      expect(result).toEqual(mockCategory);
    });
  });

  describe("updateCategory", () => {
    it("should throw NotFoundError if category does not exist", async () => {
      CategoryRepository.findById.mockResolvedValue(null);
      await expect(
        CategoryService.updateCategory("123", { name: "New Name" }),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw BadRequestError if no bodyData and no file are provided", async () => {
      CategoryRepository.findById.mockResolvedValue(mockCategory);
      await expect(
        CategoryService.updateCategory("123", {}, null),
      ).rejects.toThrow(BadRequestError);
      await expect(
        CategoryService.updateCategory("123", null, null),
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw BadRequestError if no valid fields are provided for update", async () => {
      CategoryRepository.findById.mockResolvedValue(mockCategory);
      await expect(
        CategoryService.updateCategory("123", { invalidField: "test" }, null),
      ).rejects.toThrow(BadRequestError);
    });

    it("should update name, generate new slug, upload new image, and filter invalid fields", async () => {
      CategoryRepository.findById.mockResolvedValue(mockCategory);
      CategoryRepository.updateById.mockResolvedValue({
        ...mockCategory,
        name: "New Name",
        slug: "new-name",
      });

      const result = await CategoryService.updateCategory(
        "123",
        { name: "New Name", invalidField: "drop" },
        mockFile,
      );

      expect(cloudinary.uploader.upload_stream).toHaveBeenCalled();
      expect(CategoryRepository.updateById).toHaveBeenCalledWith("123", {
        name: "New Name",
        slug: "new-name",
        image: "https://cloudinary.com/test.webp",
      });
      expect(result.name).toBe("New Name");
    });

    it("should update description only without new image", async () => {
      CategoryRepository.findById.mockResolvedValue(mockCategory);
      CategoryRepository.updateById.mockResolvedValue({
        ...mockCategory,
        description: "New Desc",
      });

      await CategoryService.updateCategory(
        "123",
        { description: "New Desc" },
        null,
      );

      expect(cloudinary.uploader.upload_stream).not.toHaveBeenCalled();
      expect(CategoryRepository.updateById).toHaveBeenCalledWith("123", {
        description: "New Desc",
      });
    });
  });
});
