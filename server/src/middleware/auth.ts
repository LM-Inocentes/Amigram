import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    let jwt_secret = process.env.JWT_SECRET as string;

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, jwt_secret);
    req.user = verified;
    next();
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
};