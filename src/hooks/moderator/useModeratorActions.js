import { useState, useCallback } from "react";
import { App } from "antd";
import {
  releaseModeratorListing,
  extendModeratorListing,
  approveModeratorListing,
  rejectModeratorListing,
} from "@services/moderator/listing.moderator.service";

export function useModeratorActions() {
  // Quản lý trạng thái các hành động duyệt
  const [isRejecting, setIsRejecting] = useState(false);

  const { message } = App.useApp();

  // Duyệt tin đăng
  const handleApprove = useCallback(
    async (
      reviewingItem,
      handleCloseModal,
      fetchQueue,
      fetchMyLocks,
      queueData,
      searchTitle
    ) => {
      if (!reviewingItem) {
        message.error("Không tìm thấy thông tin tin đăng");
        return;
      }

      const listingId =
        reviewingItem.listingId ||
        reviewingItem.listing?.id ||
        reviewingItem.id;

      if (!listingId) {
        message.error("Không tìm thấy ID tin đăng");
        return;
      }

      try {
        await approveModeratorListing(listingId);
        message.success("Đã duyệt tin đăng thành công");

        handleCloseModal();

        // Cập nhật dữ liệu sau khi duyệt
        await Promise.all([
          fetchQueue(queueData.page, searchTitle),
          fetchMyLocks(searchTitle),
        ]);
      } catch {
        message.error("Không thể duyệt tin đăng");
      }
    },
    []
  );

  // Từ chối tin đăng
  const handleConfirmReject = useCallback(
    async (
      reason,
      reviewingItem,
      handleCloseModal,
      fetchQueue,
      fetchMyLocks,
      queueData,
      searchTitle
    ) => {
      if (!reason || !reason.trim()) {
        message.error("Vui lòng nhập lý do từ chối");
        return;
      }

      if (!reviewingItem) {
        message.error("Không tìm thấy thông tin tin đăng");
        return;
      }

      const listingId =
        reviewingItem.listingId ||
        reviewingItem.listing?.id ||
        reviewingItem.id;

      if (!listingId) {
        message.error("Không tìm thấy ID tin đăng");
        return;
      }

      try {
        await rejectModeratorListing(listingId, reason);
        message.success("Đã từ chối tin đăng thành công");

        handleCloseModal();

        // Cập nhật dữ liệu sau khi từ chối
        await Promise.all([
          fetchQueue(queueData.page, searchTitle),
          fetchMyLocks(searchTitle),
        ]);
      } catch (error) {
        if (error?.response?.status === 500) {
          message.error(
            "Lỗi server: Không thể từ chối tin đăng. Vui lòng thử lại sau."
          );
        } else if (error?.response?.status === 400) {
          message.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.");
        } else if (error?.message) {
          message.error(`Lỗi: ${error.message}`);
        } else {
          message.error("Không thể từ chối tin đăng. Vui lòng thử lại.");
        }
      }
    },
    []
  );

  // Nhả khóa tin đăng
  const handleRelease = useCallback(
    async (
      reviewingItem,
      handleCloseModal,
      fetchQueue,
      fetchMyLocks,
      queueData,
      searchTitle
    ) => {
      if (!reviewingItem) {
        message.error("Không tìm thấy thông tin tin đăng");
        return;
      }

      const listingId =
        reviewingItem.listingId ||
        reviewingItem.listing?.id ||
        reviewingItem.id;

      if (!listingId) {
        message.error("Không tìm thấy ID tin đăng");
        return;
      }

      try {
        await releaseModeratorListing(listingId);
        message.success("Đã nhả khóa tin đăng");

        handleCloseModal();

        // Cập nhật dữ liệu sau khi nhả khóa
        await Promise.all([
          fetchQueue(queueData.page, searchTitle),
          fetchMyLocks(searchTitle),
        ]);
      } catch {
        message.error("Không thể nhả khóa tin đăng");
      }
    },
    []
  );

  // Gia hạn thời gian duyệt
  const handleExtend = useCallback(
    async (reviewingItem, setReviewingItem, setMyLocks, setQueueData) => {
      if (!reviewingItem) {
        message.error("Không tìm thấy thông tin tin đăng");
        return;
      }

      const listingId =
        reviewingItem.listingId ||
        reviewingItem.listing?.id ||
        reviewingItem.id;

      if (!listingId) {
        message.error("Không tìm thấy ID tin đăng");
        return;
      }

      try {
        const response = await extendModeratorListing(listingId);

        if (response?.data) {
          const {
            ttlRemainSec,
            ttlConfiguredSec,
            lockedById,
            lockedByName,
            lockExpiresAt,
            lockedAt,
          } = response.data || {};

          // Cập nhật thông tin khóa trong modal
          setReviewingItem((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              ttlRemainSec,
              ttlConfiguredSec,
              lockedById,
              lockedByName,
              lockExpiresAt,
              lockedAt,
            };
          });

          // Cập nhật danh sách tin đang duyệt
          setMyLocks((prev) =>
            Array.isArray(prev)
              ? prev.map((item) =>
                  (item.listingId || item.id) === listingId
                    ? {
                        ...item,
                        ttlRemainSec,
                        ttlConfiguredSec,
                        lockedById,
                        lockedByName,
                        lockExpiresAt,
                        lockedAt,
                      }
                    : item
                )
              : prev
          );

          // Cập nhật hàng đợi
          setQueueData((prev) => {
            if (!prev || !Array.isArray(prev.items)) return prev;
            return {
              ...prev,
              items: prev.items.map((item) =>
                (item.listingId || item.id) === listingId
                  ? {
                      ...item,
                      ttlRemainSec,
                      ttlConfiguredSec,
                      lockedById,
                      lockedByName,
                      lockExpiresAt,
                      lockedAt,
                    }
                  : item
              ),
            };
          });
          message.success("Đã gia hạn thời gian duyệt");
        }
      } catch {
        message.error("Không thể gia hạn thời gian duyệt");
      }
    },
    []
  );

  // Bật/tắt chế độ từ chối
  const handleEnterRejectMode = useCallback(() => {
    setIsRejecting(true);
  }, []);

  const handleExitRejectMode = useCallback(() => {
    setIsRejecting(false);
  }, []);

  return {
    isRejecting,
    handleApprove,
    handleConfirmReject,
    handleRelease,
    handleExtend,
    handleEnterRejectMode,
    handleExitRejectMode,
    setIsRejecting,
  };
}
