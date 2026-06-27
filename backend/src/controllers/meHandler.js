const meHandler = (req, res) => {
  res.status(200).json({
    user: {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
    },
  });
};

export default meHandler;