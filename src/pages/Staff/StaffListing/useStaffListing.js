import { useCallback, useEffect, useState } from "react";
import {
  fetchConsignmentListings,
  getListingDetailById,
} from "@services/listing.service";
import { message } from "antd";
import {
  createOrder,
  updateConsignmentListing,
} from "../../../services/staff/staffConsignmentService";

function useDebounce(value, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function useStaffListing() {
  const [filters, setFilters] = useState({
    q: "",
    itemType: undefined,
    status: undefined,
    visibility: undefined,
    categoryId: undefined,
    brandId: undefined,
    modelId: undefined,
    createdAtFrom: undefined,
    createdAtTo: undefined,
    priceMin: undefined,
    priceMax: undefined,
    yearMin: undefined,
    yearMax: undefined,
    mileageMax: undefined,
    sohMin: undefined,
    batteryCapacityMinKwh: undefined,
    batteryCapacityMaxKwh: undefined,
    voltageMinV: undefined,
    voltageMaxV: undefined,
    massMaxKg: undefined,
    chemistries: [],
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState({ field: "createdAt", dir: "desc" });
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderListing, setOrderListing] = useState(null);

  const debouncedQ = useDebounce(filters.q);

  const submitFilters = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  }, []);

  const onTableChange = useCallback((pagination, _filters, sorter) => {
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    const field = s?.field || "createdAt";
    const order =
      s?.order === "ascend"
        ? "asc"
        : s?.order === "descend"
        ? "desc"
        : undefined;
    setSort((prev) => ({
      field: order ? field : prev.field,
      dir: order || prev.dir,
    }));
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { items, total: t } = await fetchConsignmentListings({
        page: page - 1,
        size: pageSize,
        sort: sort.field,
        dir: sort.dir,
        filters: { ...filters, q: debouncedQ },
      });

      // 🔹 Lấy chi tiết từng listing
      const itemsWithDetail = await Promise.all(
        items.map(async (it) => {
          try {
            const detailRes = await getListingDetailById(it.id);
            const detail = detailRes?.data || detailRes;
            const l = detail?.listing || {};

            // ✅ Map media (ảnh/video)
            const media = Array.isArray(detail?.media) ? detail.media : [];
            const mediaUrls = media.map((m) => m.mediaUrl);

            // ✅ Gộp thông tin listing chi tiết
            return {
              ...it,
              ...l,
              // Bổ sung thủ công các field mà FE cần:
              id: l.id,
              title: l.title,
              price: l.price,
              year: l.year,
              categoryId: l.categoryId,
              brand: l.brand,
              brandId: l.brandId,
              model: l.model,
              modelId: l.modelId,
              color: l.color,
              sohPercent: l.sohPercent,
              batteryCapacityKwh: l.batteryCapacityKwh,
              mileageKm: l.mileageKm,
              voltageV: l.voltage,
              batteryChemistry: l.batteryChemistry,
              massKg: l.massKg,
              dimensionsMm: l.dimensions,
              province: l.province,
              district: l.district,
              ward: l.ward,
              address: l.address,
              visibility: l.visibility,
              status: l.status,
              description: l.description,

              // Gộp thông tin tham chiếu
              seller: detail?.sellerId,
              branch: detail?.branch,
              productVehicle: detail?.productVehicle,
              productBattery: detail?.productBattery,

              // Media
              media,
              mediaUrls,
            };
          } catch (err) {
            console.warn(
              `❌ Không thể fetch chi tiết cho listing ${it.id}`,
              err
            );
            return it;
          }
        })
      );

      setRows(itemsWithDetail);
      setTotal(t);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách bài đăng!");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sort.field, sort.dir, filters, debouncedQ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 🔹 Khi click "Chỉnh sửa"
  const handleEditListing = useCallback((record) => {
    const listingId = record?.id || record?.listingId;
    if (!listingId) {
      message.error("Không tìm thấy ID của tin đăng!");
      return;
    }

    const media =
      Array.isArray(record?.media) && record.media.length
        ? record.media
        : Array.isArray(record?.mediaUrls)
        ? record.mediaUrls.map((url, idx) => ({
            id: idx,
            mediaUrl: url,
            mediaType: "IMAGE",
          }))
        : [];

    const mediaUrls = media.map((m) => m.mediaUrl);

    setEditingItem({
      ...record,
      id: listingId,
      media,
      mediaUrls,
    });
    setIsModalOpen(true);
  }, []);

  // 🔹 Cập nhật listing sau khi chỉnh sửa
  const handleUpdateListing = useCallback(
    async (id, payload, images = [], videos = [], keepMediaIds = []) => {
      try {
        const res = await updateConsignmentListing(
          id,
          payload,
          images,
          videos,
          keepMediaIds
        );
        message.success("Cập nhật tin đăng thành công!");
        setIsModalOpen(false);
        fetchData();
        return res;
      } catch (err) {
        console.error(err);
        message.error("Cập nhật tin đăng thất bại!");
        throw err;
      }
    },
    [fetchData]
  );

  const handleOpenOrderModal = useCallback((record) => {
    setOrderListing(record);
    setIsOrderModalOpen(true);
  }, []);

  const handleConfirmCreateOrder = useCallback(
    async (listingId, buyerPhoneNumber) => {
      if (!listingId || !buyerPhoneNumber) {
        message.warning("Thiếu thông tin đơn hàng!");
        return;
      }

      try {
        await createOrder(listingId, buyerPhoneNumber);
        message.success("Tạo đơn hàng thành công!");
        setIsOrderModalOpen(false);
        setOrderListing(null);
      } catch (err) {
        console.error(err);
        message.error(err?.message || "Tạo đơn hàng thất bại!");
      }
    },
    []
  );
  return {
    loading,
    rows,
    total,
    page,
    pageSize,
    sort,
    onTableChange,
    filters,
    submitFilters,
    setFilters,
    refresh: fetchData,
    isModalOpen,
    setIsModalOpen,
    editingItem,
    handleEditListing,
    handleUpdateListing,
    isOrderModalOpen,
    setIsOrderModalOpen,
    orderListing,
    handleOpenOrderModal,
    handleConfirmCreateOrder,
  };
}
