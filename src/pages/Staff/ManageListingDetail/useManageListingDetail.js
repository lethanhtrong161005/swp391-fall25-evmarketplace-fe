import React, { useEffect, useMemo, useState } from "react";
import { Grid, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getStaffListingDetail } from "@services/staff/listing.staff.service";

const { useBreakpoint } = Grid;

const CATEGORY_LABEL = {
  EV_CAR: "Xe ô tô",
  E_MOTORBIKE: "Xe máy điện",
  E_BIKE: "Xe đạp điện",
  BATTERY: "Pin",
};

const fmtVND = (n) =>
  Number(n).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const fmtDate = (d) => (d ? new Date(d).toLocaleString("vi-VN") : "—");

export function useManageListingDetail({ modalId } = {}) {
  const nav = useNavigate();
  const { id } = useParams();
  const screens = useBreakpoint();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Get listing detail only
        const targetId = modalId || id;
        const res = await getStaffListingDetail(targetId);
        const listingData = res?.data?.listing || res?.data || res;
        setListing(listingData);
      } catch (e) {
        console.error("Failed to load listing detail:", e);
        message.error("Không tải được chi tiết bài đăng");
      } finally {
        setLoading(false);
      }
    };

    if (modalId || id) {
      load();
    }
  }, [id, modalId]);
  const metaItems = useMemo(() => {
    if (!listing) return [];
    return [
      {
        label: "Danh mục",
        value: CATEGORY_LABEL[listing.category] || listing.category || "—",
      },
      { label: "Hãng", value: listing.brand || "—" },
      { label: "Model", value: listing.model || "—" },
      { label: "Năm", value: listing.year ?? "—" },
      {
        label: "SOH%",
        value: listing.soh_percent != null ? `${listing.soh_percent}%` : "—",
      },
      {
        label: "Dung lượng pin (kWh)",
        value: listing.battery_capacity_kwh ?? "—",
      },
      {
        label: "Số km đã đi",
        value:
          listing.mileage_km != null
            ? `${listing.mileage_km.toLocaleString()} km`
            : "—",
      },
      { label: "Màu sắc", value: listing.color || "—" },
      { label: "Tỉnh/Thành", value: listing.province || "—" },
      { label: "Quận/Huyện", value: listing.district || "—" },
      { label: "Phường/Xã", value: listing.ward || "—" },
      { label: "Địa chỉ", value: listing.address || "—" },
    ];
  }, [listing]);

  const handleBack = () => {
    nav("/staff/listings");
  };

  return {
    loading,
    listing,
    metaItems,
    screens,
    fmtVND,
    fmtDate,
    handleBack,
  };
}
