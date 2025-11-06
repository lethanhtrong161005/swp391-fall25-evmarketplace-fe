import { useState, useEffect, useMemo } from "react";
import { getUserProfile } from "@services/accountService";
import { useAuth } from "@hooks/useAuth";
import { normalizeUserData } from "@utils/userDataUtils";

/**
 * Hook to fetch and manage user profile data
 * Automatically fetches profile when user is logged in
 */
export function useUserProfile() {
  const { user, isLoggedIn } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create stable user identifier for dependency
  const userIdentifier = useMemo(
    () => ({
      id: user?.sub || user?.phoneNumber,
      isLoggedIn,
    }),
    [user?.sub, user?.phoneNumber, isLoggedIn]
  );

  // Fetch profile data when user is logged in
  useEffect(() => {
    if (!userIdentifier.isLoggedIn || !userIdentifier.id) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getUserProfile();

        // Kiểm tra response không null và có data trước khi sử dụng
        if (response && response?.status === 200 && response?.success && response?.data) {
          // Normalize the profile data to handle both snake_case and camelCase
          const normalizedProfile = normalizeUserData(response.data);
          setProfile(normalizedProfile);
        } else {
          setError("Failed to fetch profile");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userIdentifier]); // Re-fetch when user identifier changes

  // Merge JWT user data with profile data for complete user info
  const enhancedUser = profile
    ? normalizeUserData({
        ...user,
        ...profile,
        // Keep profile object for backward compatibility
        profile: {
          ...user?.profile,
          ...profile,
        },
      })
    : user;

  const refetchProfile = async () => {
    if (!isLoggedIn) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getUserProfile();

      // Kiểm tra response không null và có data trước khi sử dụng
      if (response && response?.status === 200 && response?.success && response?.data) {
        // Normalize the profile data to handle both snake_case and camelCase
        const normalizedProfile = normalizeUserData(response.data);
        setProfile(normalizedProfile);
      }
    } catch (err) {
      setError(err.message || "Failed to refresh profile");
    } finally {
      setLoading(false);
    }
  };

  return {
    user: enhancedUser,
    profile,
    loading,
    error,
    refetchProfile,
  };
}
