// src/pages/Member/AllListings/useAllListings.js
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllListings, searchListings, transformListingData } from "@/services/listingHomeService";

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

export default function useAllListings() {
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

  // Fetch listings từ API
  const fetchListings = async () => {
    try {
      setLoading(true);
      console.log("🟢 [SORT DEBUG] fetchListings called, sortBy:", sortBy);
      
      // Split sortBy và đảm bảo có giá trị mặc định
      const sortParts = (sortBy || "createdAt,desc").split(",");
      const sortField = sortParts[0]?.trim() || "createdAt";
      const sortDir = sortParts[1]?.trim() || "desc";

      console.log("🟢 [SORT DEBUG] After split - sortField:", sortField, "sortDir:", sortDir);

      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize,
        sort: sortField,
        dir: sortDir,
      };

      // Thêm price range (dùng appliedPriceRange - giá đã apply)
      const [minPrice, maxPrice] = appliedPriceRange;
      if (minPrice > 0) {
        params.priceMin = minPrice;
      }
      if (maxPrice < DEFAULT_MAX_PRICE) {
        params.priceMax = maxPrice;
      }

      console.log("🟢 [SORT DEBUG] Params before API call:", JSON.stringify(params, null, 2));

      let response;

      // Dùng getAllListings cho tất cả trường hợp (hỗ trợ sort tốt hơn)
      // Nếu có categoryCode: truyền vào params
      if (selectedCategory !== "all") {
        params.categoryCode = selectedCategory; // EV_CAR, E_MOTORBIKE, E_BIKE, BATTERY
        console.log("🟢 [SORT DEBUG] Calling getAllListings with categoryCode:", selectedCategory);
      } else {
        console.log("🟢 [SORT DEBUG] Calling getAllListings (category: all, no categoryCode)");
      }
      
      // Luôn dùng getAllListings để đảm bảo sort hoạt động
      // getAllListings hỗ trợ cả priceMin/priceMax nếu cần
      response = await getAllListings(params);

      // Log chi tiết về items để kiểm tra sort
      const items = response?.data?.items || [];
      const prices = items.map(item => item.price).filter(p => p != null);
      console.log("🟢 [SORT DEBUG] API Response:", {
        success: response?.success,
        totalElements: response?.data?.totalElements,
        itemsCount: items.length,
        firstItemPrice: items[0]?.price,
        lastItemPrice: items[items.length - 1]?.price,
        allPrices: prices,
        pricesSorted: [...prices].sort((a, b) => a - b),
        pricesSortedDesc: [...prices].sort((a, b) => b - a),
        expectedOrder: sortDir === "desc" ? "descending (high to low)" : "ascending (low to high)",
      });
      
      // Log từng item để xem thứ tự
      console.log("🟢 [SORT DEBUG] Items order:", items.map((item, idx) => ({
        index: idx,
        id: item.id,
        price: item.price,
        title: item.title?.substring(0, 30),
      })));

      if (response?.success && response?.data) {
        const items = response.data.items || [];
        const total = response.data.totalElements || 0;

        // Transform dữ liệu để đảm bảo có category_id và category đúng format
        const transformedItems = items.map(transformListingData);

        setListings(transformedItems);
        setPagination((prev) => ({
          ...prev,
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
    console.log("🔵 [SORT DEBUG] handleSortChange called with value:", value);
    setSortBy(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
    updateURLParams({ sort: value, page: 1 });
    console.log("🔵 [SORT DEBUG] Updated sortBy state to:", value);
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
