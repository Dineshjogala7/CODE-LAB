const express = require("express");
const router = express.Router()
const {createRoom,joinRoom} = require('../controllers/generateRoom');

router.get("/getroom",authHandler,createRoom);
router.post("/joinroom",authHandler,joinRoom);

module.exports = {router}