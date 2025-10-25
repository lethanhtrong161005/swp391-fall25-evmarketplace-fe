import { useState, useCallback } from "react";
import { App } from "antd";
import {
  getModeratorQueue,
  getModeratorMyLocks,
} from "@services/moderator/listing.moderator.service";

export function useModeratorData() {
  // Quản lý dữ liệu hàng đợi và tin đang duyệt
  const [queueData, setQueueData] = useState({
    items: [],
    total: 0,
    page: 0,
    size: 10,
    hasNext: false,
  });

  const [myLocks, setMyLocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const { message } = App.useApp();

  // Chuyển đổi dữ liệu từ API sang format chuẩn
  const transformListingData = useCallback((apiItem) => {
    return {
      id: apiItem.listingId?.toString() || "",
      listingId: apiItem.listingId,
      title: apiItem.title || "",
      categoryId: apiItem.categoryId,
      categoryName: apiItem.categoryName || "",
      price: apiItem.price || 0,
      status: apiItem.status || "PENDING",
      visibility: apiItem.visibility || "NORMAL",
      createdAt: apiItem.createdAt || new Date().toISOString(),
      lockedBy: apiItem.lockedBy,
      lockedAt: apiItem.lockedAt,
      ttlRemainSec: apiItem.ttlRemainSec,
      ttlConfiguredSec: apiItem.ttlConfiguredSec,
      lockedById: apiItem.lockedById,
      lockedByName: apiItem.lockedByName,
      lockExpiresAt: apiItem.lockExpiresAt,
      moderation_locked_at: apiItem.lockedAt || apiItem.moderation_locked_at,
      moderation_lock_ttl_secs:
        apiItem.ttlConfiguredSec || apiItem.moderation_lock_ttl_secs,
    };
  }, []);

  // Lấy danh sách tin chờ duyệt
  const fetchQueue = useCallback(
    async (page = 0, title = null) => {
      try {
        setLoading(true);
        const response = await getModeratorQueue({
          page,
          size: 10,
          status: "PENDING",
          title,
        });

        if (response?.data) {
          const {
            items,
            total,
            page: currentPage,
            size,
            hasNext,
          } = response.data;
          const transformedItems = items.map(transformListingData);

          setQueueData({
            items: transformedItems,
            total,
            page: currentPage,
            size,
            hasNext,
          });
        } else {
          setQueueData({
            items: [],
            total: 0,
            page: 0,
            size: 10,
            hasNext: false,
          });
        }
      } catch (error) {
        message.error("Không thể tải danh sách tin đăng chờ duyệt");
        setQueueData({
          items: [],
          total: 0,
          page: 0,
          size: 10,
          hasNext: false,
        });
      } finally {
        setLoading(false);
      }
    },
    [transformListingData, message]
  );

  // Lấy danh sách tin đang duyệt
  const fetchMyLocks = useCallback(
    async (title = null) => {
      try {
        const response = await getModeratorMyLocks({ title });

        if (response?.data) {
          const transformedItems = response.data.map(transformListingData);
          setMyLocks(transformedItems);
        } else {
          setMyLocks([]);
        }
      } catch (error) {
        message.error("Không thể tải danh sách tin đăng đang duyệt");
        setMyLocks([]);
      }
    },
    [transformListingData, message]
  );

  return {
    queueData,
    myLocks,
    loading,
    fetchQueue,
    fetchMyLocks,
    transformListingData,
    setQueueData,
    setMyLocks,
  };
}
