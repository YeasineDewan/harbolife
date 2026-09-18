import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "./auth.service.js";
import { UserRepository } from "../../modules/User/user.repository.js";
import {
  hashPassword,
  ComparePassword,
} from "../../services/password.service.js";
import { generateToken } from "../../services/jwt.service.js";
import {
  ConflictError,
  NotFoundError,
  BadRequestError,
} from "../../utils/errors.js";
import { DEFAULT_ROLE } from "../../utils/constants.js";

vi.mock("../../modules/User/user.repository.js");
vi.mock("../../services/password.service.js");
vi.mock("../../services/jwt.service.js");
vi.mock("../../services/email.service.js");

describe("AuthService", () => {
  const mockName = "Abdelrahman";
  const mockEmail = "Test@Example.com";
  const normalizedEmail = "test@example.com";
  const mockPassword = "password123";
  const hashedPassword = "hashedPassword123";
  const mockToken = "jwt_token_string";

  const mockUser = {
    _id: "user123",
    name: mockName,
    email: normalizedEmail,
    role: "user",
    avatar: null,
    is_active: true,
    is_deleted: false,
    toObject: function () {
      return this;
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("should throw ConflictError if email exists and is active", async () => {
      UserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(
        AuthService.register(mockName, mockEmail, mockPassword),
      ).rejects.toThrow(ConflictError);
    });

    it("should reactivate account if user is deleted", async () => {
      const deletedUser = { ...mockUser, is_deleted: true, is_active: false };
      UserRepository.findByEmail.mockResolvedValue(deletedUser);
      hashPassword.mockResolvedValue(hashedPassword);
      UserRepository.updateById.mockResolvedValue(mockUser);
      generateToken.mockReturnValue(mockToken);

      const result = await AuthService.register(
        mockName,
        mockEmail,
        mockPassword,
      );

      expect(UserRepository.updateById).toHaveBeenCalledWith(deletedUser._id, {
        name: mockName,
        password: hashedPassword,
        role: DEFAULT_ROLE,
        is_deleted: false,
        is_active: true,
      });
      expect(result.message).toBe("Account reactivated successfully");
      expect(result.token).toBe(mockToken);
    });

    it("should create new user if email does not exist", async () => {
      UserRepository.findByEmail.mockResolvedValue(null);
      hashPassword.mockResolvedValue(hashedPassword);
      UserRepository.createUser.mockResolvedValue(mockUser);
      generateToken.mockReturnValue(mockToken);

      const result = await AuthService.register(
        mockName,
        mockEmail,
        mockPassword,
      );

      expect(UserRepository.createUser).toHaveBeenCalledWith({
        name: mockName,
        email: normalizedEmail,
        password: hashedPassword,
        avatar: null,
      });
      expect(result.message).toBe("Registered successfully");
      expect(result.token).toBe(mockToken);
      expect(result.data.email).toBe(normalizedEmail);
    });
  });

  describe("login", () => {
    it("should throw NotFoundError if user not found", async () => {
      UserRepository.findByEmailWithPassword.mockResolvedValue(null);

      await expect(AuthService.login(mockEmail, mockPassword)).rejects.toThrow(
        NotFoundError,
      );
    });

    it("should throw NotFoundError if user is deleted", async () => {
      const deletedUser = { ...mockUser, is_deleted: true };
      UserRepository.findByEmailWithPassword.mockResolvedValue(deletedUser);

      await expect(AuthService.login(mockEmail, mockPassword)).rejects.toThrow(
        NotFoundError,
      );
    });

    it("should throw NotFoundError if user is not active", async () => {
      const inactiveUser = { ...mockUser, is_active: false };
      UserRepository.findByEmailWithPassword.mockResolvedValue(inactiveUser);

      await expect(AuthService.login(mockEmail, mockPassword)).rejects.toThrow(
        NotFoundError,
      );
    });

    it("should throw BadRequestError if password does not match", async () => {
      const userWithPassword = { ...mockUser, password: hashedPassword };
      UserRepository.findByEmailWithPassword.mockResolvedValue(
        userWithPassword,
      );
      ComparePassword.mockResolvedValue(false);

      await expect(AuthService.login(mockEmail, mockPassword)).rejects.toThrow(
        BadRequestError,
      );
    });

    it("should login successfully and return token and user data", async () => {
      const userWithPassword = { ...mockUser, password: hashedPassword };
      UserRepository.findByEmailWithPassword.mockResolvedValue(
        userWithPassword,
      );
      ComparePassword.mockResolvedValue(true);
      generateToken.mockReturnValue(mockToken);

      const result = await AuthService.login(mockEmail, mockPassword);

      expect(ComparePassword).toHaveBeenCalledWith(
        mockPassword,
        hashedPassword,
      );
      expect(generateToken).toHaveBeenCalledWith(
        userWithPassword._id,
        userWithPassword.role,
      );
      expect(result.message).toBe("Logged in successfully");
      expect(result.token).toBe(mockToken);
      expect(result.data).not.toHaveProperty("password");
    });
  });
});
