import jwt from "jsonwebtoken";

export const accessToken = ({
  userId,
  role,
}: {
  userId: string;
  role: string;
}): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET as string;
  if (!secret) {
    throw new Error("ACCESS_TOKEN_SECRET environment variable is not defined");
  }
  return jwt.sign({ userId, role }, secret, { expiresIn: "15m" });
};

export const refressToken = ({
  userId,
  role,
}: {
  userId: string;
  role: string;
}): string => {
  const secret = process.env.REFRESS_TOKEN_SECRET as string;
  if (!secret) {
    throw new Error("REFRESS_TOKEN_SECRET environment variable is not defined");
  }
  return jwt.sign({ userId, role }, secret, { expiresIn: "7d" });
};
