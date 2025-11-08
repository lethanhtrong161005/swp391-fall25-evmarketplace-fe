import cookieUtils from "@utils/cookieUtils";

/**
 * Get account database ID from JWT payload
 * Checks multiple possible fields in order of preference:
 * uid -> accountId -> userId -> id -> sub (if number)
 * @param {object} user - User object from AuthContext (optional, will decode from cookie if not provided)
 * @returns {number|null} Account database ID, or null if not found
 */
export const getAccountDbId = (user = null) => {
  let payload = user;
  
  // If user is not provided, decode from cookie
  if (!payload) {
    payload = cookieUtils.decodeJwt();
  }
  
  if (!payload) {
    return null;
  }
  
  // Try multiple fields in order of preference
  // Backend typically uses 'uid' or 'accountId' for database ID
  const dbId = 
    payload?.uid ?? 
    payload?.accountId ?? 
    payload?.userId ?? 
    payload?.id ?? 
    (typeof payload?.sub === "number" ? payload.sub : null);
  
  // Convert to number if it's a valid value
  if (dbId != null) {
    const numId = typeof dbId === "number" ? dbId : parseInt(dbId);
    return isNaN(numId) ? null : numId;
  }
  
  return null;
};

/**
 * Normalize user ID to number for consistent comparison
 * @param {number|string|null|undefined} userId - User ID (can be number, string, or null/undefined)
 * @returns {number|null} Normalized user ID as number, or null if invalid
 */
export const normalizeUserId = (userId) => {
  if (userId == null) return null;
  const numId = typeof userId === "number" ? userId : parseInt(userId);
  return isNaN(numId) ? null : numId;
};

/**
 * Check if a message was sent by the current user
 * @param {object} message - Message object with senderId or sender.id
 * @param {number|null} currentUserId - Current user's database ID (normalized number)
 * @returns {boolean} True if message was sent by current user
 */
export const isMessageFromCurrentUser = (message, currentUserId) => {
  if (currentUserId == null) return false;
  
  const senderIdRaw = message?.senderId || message?.sender?.id;
  if (senderIdRaw == null) return false;
  
  const senderId = normalizeUserId(senderIdRaw);
  if (senderId == null) return false;
  
  return senderId === currentUserId;
};

