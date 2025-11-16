import { get, post } from "@utils/apiCaller";
import config from "@config";

/**
 * Open or get existing conversation with another user
 * This will create a new conversation in DB if it doesn't exist,
 * or return existing conversation if it already exists.
 * @param {number|string} otherId - ID of the other user
 * @param {number|string|null} listingId - Optional listing ID for context
 * @returns {Promise} Conversation object with id
 */
export const openConversation = async (otherId, listingId = null) => {
  // API: POST /api/chat/open?otherId={otherId}&listingId={listingId}
  const params = { otherId };
  if (listingId != null) {
    params.listingId = listingId;
  }
  const result = await post(`/api/chat/open`, {}, params);
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
  const result = await post(
    `/api/chat/${conversationId}/text`,
    { text },
    { recipientId }
  );
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
  try {
    const result = await get(`/api/chat/${conversationId}/messages`, { page, size });
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
 * Get unread message count across all conversations
 * @returns {Promise<number>} Total unread count
 */
export const getUnreadCount = async () => {
  try {
    const result = await get(`/api/chat/unread-count`);
    
    // API returns a number directly
    if (typeof result === 'number') {
      return result;
    }
    
    // Handle wrapped response format
    if (result?.success !== undefined && result?.data !== undefined) {
      return typeof result.data === 'number' ? result.data : 0;
    }
    
    // Handle direct object with count field
    if (result?.count !== undefined) {
      return typeof result.count === 'number' ? result.count : 0;
    }
    
    console.warn("[chatService] getUnreadCount: unknown response format", result);
    return 0;
  } catch (error) {
    console.error("[chatService] getUnreadCount error:", error);
    return 0;
  }
};

/**
 * Get list of conversations for current user
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise} Page object with conversations
 */
export const getConversations = async (page = 0, size = 20) => {
  try {
    const result = await get(`/api/chat/conversations`, { page, size });
    
    // Handle different response formats
    if (!result) {
      console.warn("[chatService] getConversations: response is null or undefined");
      return { success: false, data: { content: [], items: [] } };
    }
    
    // Check if result has success field
    if (result.success !== undefined) {
      if (result.success && result.data) {
        return result;
      } else {
        console.warn("[chatService] getConversations: success is false or no data", result);
        return { success: false, data: { content: [], items: [] }, ...result };
      }
    }
    
    // Handle direct array response
    if (Array.isArray(result)) {
      return { success: true, data: { content: result, items: result } };
    }
    
    // Handle response with content/items at root
    if (result.content || result.items) {
      return { success: true, data: { content: result.content || [], items: result.items || [] } };
    }
    
    console.warn("[chatService] getConversations: unknown response format", result);
    return { success: false, data: { content: [], items: [] }, rawResponse: result };
  } catch (error) {
    console.error("[chatService] getConversations error:", error);
    return { success: false, error: error.message, data: { content: [], items: [] } };
  }
};

