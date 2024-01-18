const express = require('express');
const router = express.Router();
const {getAllUser,sendRequest} = require('../Controller/userController');
const {authMiddleware} = require("./authMiddleWare")

// router.post("/create-ticket", userController.createTicket)
// router.get("/get-all-ticket", userController.getAllTickets)
router.get("/get_all_user",authMiddleware,getAllUser)
router.post("/send_Request",authMiddleware,sendRequest)





module.exports = router;