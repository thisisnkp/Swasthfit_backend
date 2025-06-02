const express = require("express");
const router = express.Router();
const {SendQNAData} = require("../controllers/questions.controllers")

router.post("/get/question",SendQNAData);

module.exports = router;