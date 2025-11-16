// src/pages/Member/AllFeaturedListings/useAllFeaturedListings.js
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllListings, searchListings } from "@/services/listingHomeService";

export const CATEGORIES = [
  { id: "all", code: null, label: "Tất cả" },
  { id: "EV_CAR", code: "EV_CAR", label: "Ô tô điện" },
  { id: "E_MOTORBIKE", code: "E_MOTORBIKE", label: "Xe máy điện" },
  { id: "E_BIKE", code: "E_BIKE", label: "Xe đạp điện" },
  { id: "BATTERY", code: "BATTERY", label: "Pin" },
];

// SORT_OPTIONS phải khớp với các trường được backend hỗ trợ:
// createdAt, updatedAt, price, expiresAt, promotedUntil, batteryCapacityKwh
export const SORT_OPTIONS = [
  { value: "createdAt,desc", label: "Tin mới nhất" },
  { value: "createdAt,asc", label: "Tin cũ nhất" },
  { value: "price,asc", label: "Giá tăng dần" },
  { value: "price,desc", label: "Giá giảm dần" },
];

const DEFAULT_MAX_PRICE = 10000000000; // 10 tỷ

export default function useAllFeaturedListings() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // States - Khởi tạo từ URL params
  const [viewMode, setViewMode] = useState(
    () => searchParams.get("view") || "grid"
  );
  const [selectedCategory, setSelectedCategory] = useState(
    () => searchParams.get("category") || "all"
  );
  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sort") || "createdAt,desc"
  );
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(() => ({
    current: parseInt(searchParams.get("page") || "1"),
    pageSize: 12,
    total: 0,
  }));

  // Search filters
  const [priceRange, setPriceRange] = useState(() => {
    const min = searchParams.get("priceMin");
    const max = searchParams.get("priceMax");
    return [min ? Number(min) : null, max ? Number(max) : null];
  });
  const [appliedPriceRange, setAppliedPriceRange] = useState(() => {
    const min = searchParams.get("priceMin");
    const max = searchParams.get("priceMax");
    return [min ? Number(min) : 0, max ? Number(max) : DEFAULT_MAX_PRICE];
  });
  const [showFilters, setShowFilters] = useState(false);

  // Sync state với URL params khi URL thay đổi
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    const category = searchParams.get("category") || "all";
    const sort = searchParams.get("sort") || "createdAt,desc";
    const view = searchParams.get("view") || "grid";

    setPagination((prev) => ({ ...prev, current: page }));
    setSelectedCategory(category);
    setSortBy(sort);
    setViewMode(view);
  }, [searchParams]);

  // Fetch listings từ API với isBoosted=true
  const fetchListings = async () => {
    try {
      setLoading(true);
      // Split sortBy và đảm bảo có giá trị mặc định
      const sortParts = (sortBy || "createdAt,desc").split(",");
      const sortField = sortParts[0]?.trim() || "createdAt";
      const sortDir = sortParts[1]?.trim() || "desc";

      // Khởi tạo params với isBoosted: true LUÔN được đặt từ đầu
      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize,
        sort: sortField,
        dir: sortDir,
        isBoosted: true, // Chỉ lấy tin nổi bật - LUÔN truyền vào, KHÔNG BAO GIỜ bị ghi đè
      };

      // Thêm categoryCode nếu có (sau khi đã set isBoosted)
      if (selectedCategory !== "all") {
        params.categoryCode = selectedCategory; // EV_CAR, E_MOTORBIKE, E_BIKE, BATTERY
      }

      // Thêm price range (dùng appliedPriceRange - giá đã apply)
      const [minPrice, maxPrice] = appliedPriceRange;
      if (minPrice > 0) {
        params.priceMin = minPrice;
      }
      if (maxPrice < DEFAULT_MAX_PRICE) {
        params.priceMax = maxPrice;
      }

      // Luôn dùng getAllListings để đảm bảo isBoosted được hỗ trợ
      const response = await getAllListings(params);

      if (response?.success && response?.data) {
        const items = response.data.items || [];
        const total = response.data.totalElements || 0;

        // Đảm bảo chỉ lấy tin nổi bật (filter lại ở frontend để chắc chắn)
        // Backend có thể trả về cả tin không nổi bật nếu có bug khi filter theo category
        const featuredItems = items.filter((item) => {
          // Kiểm tra cả visibility === "BOOSTED" và isBoosted === true
          return (
            item?.visibility === "BOOSTED" ||
            item?.isBoosted === true ||
            item?.boosted === true
          );
        });

        setListings(featuredItems);
        setPagination((prev) => ({
          ...prev,
          // Giữ total từ backend vì backend đã filter với isBoosted=true
          // Nhưng nếu có items bị filter out, có thể cần điều chỉnh
          total: total,
        }));
      } else {
        setListings([]);
        setPagination((prev) => ({
          ...prev,
          total: 0,
        }));
      }
    } catch {
      setListings([]);
      setPagination((prev) => ({
        ...prev,
        total: 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  // Fetch data khi có thay đổi
  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortBy, pagination.current, appliedPriceRange]);

  // Update URL params helper
  const updateURLParams = (params) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      newParams.set(key, value);
    });
    setSearchParams(newParams);
  };

  // Handlers
  const handleCategoryChange = (categoryCode) => {
    setSelectedCategory(categoryCode);
    setPagination((prev) => ({ ...prev, current: 1 }));
    updateURLParams({ category: categoryCode, page: 1 });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
    updateURLParams({ sort: value, page: 1 });
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    updateURLParams({ view: mode });
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current: page }));
    updateURLParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleListingClick = (listing) => {
    navigate(`/detail/${listing.id}`);
  };

  const handlePriceReset = () => {
    setPriceRange([null, null]);
    setAppliedPriceRange([0, DEFAULT_MAX_PRICE]);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handlePriceApply = () => {
    // Chuyển null thành giá trị mặc định khi apply
    const minPrice = priceRange[0] || 0;
    const maxPrice = priceRange[1] || DEFAULT_MAX_PRICE;
    setAppliedPriceRange([minPrice, maxPrice]);
    setPagination((prev) => ({ ...prev, current: 1 }));
    setShowFilters(false);
  };

  // Filter active listings
  const activeListings = useMemo(
    () => listings.filter((item) => item?.status === "ACTIVE"),
    [listings]
  );

  return {
    // States
    viewMode,
    selectedCategory,
    sortBy,
    listings: activeListings,
    loading,
    pagination,
    priceRange,
    showFilters,

    // Setters
    setPriceRange,
    setShowFilters,

    // Handlers
    handleCategoryChange,
    handleSortChange,
    handleViewModeChange,
    handlePageChange,
    handleListingClick,
    handlePriceReset,
    handlePriceApply,

    // Constants
    DEFAULT_MAX_PRICE,
  };
}

