// src/pages/Member/AllListings/AllListings.jsx
import React from "react";
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
  Popover,
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
import ProductCard from "@/components/ProductCard/ProductCard";
import DynamicBreadcrumb from "@/components/Breadcrumb/Breadcrumb";
import useAllListings, { CATEGORIES, SORT_OPTIONS } from "./useAllListings";
import styles from "./AllListings.module.scss";

const { Title } = Typography;
const { Option } = Select;

const CATEGORY_ICONS = {
  all: <HomeOutlined />,
  EV_CAR: <CarOutlined />,
  E_MOTORBIKE: <ThunderboltOutlined />,
  E_BIKE: <ThunderboltOutlined />,
  BATTERY: <BgColorsOutlined />,
};

export default function AllListings() {
  const {
    viewMode,
    selectedCategory,
    sortBy,
    listings,
    loading,
    pagination,
    priceRange,
    showFilters,
    setPriceRange,
    setShowFilters,
    handleCategoryChange,
    handleSortChange,
    handleViewModeChange,
    handlePageChange,
    handleListingClick,
    handlePriceReset,
    handlePriceApply,
    DEFAULT_MAX_PRICE,
  } = useAllListings();

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
        <Space size="small">
          <Popover
            open={showFilters}
            onOpenChange={setShowFilters}
            trigger="click"
            placement="bottomLeft"
            overlayClassName="price-filter-popover"
            content={
              <div className={styles.priceFilterDropdown}>
                <div className={styles.priceFilter}>
                  {/* Title */}
                  <div className={styles.priceFilterTitle}>Khoảng giá</div>

                  {/* Input Fields */}
                  <div className={styles.priceInputs}>
                    <InputNumber
                      placeholder="Giá tối thiểu"
                      value={priceRange[0]}
                      onChange={(value) =>
                        setPriceRange([value || null, priceRange[1]])
                      }
                      formatter={(value) =>
                        value
                          ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : ""
                      }
                      parser={(value) => value.replace(/\D/g, "")}
                      min={0}
                      max={priceRange[1] || DEFAULT_MAX_PRICE}
                      controls={false}
                      addonAfter="đ"
                      className={styles.priceInput}
                    />

                    <span className={styles.priceSeparator}>-</span>

                    <InputNumber
                      placeholder="Giá tối đa"
                      value={priceRange[1]}
                      onChange={(value) =>
                        setPriceRange([priceRange[0], value || null])
                      }
                      formatter={(value) =>
                        value
                          ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : ""
                      }
                      parser={(value) => value.replace(/\D/g, "")}
                      min={priceRange[0] || 0}
                      max={DEFAULT_MAX_PRICE}
                      controls={false}
                      addonAfter="đ"
                      className={styles.priceInput}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className={styles.filterActions}>
                    <Button
                      onClick={handlePriceReset}
                      block
                      className={styles.resetBtn}
                    >
                      Xóa lọc
                    </Button>
                    <Button
                      type="primary"
                      onClick={handlePriceApply}
                      block
                      className={styles.applyBtn}
                    >
                      Áp dụng
                    </Button>
                  </div>
                </div>
              </div>
            }
          >
            <Button
              icon={<FilterOutlined />}
              type={showFilters ? "primary" : "text"}
              className={styles.filterBtn}
            >
              Giá <DownOutlined />
            </Button>
          </Popover>

          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              type={selectedCategory === cat.id ? "primary" : "default"}
              onClick={() => handleCategoryChange(cat.id)}
              className={styles.categoryBtn}
              icon={CATEGORY_ICONS[cat.id]}
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

      {loading ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : listings.length === 0 ? (
        <Empty description="Không có tin đăng nào" />
      ) : (
        <>
          {/* Grid View */}
          {viewMode === "grid" && (
            <Row gutter={[16, 16]} className={styles.gridView}>
              {listings.map((listing) => (
                <Col
                  key={listing.id}
                  xs={24}
                  sm={12}
                  md={12}
                  lg={8}
                  xl={6}
                  xxl={6}
                >
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
              {listings.map((listing) => (
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
