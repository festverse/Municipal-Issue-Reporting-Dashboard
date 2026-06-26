const { pool } = require('../config/db');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/chats
 * List all active conversations for the logged-in user.
 */
const getChats = catchAsync(async (req, res, _next) => {
  const userId = req.user.id;
  const result = await pool.query(
    `SELECT id, participant1_id, participant2_id, participant1_name, participant2_name, 
            participant1_role, participant2_role, participant1_avatar, participant2_avatar, 
            last_message, updated_at 
     FROM conversations 
     WHERE participant1_id = $1 OR participant2_id = $1 
     ORDER BY updated_at DESC`,
    [userId]
  );

  res.status(200).json({
    status: 'success',
    chats: result.rows,
  });
});

/**
 * POST /api/chats
 * Start a new chat or return existing conversation with a recipient.
 * Body: { recipient_id, recipient_name, recipient_role, recipient_avatar }
 */
const startChat = catchAsync(async (req, res, _next) => {
  const userId = req.user.id;
  const userName = req.user.full_name || 'Citizen';
  const userRole = req.user.role || 'CITIZEN';
  const userAvatar = req.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  const { recipient_id, recipient_name, recipient_role, recipient_avatar } = req.body;

  if (!recipient_id) {
    throw new AppError('Recipient ID is required to start a chat.', 400);
  }

  // Check if conversation already exists between these two participants
  const existing = await pool.query(
    `SELECT id, participant1_id, participant2_id, participant1_name, participant2_name, 
            participant1_role, participant2_role, participant1_avatar, participant2_avatar, 
            last_message, updated_at 
     FROM conversations 
     WHERE (participant1_id = $1 AND participant2_id = $2) 
        OR (participant1_id = $2 AND participant2_id = $1)`,
    [userId, recipient_id]
  );

  if (existing.rowCount > 0) {
    return res.status(200).json({
      status: 'success',
      chat: existing.rows[0],
    });
  }

  // Create new conversation
  const result = await pool.query(
    `INSERT INTO conversations (participant1_id, participant2_id, participant1_name, participant2_name, participant1_role, participant2_role, participant1_avatar, participant2_avatar, last_message)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, participant1_id, participant2_id, participant1_name, participant2_name, participant1_role, participant2_role, participant1_avatar, participant2_avatar, last_message, updated_at`,
    [userId, recipient_id, userName, recipient_name || 'Engineer', userRole, recipient_role || 'Municipal Rep', userAvatar, recipient_avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', 'Conversation started']
  );

  res.status(201).json({
    status: 'success',
    chat: result.rows[0],
  });
});

/**
 * GET /api/chats/:id/messages
 * Get all messages in a conversation.
 */
const getMessages = catchAsync(async (req, res, _next) => {
  const { id } = req.params;

  const result = await pool.query(
    `SELECT id, conversation_id, sender_id, sender_name, sender_role, text, created_at 
     FROM messages 
     WHERE conversation_id = $1 
     ORDER BY created_at ASC`,
    [id]
  );

  res.status(200).json({
    status: 'success',
    messages: result.rows,
  });
});

/**
 * POST /api/chats/:id/messages
 * Send a message in a conversation.
 * Body: { text }
 */
const sendMessage = catchAsync(async (req, res, _next) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user.id;
  const userName = req.user.full_name || 'User';
  const userRole = req.user.role || 'CITIZEN';

  if (!text) {
    throw new AppError('Message text cannot be empty.', 400);
  }

  // Insert message
  const result = await pool.query(
    `INSERT INTO messages (conversation_id, sender_id, sender_name, sender_role, text)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, conversation_id, sender_id, sender_name, sender_role, text, created_at`,
    [id, userId, userName, userRole, text]
  );

  // Update last_message in conversations table
  await pool.query(
    `UPDATE conversations SET last_message = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
    [text, id]
  );

  res.status(201).json({
    status: 'success',
    message: result.rows[0],
  });
});

module.exports = { getChats, startChat, getMessages, sendMessage };
