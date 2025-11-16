import React from "react";
import { Typography, Spin, Empty, Pagination } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import CardListing from "@components/CardListing";
import ListingItem from "@pages/Member/AllListings/components/ListingItem";
import Toolbar from "@pages/Member/AllListings/components/Toolbar";
import useListingPage, { SORT_OPTIONS } from "../shared/useListingPage";
import { getBatteryListings } from "@/services/listingHomeService";
import styles from "../shared/ListingPage.module.scss";

const { Title } = Typography;

const Battery = () => {
  const {
    viewMode,
    sortBy,
    listings,
    loading,
    pagination,
    handleSortChange,
    handleViewModeChange,
    handlePageChange,
    handleListingClick,
  } = useListingPage(async (params) => {
    const result = await getBatteryListings({
      page: params.page,
      size: params.size,
      sort: params.sort,
      dir: params.dir,
    });
    return result;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Title level={2} className={styles.title}>
          <ThunderboltOutlined style={{ color: "#1890ff" }} />
          Pin
        </Title>
        <p className={styles.description}>
          Khám phá các pin điện đang được rao bán trên hệ thống
        </p>
      </div>

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
          <Spin size="large">
            <div style={{ padding: 50 }}>Đang tải dữ liệu...</div>
          </Spin>
        </div>
      ) : listings.length === 0 ? (
        <Empty description="Chưa có pin nào" style={{ marginTop: 60 }} />
      ) : (
        <>
          {/* Grid View */}
          {viewMode === "grid" && (
            <div className={styles.gridView}>
              {listings.map((listing) => (
                <div key={listing.id} className={styles.gridItem}>
                  <CardListing
                    listing={listing}
                    onClick={handleListingClick}
                  />
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

          {/* Pagination */}
          <div className={styles.pagination}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger
              showTotal={(total) => `Tổng ${total} tin đăng`}
              pageSizeOptions={["20", "40", "60", "100"]}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Battery;
