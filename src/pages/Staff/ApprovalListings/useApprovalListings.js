import { useState, useEffect } from "react";
import { message } from "antd";
import { get, post } from "@/utils/apiCaller";

export function useApprovalListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState(null);
  const [pendingRejectId, setPendingRejectId] = useState(null);

  // Fetch danh sách tin đăng có trạng thái PENDING
  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await get("/api/staff/listing", {
        page: 0,
        size: 100,
        sort: "createdAt",
        dir: "desc",
      });

      if (response?.success && response?.data?.items) {
        // Lọc chỉ lấy tin có trạng thái PENDING
        const pendingListings = response.data.items
          .filter((item) => item.status === "PENDING")
          .map(transformListingData);
        setListings(pendingListings);
      } else {
        setListings([]);
      }
    } catch (error) {
      console.error("Error fetching approval listings:", error);
      message.error("Không thể tải danh sách tin đăng");
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Transform dữ liệu từ API
  const transformListingData = (apiItem) => {
    return {
      id: apiItem.id?.toString() || "",
      title: apiItem.title || "",
      brand: apiItem.brand || "",
      model: apiItem.model || "",
      year: apiItem.year || null,
      price: apiItem.price || 0,
      province: apiItem.province || "",
      status: apiItem.status || "PENDING",
      sellerName: apiItem.sellerName || "",
      createdAt: apiItem.createdAt || new Date().toISOString(),
      thumbnailUrl: apiItem.thumbnailUrl || "",
      description: apiItem.description || "",
      categoryId: apiItem.categoryId,
      isConsigned: apiItem.isConsigned || false,
    };
  };

  // Xem chi tiết tin đăng
  const handleViewDetail = (listing) => {
    setSelectedListing(listing);
    setModalVisible(true);
  };

  // Đóng modal chi tiết
  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedListing(null);
  };

  // Duyệt tin đăng
  const handleApprove = async (listingId) => {
    try {
      // Gọi API duyệt tin đăng
      const response = await post(
        `/api/staff/listing/${listingId}/approve`,
        {}
      );

      if (response?.success) {
        message.success("Đã duyệt tin đăng thành công");
        fetchListings(); // Reload danh sách
      } else {
        throw new Error("Failed to approve listing");
      }
    } catch (error) {
      console.error("Error approving listing:", error);
      message.error("Không thể duyệt tin đăng");
    }
  };

  // Từ chối tin đăng
  const handleReject = (listingId) => {
    setPendingRejectId(listingId);
    setRejectionReason("");
  };

  // Xác nhận từ chối với lý do
  const handleConfirmReject = async () => {
    if (!rejectionReason || !rejectionReason.trim()) {
      message.error("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      // Gọi API từ chối tin đăng với lý do
      const response = await post(`/api/listing/${pendingRejectId}/reject`, {
        reason: rejectionReason.trim(),
      });

      if (response?.success) {
        message.success("Đã từ chối tin đăng thành công");
        setRejectionReason(null);
        setPendingRejectId(null);
        fetchListings(); // Reload danh sách
      } else {
        throw new Error("Failed to reject listing");
      }
    } catch (error) {
      console.error("Error rejecting listing:", error);
      message.error("Không thể từ chối tin đăng");
    }
  };

  // Load danh sách khi component mount
  useEffect(() => {
    fetchListings();
  }, []);

  return {
    listings,
    loading,
    selectedListing,
    modalVisible,
    rejectionReason,
    setRejectionReason,
    handleViewDetail,
    handleApprove,
    handleReject,
    handleModalCancel,
    handleConfirmReject,
    fetchListings,
  };
}
