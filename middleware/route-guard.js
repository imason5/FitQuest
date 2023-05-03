const isLoggedIn = (req, res, next) => {
  if (!req.session.loggedInUser) {
    return res.render("index", { navSwitch: false });
  }
  next();
};

const isLoggedOut = (req, res, next) => {
  if (req.session.loggedInUser) {
    return res.render("index", { navSwitch: false });
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};

/* Original middleware here just in case */

/* const redirectIf = (condition, redirectPath) => (req, res, next) => {
  if (condition(req)) {
    return res.redirect(redirectPath);
  }
  next();
};

const isLoggedIn = redirectIf((req) => !req.session.loggedInUser, "/login");
const isLoggedOut = redirectIf((req) => req.session.loggedInUser, "/"); */
