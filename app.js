// Import modules
const express = require("express")

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const session = require("express-session")
const exphbs = require("express-handlebars")
const methodOverride = require("method-override")
const routes = require("./routes")

// Init server
const app = express()
const PORT = process.env.PORT

// Setting view engine to express handlebars
app.engine("hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }))
app.set("view engine", "hbs")

// Http request
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

// App
app.use(routes)

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
