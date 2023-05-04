const pwdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
const usernameRegex = /^[A-Za-z0-9_]{3,20}$/;
const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

const validateSignupInput = (req, res, next) => {
  const { username, password, email } = req.body;

  console.log("From validateSignupInput:", req.body);

  if (!usernameRegex.test(username)) {
    return res.status(400).render("auth/signup", {
      errorMessage:
        "Username must be 3-20 characters long and contain only letters, numbers, and underscores.",
    });
  }

  if (!pwdRegex.test(password)) {
    return res.status(400).render("auth/signup", {
      errorMessage:
        "Password must be at least 8 characters long, and contain at least one letter and one number.",
    });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please enter a valid email address.",
    });
  }

  next();
};

module.exports = {
  validateSignupInput,
};
