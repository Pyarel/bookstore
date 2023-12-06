var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const Customer = require("../models/Customer");
const passport = require("passport");
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "Lambton@23";
passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await Customer.findOne({ _id: jwt_payload.id }).exec();
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);
