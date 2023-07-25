const express = require("express");
const {
    createNewUser,
    loginUser,
    getAllUsers
} = require("../controllers/user.controller");
const verifToken = require("../utils/verifToken");
const router = express.Router();
router.post("/register", createNewUser);
router.post("/login", loginUser);
router.get(
    "/",
    verifToken,
    getAllUsers
);

module.exports = router;
