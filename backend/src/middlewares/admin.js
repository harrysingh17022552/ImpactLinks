export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "This Kind of Request can only be made by Admin" });
  }
  next();
};
