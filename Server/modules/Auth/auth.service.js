import { UserRepository } from "../../modules/User/user.repository.js";
import {
  hashPassword,
  ComparePassword,
} from "../../services/password.service.js";
import { generateToken } from "../../services/jwt.service.js";
import { DEFAULT_ROLE } from "../../utils/constants.js";
import {
  ConflictError,
  NotFoundError,
  BadRequestError,
} from "../../utils/errors.js";

const formatUserResponse = (user) => {
  const userObj = typeof user.toObject === "function" ? user.toObject() : user;
  const { _id, name, email, role, avatar } = userObj;
  return { _id, name, email, role, avatar };
};

export const AuthService = {
  register: async (name, email, password) => {
    const normalizedEmail = email.toLowerCase();

    const existingUser = await UserRepository.findByEmail(normalizedEmail);

    if (existingUser?.is_active && !existingUser?.is_deleted) {
      throw new ConflictError("Email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const savedUser = existingUser?.is_deleted
      ? await UserRepository.updateById(existingUser._id, {
          name,
          password: hashedPassword,
          role: DEFAULT_ROLE,
          is_deleted: false,
          is_active: true,
        })
      : await UserRepository.createUser({
          name,
          email: normalizedEmail,
          password: hashedPassword,
          avatar: null,
        });

    const token = generateToken(savedUser._id, savedUser.role);
    return {
      message: existingUser?.is_deleted
        ? "Account reactivated successfully"
        : "Registered successfully",
      data: formatUserResponse(savedUser),
      token,
    };
  },

  login: async (email, password) => {
    const normalizedEmail = email.toLowerCase();

    const user = await UserRepository.findByEmailWithPassword(normalizedEmail);

    if (!user || user.is_deleted || !user.is_active) {
      throw new NotFoundError("Invalid email or password");
    }

    const isMatch = await ComparePassword(password, user.password);

    if (!isMatch) {
      throw new BadRequestError("Invalid email or password");
    }

    const token = generateToken(user._id, user.role);

    return {
      message: "Logged in successfully",
      data: formatUserResponse(user),
      token,
    };
  },
};
