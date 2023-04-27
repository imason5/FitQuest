const session = require("express-session");
const MongoStore = require("connect-mongo");

module.exports = (app) => {
  app.set("trust proxy", 1);

  // Configure and use the session middleware
  app.use(
    session({
      secret: process.env.SESS_SECRET || "myFallbackSecret",
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        // Set the cookie expiration time (in milliseconds)
        maxAge: 60 * 60 * 1000, // 60 mins * 60 secs * 1000 ms === 1 hour
      },

      store: MongoStore.create({
        mongoUrl:
          process.env.MONGODB_URI || "mongodb://127.0.0.1/fitness-tracker",
      }),
    })
  );
};
