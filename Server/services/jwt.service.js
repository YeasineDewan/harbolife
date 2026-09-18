import Jwt from "jsonwebtoken";
import { UnAuthorizedError } from "../utils/errors.js";

export const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = "7d";
  const token = Jwt.sign({ id, role }, secret, { expiresIn });
  return token;
};

export const verifyToken = (token) => {
  try {
    const decodedToken = Jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken;
  } catch (error) {
    throw new UnAuthorizedError("Invalid or expired Token");
  }
};
