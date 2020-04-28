const express = require('express')
const router = express.Router()
const {createUser, fundAccount, checkBalance, bookFlight, displayStations, displaySpacecrafts} = require("../controllers/travel")

router.get("/", (_request, response) => { response.json({ info: "Welcome to SpaceX	Odyssey, see the README.md to view available routes" }); });
router.post('/users', createUser)
router.post('/users/:name/fund-account', fundAccount)
router.get("/users/:name/balance", checkBalance)
router.post("/users/:name/book-flight", bookFlight)
router.get("/stations", displayStations)
router.get("/spacecrafts", displaySpacecrafts)

module.exports = router
