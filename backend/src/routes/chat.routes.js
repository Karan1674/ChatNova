const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const chatController  = require("../controllers/chat.controller")


const router = express.Router();


router.post('/create-chat', authMiddleware.authUser, chatController.createChat);
router.get('/get-chats', authMiddleware.authUser, chatController.getChats);
router.get('/:chatId/get-messages', authMiddleware.authUser, chatController.getMessageByChatId);
router.put('/rename/:chatId', authMiddleware.authUser, chatController.renameChat);
router.delete('/delete/:chatId', authMiddleware.authUser, chatController.deleteChat);

module.exports = router;