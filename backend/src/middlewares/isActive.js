export const subscriptionMiddleware = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user.subscriptionStatus !== "active") {
    return res.status(403).json({ message: "Subscription required" });
  }

  next();
};
