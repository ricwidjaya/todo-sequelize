const express = require("express")
const passport = require("passport")
const bcrypt = require("bcryptjs")
const router = express.Router()
const db = require("../../models")
const Todo = db.Todo
const User = db.User

router.get("/login", (req, res) => {
  const user = req.user
  if (user) return res.redirect("/")
  res.render("login")
})

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "./login"
  })
)

router.get("/register", (req, res) => {
  res.render("register")
})

router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ where: { email } }).then((user) => {
    if (user) {
      console.log("User already exists.")
      return res.render("register", {
        name,
        email,
        password,
        confirmPassword
      })
    }
    return bcrypt
      .genSalt(10)
      .then((salt) => {
        return bcrypt.hash(password, salt)
      })
      .then((hash) =>
        User.create({
          name,
          email,
          password: hash
        })
      )
      .then(() => res.redirect("/"))
      .catch((error) => console.log(error))
  })
})

router.get("/logout", (req, res) => {
  res.send("logout")
})

module.exports = router
