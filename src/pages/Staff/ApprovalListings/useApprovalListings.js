import { useState, useEffect } from "react";
import { message } from "antd";
import {
  getStaffListings,
  approveStaffListing,
  rejectStaffListing,
} from "@services/staff/listing.staff.service";

export function useApprovalListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch danh sách tin đăng có trạng thái PENDING
  const refresh = async () => {
    try {
      setLoading(true);
      const response = await getStaffListings({
        page: 0,
        size: 100,
        sort: "createdAt",
        dir: "desc",
      });

      if (response?.data?.items) {
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

  // Duyệt tin đăng
  const onApprove = async (rowId) => {
    try {
      await approveStaffListing(rowId);
      message.success("Đã duyệt tin đăng thành công");
      refresh();
    } catch (error) {
      console.error("Error approving listing:", error);
      message.error("Không thể duyệt tin đăng");
    }
  };

  // Từ chối tin đăng
  const onReject = async (rowId) => {
    try {
      await rejectStaffListing(rowId, "Từ chối bởi staff");
      message.success("Đã từ chối tin đăng thành công");
      refresh();
    } catch (error) {
      console.error("Error rejecting listing:", error);
      message.error("Không thể từ chối tin đăng");
    }
  };

  // Load danh sách khi component mount
  useEffect(() => {
    refresh();
  }, []);

  return {
    listings,
    loading,
    refresh,
    onApprove,
    onReject,
  };
}
