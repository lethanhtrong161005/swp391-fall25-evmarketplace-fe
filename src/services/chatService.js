import { get, post } from "@utils/apiCaller";
import config from "@config";

/**
 * Open or get existing conversation with another user
 * This will create a new conversation in DB if it doesn't exist,
 * or return existing conversation if it already exists.
 * @param {number|string} otherId - ID of the other user
 * @returns {Promise} Conversation object with id
 */
export const openConversation = async (otherId) => {
  // API: POST /api/chat/open?otherId={otherId}
  // This matches chatapp_frontend implementation
  console.log("Opening conversation with otherId:", otherId);
  const result = await post(`/api/chat/open`, {}, { otherId });
  console.log("Open conversation response:", result);
  return result;
};

/**
 * Send text message
 * @param {number} conversationId - Conversation ID
 * @param {number|string} recipientId - Recipient user ID
 * @param {string} text - Message text content
 * @returns {Promise}
 */
export const sendText = async (conversationId, recipientId, text) => {
  console.log("[chatService] sendText:", { conversationId, recipientId, text });
  const result = await post(
    `/api/chat/${conversationId}/text`,
    { text },
    { recipientId }
  );
  console.log("[chatService] sendText response:", result);
  return result;
};

/**
 * Send media message (image or video)
 * @param {number} conversationId - Conversation ID
 * @param {number|string} recipientId - Recipient user ID
 * @param {File} file - Media file
 * @param {string} type - Media type: "IMAGE" or "VIDEO"
 * @returns {Promise}
 */
export const sendMedia = async (conversationId, recipientId, file, type) => {
  const formData = new FormData();
  formData.append("file", file);

  return post(
    `/api/chat/${conversationId}/media`,
    formData,
    { recipientId, type }
  );
};

/**
 * Load messages from conversation
 * @param {number} conversationId - Conversation ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise} Page object with messages
 */
export const loadMessages = async (conversationId, page = 0, size = 20) => {
  console.log("[chatService] loadMessages:", { conversationId, page, size });
  try {
    const result = await get(`/api/chat/${conversationId}/messages`, { page, size });
    console.log("[chatService] loadMessages response:", JSON.stringify(result, null, 2));
    console.log("[chatService] loadMessages response type:", typeof result);
    console.log("[chatService] loadMessages response keys:", result ? Object.keys(result) : "null");
    
    if (result?.success && result?.data) {
      const items = result.data.content || result.data.items || [];
      console.log("[chatService] loadMessages items count:", items.length);
      items.forEach((msg, idx) => {
        console.log(`[chatService] Message ${idx}:`, {
          id: msg.id,
          senderId: msg.senderId || msg.sender?.id,
          recipientId: msg.recipientId || msg.recipient?.id,
          textContent: msg.textContent || msg.content,
          type: msg.type,
          createdAt: msg.createdAt,
        });
      });
    } else if (Array.isArray(result)) {
      console.log("[chatService] loadMessages: response is array, count:", result.length);
    } else if (result?.content || result?.items) {
      const items = result.content || result.items || [];
      console.log("[chatService] loadMessages: response has content/items at root, count:", items.length);
    }
    
    return result;
  } catch (error) {
    console.error("[chatService] loadMessages error:", error);
    throw error;
  }
};

/**
 * Mark conversation as seen
 * @param {number} conversationId - Conversation ID
 * @returns {Promise}
 */
export const markSeen = async (conversationId) => {
  return post(`/api/chat/${conversationId}/seen`);
};

/**
 * Get list of conversations for current user
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise} Page object with conversations
 */
export const getConversations = async (page = 0, size = 20) => {
  console.log("[chatService] getConversations:", { page, size });
  try {
    const result = await get(`/api/chat/conversations`, { page, size });
    console.log("[chatService] getConversations response:", JSON.stringify(result, null, 2));
    console.log("[chatService] getConversations response type:", typeof result);
    console.log("[chatService] getConversations response keys:", result ? Object.keys(result) : "null");
    
    // Handle different response formats
    if (!result) {
      console.warn("[chatService] getConversations: response is null or undefined");
      return { success: false, data: { content: [], items: [] } };
    }
    
    // Check if result has success field
    if (result.success !== undefined) {
      if (result.success && result.data) {
        const items = result.data.content || result.data.items || result.data || [];
        console.log("[chatService] getConversations items count:", items.length);
        return result;
      } else {
        console.warn("[chatService] getConversations: success is false or no data", result);
        return { success: false, data: { content: [], items: [] }, ...result };
      }
    }
    
    // Handle direct array response
    if (Array.isArray(result)) {
      console.log("[chatService] getConversations: response is array, count:", result.length);
      return { success: true, data: { content: result, items: result } };
    }
    
    // Handle response with content/items at root
    if (result.content || result.items) {
      console.log("[chatService] getConversations: response has content/items at root");
      return { success: true, data: { content: result.content || [], items: result.items || [] } };
    }
    
    console.warn("[chatService] getConversations: unknown response format", result);
    return { success: false, data: { content: [], items: [] }, rawResponse: result };
  } catch (error) {
    console.error("[chatService] getConversations error:", error);
    return { success: false, error: error.message, data: { content: [], items: [] } };
  }
};

