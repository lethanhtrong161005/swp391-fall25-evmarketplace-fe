import React, { useState, useEffect } from "react";
import { Typography, Empty, Spin, Pagination } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CardListing from "@components/CardListing";
import styles from "./ConsignmentListings.module.scss";
import { getConsignmentListings } from "@/services/listingHomeService";

const { Title } = Typography;

export default function ConsignmentListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  useEffect(() => {
    fetchConsignmentListings(pagination.current - 1, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const fetchConsignmentListings = async (page, size) => {
    setLoading(true);
    try {
      const response = await getConsignmentListings({ page, size });
      setListings(response.items);
      setPagination((prev) => ({
        ...prev,
        total: response.totalElements,
      }));
    } catch (error) {
      console.error("Error fetching consignment listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleListingClick = (listing) => {
    if (listing?.id) {
      navigate(`/detail/${listing.id}`);
    }
  };

  const handlePageChange = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize,
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2} className={styles.title}>
          <ShoppingOutlined style={{ marginRight: 12, color: "#1890ff" }} />
          Tin đăng ký gửi
        </Title>
        <p className={styles.description}>
          Khám phá các xe điện đang được ký gửi tại hệ thống của chúng tôi
        </p>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      ) : listings.length === 0 ? (
        <Empty
          description="Chưa có tin đăng ký gửi nào"
          style={{ marginTop: 60 }}
        />
      ) : (
        <>
          <div className={styles.grid}>
            {listings.map((listing) => (
              <div key={listing.id} className={styles.gridItem}>
                <CardListing listing={listing} onClick={handleListingClick} />
              </div>
            ))}
          </div>

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
