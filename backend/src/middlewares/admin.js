export const adminMiddleware = (req, res, next) => {
  // for now simple check (later add role in user model)
  if (req.user.role !== "admin@example.com") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};
