const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")
const db = require("../models")
const User = db.User

module.exports = (app) => {
  // passport init
  app.use(passport.initialize())
  app.use(passport.session())

  // user authentication
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ where: { email } })
        .then((user) => {
          if (!user)
            return done(null, false, {
              message: "This email has not registered!"
            })
          return bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch)
              return done(null, false, {
                message: "Incorrect Password."
              })
            return done(null, user)
          })
        })
        .catch((error) => done(error, false))
    })
  )

  // serialize and deserialize
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then((user) => {
        user = user.toJSON()
        done(null, user)
      })
      .catch((error) => done(error, false))
  })
}
