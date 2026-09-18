import { UserService } from "./user.service.js";

export const GetUserByIdController = async (req, res, next) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    res.status(200).json({ message: "User fetched successfully", data: user });
  } catch (error) {
    next(error);
  }
};

export const GetUserProfileController = async (req, res, next) => {
  try {
    const user = await UserService.getUserProfile(req.user._id);
    res
      .status(200)
      .json({ message: "User profile fetched successfully", data: user });
  } catch (error) {
    next(error);
  }
};

export const UpdateAvatarController = async (req, res, next) => {
  try {
    const user = await UserService.updateAvatar(req.user.id, req.file);
    res
      .status(200)
      .json({ message: "Avatar updated successfully", data: user });
  } catch (error) {
    next(error);
  }
};

export const UpdateUserController = async (req, res, next) => {
  try {
    const updatedUser = await UserService.updateUser(
      req.params.id,
      req.user.role,
      req.body,
    );
    res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const UpdateUserRoleController = async (req, res, next) => {
  try {
    const data = await UserService.updateUserRole(
      req.params.id,
      req.body.role,
      req.user.role,
    );
    res.status(200).json({ message: "User role updated successfully", data });
  } catch (error) {
    next(error);
  }
};

export const CreateUserController = async (req, res, next) => {
  try {
    const userResponse = await UserService.createUser(req.user.role, req.body);
    res
      .status(201)
      .json({ message: "User created successfully", data: userResponse });
  } catch (error) {
    next(error);
  }
};

export const GetAllUsersController = async (req, res, next) => {
  try {
    const result = await UserService.getAllUsers(req.query);
    res
      .status(200)
      .json({
        message: "Users fetched successfully",
        data: result.users,
        pagination: result.pagination,
      });
  } catch (error) {
    next(error);
  }
};

export const DeleteUserController = async (req, res, next) => {
  try {
    await UserService.deleteUser(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const ToggleUserActiveController = async (req, res, next) => {
  try {
    const isActive = await UserService.toggleUserActive(
      req.params.id,
      req.body.is_active,
    );
    res
      .status(200)
      .json({
        message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      });
  } catch (error) {
    next(error);
  }
};

export const GetCouriersListController = async (req, res, next) => {
  try {
    const couriers = await UserService.getCouriersList();
    res
      .status(200)
      .json({ message: "Couriers fetched successfully", data: couriers });
  } catch (error) {
    next(error);
  }
};
