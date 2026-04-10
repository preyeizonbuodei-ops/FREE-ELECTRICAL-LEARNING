const RoleValidation = (role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return res.status(401).json({ success: false, message: "unauthorized route" });
    }
    next();
  };
};

module.exports = RoleValidation;