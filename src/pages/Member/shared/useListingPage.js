import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// SORT_OPTIONS phải khớp với các trường được backend hỗ trợ:
// createdAt, updatedAt, price, expiresAt, promotedUntil, batteryCapacityKwh
export const SORT_OPTIONS = [
  { value: "createdAt,desc", label: "Tin mới nhất" },
  { value: "createdAt,asc", label: "Tin cũ nhất" },
  { value: "price,asc", label: "Giá tăng dần" },
  { value: "price,desc", label: "Giá giảm dần" },
];

export default function useListingPage(fetchFunction) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // States - Khởi tạo từ URL params
  const [viewMode, setViewMode] = useState(
    () => searchParams.get("view") || "grid"
  );
  const [sortBy, setSortBy] = useState(
    () => searchParams.get("sort") || "createdAt,desc"
  );
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(() => ({
    current: parseInt(searchParams.get("page") || "1"),
    pageSize: 20,
    total: 0,
  }));

  // Sync state với URL params khi URL thay đổi
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    const sort = searchParams.get("sort") || "createdAt,desc";
    const view = searchParams.get("view") || "grid";

    setPagination((prev) => ({ ...prev, current: page }));
    setSortBy(sort);
    setViewMode(view);
  }, [searchParams]);

  // Fetch listings từ API
  const fetchListings = async () => {
    try {
      setLoading(true);
      const [sortField, sortDir] = sortBy.split(",");

      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize,
        sort: sortField,
        dir: sortDir,
      };

      const response = await fetchFunction(params);

      if (response?.items) {
        setListings(response.items);
        setPagination((prev) => ({
          ...prev,
          total: response.totalElements || 0,
        }));
      } else {
        setListings([]);
        setPagination((prev) => ({
          ...prev,
          total: 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
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
  }, [sortBy, pagination.current]);

  // Update URL params helper
  const updateURLParams = (params) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      newParams.set(key, value);
    });
    setSearchParams(newParams);
  };

  // Handlers
  const handleSortChange = (value) => {
    setSortBy(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
    updateURLParams({ sort: value, page: 1 });
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    updateURLParams({ view: mode });
  };

  const handlePageChange = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize,
    }));
    updateURLParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleListingClick = (listing) => {
    if (listing?.id) {
      navigate(`/detail/${listing.id}`);
    }
  };

  return {
    // States
    viewMode,
    sortBy,
    listings,
    loading,
    pagination,

    // Handlers
    handleSortChange,
    handleViewModeChange,
    handlePageChange,
    handleListingClick,
  };
}

