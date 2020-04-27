const express = require('express')
const router = express.Router()
const {createUser, fundAccount, checkBalance, bookFlight} = require("../controllers/travel")

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

router.get("/", (_request, response) => { response.json({ info: "Welcome to SpaceX	Odyssey" }); });
router.post('/users', createUser)
router.post('/users/:name/fund-account', fundAccount)
router.get("/users/:name/balance", checkBalance)
router.post("/users/:name/book-flight", bookFlight)

module.exports = router
