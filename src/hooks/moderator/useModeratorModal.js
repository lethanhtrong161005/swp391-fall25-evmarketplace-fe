import { useState, useCallback } from "react";
import { App } from "antd";
import {
  claimModeratorListing,
  releaseModeratorListing,
  getListingDetail,
} from "@services/moderator/listing.moderator.service";

export function useModeratorModal() {
  // Quản lý trạng thái modal duyệt tin
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reviewingItem, setReviewingItem] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const { message } = App.useApp();

  // Khóa tin đăng để bắt đầu duyệt
  const handleClaim = useCallback(
    async (
      listingId,
      transformListingData,
      fetchQueue,
      fetchMyLocks,
      queueData,
      searchTitle
    ) => {
      try {
        const response = await claimModeratorListing(listingId);

        if (response?.data) {
          const claimedItem = transformListingData(response.data);
          setReviewingItem(claimedItem);
          setIsModalVisible(true);
          message.success("Đã khóa tin đăng để duyệt");

          // Tải thông tin chi tiết tin đăng
          setIsDetailLoading(true);
          try {
            const detailResponse = await getListingDetail(listingId);
            if (detailResponse?.data) {
              const detailedItem = {
                ...detailResponse.data,
                ttlRemainSec: claimedItem.ttlRemainSec,
                ttlConfiguredSec: claimedItem.ttlConfiguredSec,
                lockedById: claimedItem.lockedById,
                lockedByName: claimedItem.lockedByName,
                lockExpiresAt: claimedItem.lockExpiresAt,
                lockedAt: claimedItem.lockedAt,
              };
              setReviewingItem(detailedItem);
            }
          } catch {
            message.warning(
              "Không thể tải chi tiết tin đăng, hiển thị thông tin cơ bản"
            );
          } finally {
            setIsDetailLoading(false);
          }

          // Cập nhật dữ liệu sau khi khóa
          await Promise.all([
            fetchQueue(queueData.page, searchTitle),
            fetchMyLocks(searchTitle),
          ]);
        }
      } catch {
        message.error("Không thể khóa tin đăng để duyệt");
      }
    },
    []
  );

  // Đóng modal duyệt
  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setReviewingItem(null);
  }, []);

  // Tự động nhả khóa khi hết thời gian
  const handleAutoRelease = useCallback(
    async (fetchQueue, fetchMyLocks, queueData, searchTitle) => {
      if (!reviewingItem) return;

      const listingId =
        reviewingItem.listingId ||
        reviewingItem.listing?.id ||
        reviewingItem.id;

      if (!listingId) {
        handleCloseModal();
        return;
      }

      try {
        await releaseModeratorListing(listingId);
        message.warning("Tin đăng đã được tự động nhả do hết thời gian duyệt");

        handleCloseModal();

        // Cập nhật dữ liệu sau khi nhả khóa
        await Promise.all([
          fetchQueue(queueData.page, searchTitle),
          fetchMyLocks(searchTitle),
        ]);
      } catch {
        message.error("Không thể tự động nhả tin đăng");
        handleCloseModal();
      }
    },
    [reviewingItem, handleCloseModal]
  );

  return {
    isModalVisible,
    reviewingItem,
    isDetailLoading,
    handleClaim,
    handleCloseModal,
    handleAutoRelease,
    setIsModalVisible,
    setReviewingItem,
    setIsDetailLoading,
  };
}
