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

/**
 * Get the other participant from a conversation (userA or userB that is not the current user)
 * @param {object} conversation - Conversation object with userA and userB
 * @param {number|null} currentUserId - Current user's database ID (normalized number)
 * @returns {object|null} The other participant user object with profile info, or null if not found
 */
export const getOtherParticipant = (conversation, currentUserId) => {
  if (!conversation || currentUserId == null) {
    // Fallback: if conversation has otherParticipant field, use it
    return conversation?.otherParticipant || null;
  }
  
  const userAId = normalizeUserId(conversation.userA?.id || conversation.userAId);
  const userBId = normalizeUserId(conversation.userB?.id || conversation.userBId);
  
  // Determine which user is the "other" participant
  if (userAId === currentUserId && conversation.userB) {
    // Current user is userA, return userB
    return {
      id: conversation.userB.id,
      name: conversation.userB.profile?.fullName || conversation.userB.profile?.name,
      fullName: conversation.userB.profile?.fullName,
      avatarUrl: conversation.userB.profile?.avatarUrl,
      avatarFilename: conversation.userB.profile?.avatarUrl ? 
        conversation.userB.profile.avatarUrl.split('/').pop() : null,
      email: conversation.userB.email,
      phoneNumber: conversation.userB.phoneNumber,
      profile: conversation.userB.profile,
    };
  } else if (userBId === currentUserId && conversation.userA) {
    // Current user is userB, return userA
    return {
      id: conversation.userA.id,
      name: conversation.userA.profile?.fullName || conversation.userA.profile?.name,
      fullName: conversation.userA.profile?.fullName,
      avatarUrl: conversation.userA.profile?.avatarUrl,
      avatarFilename: conversation.userA.profile?.avatarUrl ? 
        conversation.userA.profile.avatarUrl.split('/').pop() : null,
      email: conversation.userA.email,
      phoneNumber: conversation.userA.phoneNumber,
      profile: conversation.userA.profile,
    };
  }
  
  // Fallback: if conversation has otherParticipant field, use it
  return conversation?.otherParticipant || null;
};

