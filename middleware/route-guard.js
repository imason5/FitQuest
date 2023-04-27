const redirectIf = (condition, redirectPath) => (req, res, next) => {
  if (condition(req)) {
    return res.redirect(redirectPath);
  }
  next();
};

const isLoggedIn = redirectIf(
  (req) => !req.session.loggedInUser,
  "/auth/login"
);

const isLoggedOut = redirectIf((req) => req.session.loggedInUser, "/");

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
