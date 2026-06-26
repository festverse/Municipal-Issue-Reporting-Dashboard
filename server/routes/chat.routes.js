const express = require('express');
const chatController = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Require user authentication for all chat routes
router.use(protect);

router.route('/')
  .get(chatController.getChats)
  .post(chatController.startChat);

router.route('/:id/messages')
  .get(chatController.getMessages)
  .post(chatController.sendMessage);

module.exports = router;
