import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserService } from "./user.service.js";
import { UserRepository } from "./user.repository.js";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "../../utils/errors.js";
import cloudinary from "../../config/cloudinary.js";
import bcrypt from "bcrypt";

vi.mock("./user.repository.js");
vi.mock("bcrypt");
vi.mock("../../config/cloudinary.js", () => ({
  default: {
    uploader: {
      upload_stream: vi.fn(),
    },
  },
}));

describe("UserService", () => {
  const mockUserId = "user123";

  beforeEach(() => {
    vi.clearAllMocks();
    cloudinary.uploader.upload_stream.mockImplementation((options, cb) => {
      cb(null, { secure_url: "https://cloudinary.com/avatar.webp" });
      return { end: vi.fn() };
    });
  });

  describe("getUserById", () => {
    it("should throw NotFoundError if user not found", async () => {
      UserRepository.findByIdWithoutSensitiveData.mockResolvedValue(null);
      await expect(UserService.getUserById(mockUserId)).rejects.toThrow(
        NotFoundError,
      );
    });

    it("should return user if found", async () => {
      const mockUser = { _id: mockUserId, name: "Test" };
      UserRepository.findByIdWithoutSensitiveData.mockResolvedValue(mockUser);
      const result = await UserService.getUserById(mockUserId);
      expect(result).toEqual(mockUser);
    });
  });

  describe("getUserProfile", () => {
    it("should throw NotFoundError if profile not found", async () => {
      UserRepository.findProfileById.mockResolvedValue(null);
      await expect(UserService.getUserProfile(mockUserId)).rejects.toThrow(
        NotFoundError,
      );
    });

    it("should return user profile if found", async () => {
      const mockProfile = { _id: mockUserId, email: "test@test.com" };
      UserRepository.findProfileById.mockResolvedValue(mockProfile);
      const result = await UserService.getUserProfile(mockUserId);
      expect(result).toEqual(mockProfile);
    });
  });

  describe("updateAvatar", () => {
    it("should throw BadRequestError if no file provided", async () => {
      await expect(UserService.updateAvatar(mockUserId, null)).rejects.toThrow(
        BadRequestError,
      );
    });

    it("should upload image and update repository", async () => {
      const mockFile = { buffer: Buffer.from("test") };
      UserRepository.updateById.mockResolvedValue({
        avatar: "https://cloudinary.com/avatar.webp",
      });

      const result = await UserService.updateAvatar(mockUserId, mockFile);

      expect(cloudinary.uploader.upload_stream).toHaveBeenCalled();
      expect(UserRepository.updateById).toHaveBeenCalledWith(mockUserId, {
        avatar: "https://cloudinary.com/avatar.webp",
      });
      expect(result.avatar).toBe("https://cloudinary.com/avatar.webp");
    });
  });

  describe("updateUser", () => {
    it("should throw NotFoundError if target user not found", async () => {
      UserRepository.findById.mockResolvedValue(null);
      await expect(
        UserService.updateUser(mockUserId, "admin", {}),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw ForbiddenError if non-super_admin tries to modify super_admin", async () => {
      UserRepository.findById.mockResolvedValue({ role: "super_admin" });
      await expect(
        UserService.updateUser(mockUserId, "admin", {}),
      ).rejects.toThrow(ForbiddenError);
    });

    it("should throw BadRequestError if no valid fields are provided", async () => {
      UserRepository.findById.mockResolvedValue({ role: "user" });
      await expect(
        UserService.updateUser(mockUserId, "user", { invalid: "field" }),
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw BadRequestError if email is already in use by another user", async () => {
      UserRepository.findById.mockResolvedValue({
        role: "user",
        email: "old@test.com",
      });
      UserRepository.findEmailInUseByOthers.mockResolvedValue(true);

      await expect(
        UserService.updateUser(mockUserId, "user", { email: "new@test.com" }),
      ).rejects.toThrow(BadRequestError);
    });

    it("should update user successfully filtering invalid fields and merging address", async () => {
      const targetUser = {
        role: "user",
        email: "old@test.com",
        address: { city: "Cairo", street: "Old St" },
      };
      UserRepository.findById.mockResolvedValue(targetUser);
      UserRepository.updateById.mockResolvedValue({ updated: true });

      await UserService.updateUser(mockUserId, "user", {
        name: "New Name",
        invalid_field: "drop",
        address: { street: "New St" },
      });

      expect(UserRepository.updateById).toHaveBeenCalledWith(mockUserId, {
        name: "New Name",
        address: { city: "Cairo", street: "New St" },
      });
    });
  });

  describe("updateUserRole", () => {
    it("should throw NotFoundError if user not found", async () => {
      UserRepository.findById.mockResolvedValue(null);
      await expect(
        UserService.updateUserRole(mockUserId, "admin", "super_admin"),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw ForbiddenError if target user is super_admin", async () => {
      UserRepository.findById.mockResolvedValue({ role: "super_admin" });
      await expect(
        UserService.updateUserRole(mockUserId, "user", "super_admin"),
      ).rejects.toThrow(ForbiddenError);
    });

    it("should throw ForbiddenError if admin tries to assign super_admin role", async () => {
      UserRepository.findById.mockResolvedValue({ role: "user" });
      await expect(
        UserService.updateUserRole(mockUserId, "super_admin", "admin"),
      ).rejects.toThrow(ForbiddenError);
    });

    it("should update role and save user successfully", async () => {
      const mockUser = { _id: mockUserId, role: "user" };
      UserRepository.findById.mockResolvedValue(mockUser);
      UserRepository.saveUser.mockResolvedValue(true);

      const result = await UserService.updateUserRole(
        mockUserId,
        "admin",
        "super_admin",
      );

      expect(mockUser.role).toBe("admin");
      expect(UserRepository.saveUser).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ _id: mockUserId, role: "admin" });
    });
  });

  describe("createUser", () => {
    it("should throw ForbiddenError if admin creates a super_admin", async () => {
      await expect(
        UserService.createUser("admin", { role: "super_admin" }),
      ).rejects.toThrow(ForbiddenError);
    });

    it("should hash password, create user, and omit password from response", async () => {
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashedPassword");

      const mockCreatedUser = {
        _id: "new123",
        name: "John",
        password: "hashedPassword",
        toObject: function () {
          return { ...this };
        },
      };
      UserRepository.createUser.mockResolvedValue(mockCreatedUser);

      const result = await UserService.createUser("admin", {
        name: "John",
        email: "john@test.com",
        password: "123",
      });

      expect(bcrypt.hash).toHaveBeenCalledWith("123", "salt");
      expect(UserRepository.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          password: "hashedPassword",
          role: "user",
        }),
      );
      expect(result.password).toBeUndefined();
      expect(result.name).toBe("John");
    });
  });

  describe("getAllUsers", () => {
    it("should apply filters, search, sort and paginate correctly", async () => {
      UserRepository.findUsersPaginated.mockResolvedValue([{ name: "User1" }]);
      UserRepository.countUsers.mockResolvedValue(25);

      const result = await UserService.getAllUsers({
        page: 2,
        limit: 10,
        role: "admin",
        is_active: "true",
        search: "test",
        sortBy: "name",
        sortOrder: "asc",
      });

      expect(UserRepository.findUsersPaginated).toHaveBeenCalledWith(
        expect.objectContaining({
          role: "admin",
          is_active: true,
          is_deleted: false,
          $or: expect.any(Array),
        }),
        10,
        10,
        { name: 1 },
      );
      expect(result.pagination).toEqual({
        total: 25,
        page: 2,
        limit: 10,
        totalPages: 3,
        hasNextPage: true,
        hasPrevPage: true,
      });
    });
  });

  describe("deleteUser", () => {
    it("should throw NotFoundError if user not found", async () => {
      UserRepository.findById.mockResolvedValue(null);
      await expect(UserService.deleteUser(mockUserId)).rejects.toThrow(
        NotFoundError,
      );
    });

    it("should throw ForbiddenError if trying to delete a super_admin", async () => {
      UserRepository.findById.mockResolvedValue({ role: "super_admin" });
      await expect(UserService.deleteUser(mockUserId)).rejects.toThrow(
        ForbiddenError,
      );
    });

    it("should soft delete user successfully", async () => {
      const mockUser = { _id: mockUserId, is_deleted: false, is_active: true };
      UserRepository.findById.mockResolvedValue(mockUser);
      UserRepository.saveUser.mockResolvedValue(true);

      await UserService.deleteUser(mockUserId);

      expect(mockUser.is_deleted).toBe(true);
      expect(mockUser.is_active).toBe(false);
      expect(UserRepository.saveUser).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("toggleUserActive", () => {
    it("should throw NotFoundError if user not found", async () => {
      UserRepository.findById.mockResolvedValue(null);
      await expect(
        UserService.toggleUserActive(mockUserId, false),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw ForbiddenError if trying to toggle a super_admin", async () => {
      UserRepository.findById.mockResolvedValue({ role: "super_admin" });
      await expect(
        UserService.toggleUserActive(mockUserId, false),
      ).rejects.toThrow(ForbiddenError);
    });

    it("should toggle active status and save", async () => {
      const mockUser = { _id: mockUserId, is_active: true };
      UserRepository.findById.mockResolvedValue(mockUser);

      const result = await UserService.toggleUserActive(mockUserId, false);

      expect(mockUser.is_active).toBe(false);
      expect(UserRepository.saveUser).toHaveBeenCalledWith(mockUser);
      expect(result).toBe(false);
    });
  });

  describe("Passthrough methods", () => {
    it("should call underlying repository methods correctly", async () => {
      UserService.getCouriersList();
      expect(UserRepository.findCouriers).toHaveBeenCalled();

      UserService.searchUsersIdsByName("test");
      expect(UserRepository.findMatchingUsers).toHaveBeenCalledWith("test");

      UserService.countUsers({ role: "user" });
      expect(UserRepository.countUsers).toHaveBeenCalledWith({ role: "user" });

      UserService.getUsersByIds([mockUserId], "name");
      expect(UserRepository.findUsersByIds).toHaveBeenCalledWith(
        [mockUserId],
        "name",
      );

      UserService.findCourierById(mockUserId);
      expect(UserRepository.findCourierById).toHaveBeenCalledWith(mockUserId);

      UserService.getAuthUser(mockUserId);
      expect(UserRepository.findUserForAuth).toHaveBeenCalledWith(mockUserId);
    });
  });
});
