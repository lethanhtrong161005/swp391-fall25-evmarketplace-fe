import { useEffect } from "react";
import { releaseModeratorListing } from "@services/moderator/listing.moderator.service";

// Kiểm tra khóa đã hết hạn
const isLockExpired = (record) => {
  if (!record.moderation_locked_at) return false;

  const lockTime = new Date(record.moderation_locked_at).getTime();
  const expiryTime = lockTime + record.moderation_lock_ttl_secs * 1000;
  return Date.now() > expiryTime;
};

export function useModeratorAutoHealing(
  queueData,
  fetchQueue,
  fetchMyLocks,
  searchTitle,
  handleRefresh
) {
  // Tự động nhả khóa hết hạn khi dữ liệu thay đổi
  useEffect(() => {
    if (!queueData?.items || queueData.items.length === 0) {
      return;
    }

    const autoReleaseExpiredLocks = async () => {
      const expiredItems = queueData.items.filter(isLockExpired);

      if (expiredItems.length > 0) {
        // Nhả khóa tất cả tin hết hạn
        const releasePromises = expiredItems.map(async (item) => {
          const listingId = item.listingId || item.id;
          if (listingId) {
            try {
              await releaseModeratorListing(listingId);
              return true;
            } catch {
              return false;
            }
          }
          return false;
        });

        await Promise.allSettled(releasePromises);

        // Cập nhật dữ liệu sau khi nhả khóa
        await Promise.all([
          fetchQueue(queueData.page, searchTitle),
          fetchMyLocks(searchTitle),
        ]);
      }
    };

    autoReleaseExpiredLocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueData?.items?.length, queueData?.page, searchTitle]);

  // Kiểm tra định kỳ khóa hết hạn (mỗi 30 giây)
  useEffect(() => {
    if (!queueData?.items || queueData.items.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      if (queueData?.items && queueData.items.length > 0) {
        const expiredItems = queueData.items.filter(isLockExpired);

        if (expiredItems.length > 0) {
          handleRefresh();
        }
      }
    }, 30000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueData?.items?.length, handleRefresh]);

  return {
    isLockExpired,
  };
}
