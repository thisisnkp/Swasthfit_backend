const express = require("express");
const router = express.Router();
const loginMiddleware = require("../../../login.middleware");
const {registerVendor, loginVendor} = require("./controller/ecom.controller")

router.post("/login", loginMiddleware(), loginVendor);
router.post("/register", loginMiddleware(), registerVendor);