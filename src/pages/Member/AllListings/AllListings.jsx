// src/pages/Member/AllListings/AllListings.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Row,
  Col,
  Typography,
  Button,
  Space,
  Spin,
  Empty,
  Select,
  Pagination,
  InputNumber,
  Slider,
  Dropdown,
} from "antd";
import {
  UnorderedListOutlined,
  AppstoreOutlined,
  FilterOutlined,
  DownOutlined,
  CarOutlined,
  ThunderboltOutlined,
  HomeOutlined,
  BgColorsOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard/ProductCard";
import DynamicBreadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { searchListings } from "@/services/listingHomeService";
import styles from "./AllListings.module.scss";

const { Title } = Typography;
const { Option } = Select;

const CATEGORIES = [
  { id: "all", code: null, label: "Tất cả", icon: <HomeOutlined /> },
  { id: "EV_CAR", code: "EV_CAR", label: "Ô tô điện", icon: <CarOutlined /> },
  {
    id: "E_MOTORBIKE",
    code: "E_MOTORBIKE",
    label: "Xe máy điện",
    icon: <ThunderboltOutlined />,
  },
  {
    id: "E_BIKE",
    code: "E_BIKE",
    label: "Xe đạp điện",
    icon: <ThunderboltOutlined />,
  },
  { id: "BATTERY", code: "BATTERY", label: "Pin", icon: <BgColorsOutlined /> },
];

const SORT_OPTIONS = [
  { value: "createdAt,desc", label: "Tin mới nhất" },
  { value: "price,asc", label: "Giá tăng dần" },
  { value: "price,desc", label: "Giá giảm dần" },
  { value: "batteryCapacityKwh,desc", label: "Dung lượng pin cao nhất" },
  { value: "mileageKm,asc", label: "Số km ít nhất" },
  { value: "sohPercent,desc", label: "SOH cao nhất" },
];

export default function AllListings() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // States - Khởi tạo từ URL params ngay từ đầu
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

  // Search filters - Xóa searchKey vì đã có search ở header
  const [priceRange, setPriceRange] = useState(() => {
    const min = searchParams.get("priceMin") || 0;
    const max = searchParams.get("priceMax") || 15000000000; // 15 tỷ
    return [Number(min), Number(max)];
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

      // Thêm price range nếu khác default
      const [minPrice, maxPrice] = priceRange;
      if (minPrice > 0) {
        params.priceMin = minPrice;
      }
      if (maxPrice < 15000000000) {
        // Nếu không phải max value
        params.priceMax = maxPrice;
      }

      const response = await searchListings(params);

      if (response?.success && response?.data) {
        let items = response.data.items || [];
        const total = response.data.totalElements || 0;

        // Filter theo category phía client (vì API search không có categoryCode param)
        if (selectedCategory !== "all") {
          items = items.filter((item) => {
            const categoryMap = {
              EV_CAR: [1],
              E_MOTORBIKE: [2],
              E_BIKE: [3],
              BATTERY: [4],
            };
            const allowedIds = categoryMap[selectedCategory] || [];
            return allowedIds.includes(item.categoryId);
          });
        }

        setListings(items);
        setPagination((prev) => ({
          ...prev,
          total: selectedCategory === "all" ? total : items.length,
        }));
      } else {
        setListings([]);
      }
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data khi có thay đổi
  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortBy, pagination.current]);

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

  const updateURLParams = (params) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      newParams.set(key, value);
    });
    setSearchParams(newParams);
  };

  // Filter active listings
  const activeListings = useMemo(
    () => listings.filter((item) => item?.status === "ACTIVE"),
    [listings]
  );

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <DynamicBreadcrumb />

      {/* Header */}
      <div className={styles.header}>
        <Title level={2} className={styles.title}>
          Tất cả tin đăng
        </Title>
      </div>

      {/* Category Filter */}
      <div className={styles.categoryFilter}>
        <Space size="middle" wrap>
          <Dropdown
            open={showFilters}
            onOpenChange={setShowFilters}
            trigger={["click"]}
            dropdownRender={() => (
              <div className={styles.priceFilterDropdown}>
                <div className={styles.priceFilter}>
                  <div className={styles.priceSlider}>
                    <Slider
                      range
                      min={0}
                      max={15000000000}
                      step={100000000}
                      value={priceRange}
                      onChange={setPriceRange}
                      tooltip={{
                        formatter: (value) =>
                          `${(value / 1000000000).toFixed(1)} tỷ`,
                      }}
                    />
                    <div className={styles.priceLabels}>
                      <span>0</span>
                      <span>15 tỷ</span>
                    </div>
                  </div>

                  <div className={styles.priceInputs}>
                    <Space>
                      <div>
                        <InputNumber
                          placeholder="Giá tối thiểu"
                          value={priceRange[0]}
                          onChange={(value) =>
                            setPriceRange([value || 0, priceRange[1]])
                          }
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\D/g, "")}
                          style={{ width: 140 }}
                          addonAfter="đ"
                        />
                      </div>
                      <span>-</span>
                      <div>
                        <InputNumber
                          placeholder="Giá tối đa"
                          value={priceRange[1]}
                          onChange={(value) =>
                            setPriceRange([priceRange[0], value || 15000000000])
                          }
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\D/g, "")}
                          style={{ width: 140 }}
                          addonAfter="đ"
                        />
                      </div>
                    </Space>
                  </div>

                  <div className={styles.filterActions}>
                    <Space>
                      <Button
                        onClick={() => {
                          setPriceRange([0, 15000000000]);
                          setPagination((prev) => ({ ...prev, current: 1 }));
                          fetchListings();
                        }}
                      >
                        Xóa lọc
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          setPagination((prev) => ({ ...prev, current: 1 }));
                          fetchListings();
                          setShowFilters(false);
                        }}
                      >
                        Áp dụng
                      </Button>
                    </Space>
                  </div>
                </div>
              </div>
            )}
          >
            <Button
              icon={<FilterOutlined />}
              type={showFilters ? "primary" : "text"}
              className={styles.filterBtn}
            >
              Giá <DownOutlined />
            </Button>
          </Dropdown>

          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              type={selectedCategory === cat.id ? "primary" : "default"}
              onClick={() => handleCategoryChange(cat.id)}
              className={styles.categoryBtn}
              icon={cat.icon}
            >
              {cat.label}
            </Button>
          ))}
        </Space>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <Space>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            style={{ width: 200 }}
            className={styles.sortSelect}
            suffixIcon={<DownOutlined />}
          >
            {SORT_OPTIONS.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Space>

        <Space>
          <span>{viewMode === "grid" ? "Dạng lưới" : "Dạng danh sách"}</span>
          <Button
            icon={
              viewMode === "grid" ? (
                <AppstoreOutlined />
              ) : (
                <UnorderedListOutlined />
              )
            }
            onClick={() =>
              handleViewModeChange(viewMode === "grid" ? "list" : "grid")
            }
          />
        </Space>
      </div>

      {/* Loading & Content */}
      {loading ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : activeListings.length === 0 ? (
        <Empty description="Không có tin đăng nào" />
      ) : (
        <>
          {/* Grid View */}
          {viewMode === "grid" && (
            <Row gutter={[16, 16]} className={styles.gridView}>
              {activeListings.map((listing) => (
                <Col key={listing.id} xs={24} sm={12} md={8} lg={8} xl={6}>
                  <ProductCard
                    listing={listing}
                    onClick={handleListingClick}
                    size="default"
                  />
                </Col>
              ))}
            </Row>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className={styles.listView}>
              {activeListings.map((listing) => (
                <div
                  key={listing.id}
                  className={styles.listItem}
                  onClick={() => handleListingClick(listing)}
                >
                  <img
                    src={listing.thumbnailUrl || listing.images?.[0]}
                    alt={listing.title}
                    className={styles.listItemImage}
                  />
                  <div className={styles.listItemContent}>
                    <Title level={4} className={styles.listItemTitle}>
                      {listing.title}
                    </Title>
                    <div className={styles.listItemDetails}>
                      <span>
                        {listing.year || "-"} · {listing.category || "-"}
                      </span>
                      <span>
                        {listing.mileageKm
                          ? `${listing.mileageKm.toLocaleString()} km`
                          : "-"}
                      </span>
                      <span>{listing.city || listing.location || "-"}</span>
                    </div>
                    <div className={styles.listItemPrice}>
                      {listing.price?.toLocaleString("vi-VN")} đ
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className={styles.pagination}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total) => `Tổng ${total} tin đăng`}
            />
          </div>
        </>
      )}
    </div>
  );
}
