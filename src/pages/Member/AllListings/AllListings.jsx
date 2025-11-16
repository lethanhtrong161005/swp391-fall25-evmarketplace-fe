import React from "react";
import { Row, Col, Typography, Spin, Empty, Pagination } from "antd";
import CardListing from "@components/CardListing";
import DynamicBreadcrumb from "@/components/Breadcrumb/Breadcrumb";
import CategoryFilter from "./components/CategoryFilter";
import Toolbar from "./components/Toolbar";
import ListingItem from "./components/ListingItem";
import useAllListings, { CATEGORIES, SORT_OPTIONS } from "./useAllListings";
import styles from "./styles/AllListings.module.scss";

const { Title } = Typography;

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
      <CategoryFilter
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        showFilters={showFilters}
        onShowFiltersChange={setShowFilters}
        onPriceReset={handlePriceReset}
        onPriceApply={handlePriceApply}
        defaultMaxPrice={DEFAULT_MAX_PRICE}
      />

      {/* Toolbar */}
      <Toolbar
        sortOptions={SORT_OPTIONS}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

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
                  <CardListing listing={listing} onClick={handleListingClick} />
                </Col>
              ))}
            </Row>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className={styles.listView}>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing}
                  onClick={handleListingClick}
                />
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
