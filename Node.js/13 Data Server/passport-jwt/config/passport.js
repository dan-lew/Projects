const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const JWTStrategy = require("passport-jwt").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Load User Model
const User = require("../models/User");

module.exports = passport => {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match User in mongo DB
      User.findOne({ email: email })
        .then(userData => {
          if (!userData) {
            return done(null, false, {
              message: "this email is not registered"
            });
          }
          // Match password
          bcrypt.compare(password, userData.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {

              return done(null, userData);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  const optionsJWT = {
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: process.env.JWT_SECRET
  };
  passport.use(
    "jwt",
    new JWTStrategy(optionsJWT, (jwt_payload, done) => {
      try {
        User.findOne({ email: jwt_payload.id }).then(user => {
          if (user) {
            console.log("User is found in the database");
            done(null, user);
          } else {
            console.log("User not found in the database");
            done(null, false);
          }
        });
      } catch (error) {
        done(error);
      }
    })
  );
  const optionsFacebook = {
    clientID: "2588440934707785",
    clientSecret: "ab80c3a547c407601ddd61a9a73c0ab1",
    callbackURL: "http://localhost:5007/users/auth/facebook/callback",
    profileFields: ["id", "displayName", "email"]
  };
  passport.use(
    "facebook",
    new FacebookStrategy(
      optionsFacebook,
      (accessToken, refreshToken, profile, done) => {
        User.findOne({ email: profile._json.email })
          .then(userData => {
            if (!userData) {
              return done(null, false, {
                message: "This email is not registered"
              });
            } else {
              return done(null, userData);
            }
          })
          .catch(err => {
            done(err);
          });
      }
    )
  );
  passport.use(
    new GitHubStrategy(
      {
        clientID: "9af009aeeff59908cf38",
        clientSecret: "a777159f8a901a447c256877cd0daa2b5cbb97f2",
        callbackURL: "http://localhost:5007/users/auth/github/callback",
        profileFields: ["email"]
      },
      function(accessToken, refreshToken, profile, done) {
        console.log(profile._json.email);
        User.findOne({ email: profile._json.email }, function(err, user) {
          return done(err, user);
        });
      }
    )
  );
  // passport.use(
  //   new GoogleStrategy(
  //     {
  //       consumerKey: GOOGLE_CONSUMER_KEY,
  //       consumerSecret: GOOGLE_CONSUMER_SECRET,
  //       callbackURL: "http://localhost:5007/users/auth/google/callback"
  //     },
  //     function(token, tokenSecret, profile, done) {
  //       User.findOne({ email: profile._json.email }, function(err, user) {
  //         return done(err, user);
  //       });
  //     }
  //   )
  // );
};