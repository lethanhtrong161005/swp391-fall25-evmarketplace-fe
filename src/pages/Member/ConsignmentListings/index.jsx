import React from "react";
import { Typography, Empty, Spin, Pagination } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import CardListing from "@components/CardListing";
import ListingItem from "@pages/Member/AllListings/components/ListingItem";
import Toolbar from "@pages/Member/AllListings/components/Toolbar";
import useListingPage, { SORT_OPTIONS } from "../shared/useListingPage";
import { getConsignmentListings } from "@/services/listingHomeService";
import styles from "../shared/ListingPage.module.scss";

const { Title } = Typography;

export default function ConsignmentListings() {
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
    const result = await getConsignmentListings({
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
          <ShoppingOutlined style={{ color: "#1890ff" }} />
          Tin ký gửi
        </Title>
        <p className={styles.description}>
          Khám phá các xe điện đang được ký gửi tại hệ thống của chúng tôi
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
        <Empty
          description="Chưa có tin đăng ký gửi nào"
          style={{ marginTop: 60 }}
        />
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
}
