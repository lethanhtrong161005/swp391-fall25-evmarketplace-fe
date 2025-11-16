import React from "react";
import { Typography, Spin, Empty, Pagination, Layout } from "antd";
import CardListing from "@components/CardListing";
import DynamicBreadcrumb from "@/components/Breadcrumb/Breadcrumb";
import CategoryFilter from "./components/CategoryFilter";
import Toolbar from "./components/Toolbar";
import ListingItem from "./components/ListingItem";
import useAllListings, { CATEGORIES, SORT_OPTIONS } from "./useAllListings";
import styles from "../shared/ListingPage.module.scss";

const { Title } = Typography;
const { Content, Footer: PageFooter } = Layout;

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
    <Layout className={styles.layoutContainer}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumbSection}>
        <DynamicBreadcrumb />
      </div>

      {/* Page Title */}
      <div className={styles.pageTitleSection}>
        <Title level={2} className={styles.pageTitle}>
          Tất cả tin đăng
        </Title>
      </div>

      {/* Category Filter */}
      <div className={styles.toolbarWrapper}>
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
      </div>

      {/* Toolbar */}
      <div className={styles.toolbarWrapper}>
        <Toolbar
          sortOptions={SORT_OPTIONS}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
      </div>

      {/* Main Content */}
      <Content className={styles.content}>
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
              <div className={styles.gridView}>
                {listings.map((listing) => (
                  <div key={listing.id} className={styles.gridItem}>
                    <CardListing listing={listing} onClick={handleListingClick} />
                  </div>
                ))}
              </div>
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
          </>
        )}
      </Content>

      {/* Footer with Pagination */}
      {!loading && listings.length > 0 && (
        <PageFooter className={styles.pageFooter}>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger={false}
            showTotal={(total) => `Tổng ${total} tin đăng`}
          />
        </PageFooter>
      )}
    </Layout>
  );
}
