import cookieUtils from "@utils/cookieUtils";

export const getAccountDbId = (user = null) => {
  let payload = user;
  
  if (!payload) {
    payload = cookieUtils.decodeJwt();
  }
  
  if (!payload) {
    return null;
  }
  
  const dbId = 
    payload?.uid ?? 
    payload?.accountId ?? 
    payload?.userId ?? 
    payload?.id ?? 
    (typeof payload?.sub === "number" ? payload.sub : null);
  
  if (dbId != null) {
    const numId = typeof dbId === "number" ? dbId : parseInt(dbId);
    return isNaN(numId) ? null : numId;
  }
  
  return null;
};

export const normalizeUserId = (userId) => {
  if (userId == null) return null;
  const numId = typeof userId === "number" ? userId : parseInt(userId);
  return isNaN(numId) ? null : numId;
};

export const isMessageFromCurrentUser = (message, currentUserId) => {
  if (currentUserId == null) return false;
  
  const senderIdRaw = message?.senderId || message?.sender?.id;
  if (senderIdRaw == null) return false;
  
  const senderId = normalizeUserId(senderIdRaw);
  if (senderId == null) return false;
  
  return senderId === currentUserId;
};

export const getOtherParticipant = (conversation, currentUserId) => {
  if (!conversation || currentUserId == null) {
    // Fallback: if conversation has otherParticipant field, use it
    return conversation?.otherParticipant || null;
  }
  
  const userAId = normalizeUserId(conversation.userA?.id || conversation.userAId);
  const userBId = normalizeUserId(conversation.userB?.id || conversation.userBId);
  
  // Determine which user is the "other" participant
  if (userAId === currentUserId && conversation.userB) {
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
  
  return conversation?.otherParticipant || null;
};

