const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken') // used to create, sign, and verify tokens

const config = require('./config')

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.getToken = function (user) {
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 })
}

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwtPayload, done) => {
    console.log(`JWT payload: ${JSON.stringify(jwtPayload)}`)
    User.findOne({ _id: jwtPayload._id }, (err, user) => {
      if (err) {
        return done(err, false)
      } else if (user) {
        return done(null, user)
      } else {
        done(null, false)
      }
    })
  })
)

exports.verifyUser = passport.authenticate('jwt', { session: false })
exports.verifyAdmin = (req, res, next) => {
  if (req.user.admin) {
    next()
  } else {
    const err = new Error('You are not authorized to perform this operation!')
    err.status = 403
    next(err)
  }
}
