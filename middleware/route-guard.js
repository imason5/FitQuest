/*const redirectIf = (condition, redirectPath) => (req, res, next) => {
  if (condition(req)) {
    return res.redirect(redirectPath);
  }
  next();
};

const isLoggedIn = redirectIf((req) => !req.session.loggedInUser, "/login");

const isLoggedOut = redirectIf((req) => req.session.loggedInUser, "/"); */

// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
  if (!req.session.loggedInUser) {
    return res.render("index", { navSwitch: false });
  }
  next();
};

// if an already logged in user tries to access the login page it
// redirects the user to the home page
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
