import { getDisplayName, getDisplayContact, getAvatarUrl } from "@utils/userDataUtils";

export function useSidebarProfile(user) {
  const displayName = getDisplayName(user);
  const displayEmail = getDisplayContact(user);
  const avatarUrl = getAvatarUrl(user);

  return {
    displayName,
    displayEmail,
    avatarUrl,
  };
}
