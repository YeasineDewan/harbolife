import { AuthService } from "./auth.service.js";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const RegisterController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const result = await AuthService.register(name, email, password);

    res.cookie("token", result.token, cookieOptions);

    return res.status(201).json({
      message: result.message,
      data: result.data,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
};

export const LoginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    res.cookie("token", result.token, cookieOptions);

    return res.status(200).json({
      message: result.message,
      data: result.data,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
};

export const LogoutController = async (req, res, next) => {
  try {
    const { maxAge, ...clearOptions } = cookieOptions;

    res.clearCookie("token", clearOptions);

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
