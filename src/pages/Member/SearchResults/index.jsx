// src/pages/Member/SearchResults/index.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Empty, Button, Spin, message, Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CardListing from "@components/CardListing";
import { searchListings, transformListingData } from "@/services/listingHomeService";
import styles from "./SearchResults.module.scss";

const { Title, Text } = Typography;
const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    // Lấy dữ liệu từ state khi navigate từ SearchBar
    if (location.state) {
      const { searchResults, searchTerm, hasNext } = location.state;
      // CardListing tự xử lý data format, không cần transform
      setSearchResults(searchResults || []);
      setSearchTerm(searchTerm || "");
      setHasNext(hasNext || false);
    } else {
      // Nếu không có state, chuyển về trang chủ
      navigate("/");
    }
  }, [location.state, navigate]);

  const handleLoadMore = async () => {
    if (!searchTerm || loading) return;

    setLoading(true);
    try {
      const response = await searchListings({
        key: searchTerm,
        page: currentPage + 1,
        size: 20,
        sort: "createdAt",
        dir: "desc",
      });

      if (response?.success && response?.data?.items) {
        // Transform dữ liệu mới
        const transformedItems = response.data.items.map(transformListingData);
        setSearchResults((prev) => [...prev, ...transformedItems]);
        setCurrentPage((prev) => prev + 1);
        setHasNext(response.data.hasNext);
      }
    } catch {
      message.error("Có lỗi xảy ra khi tải thêm dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    if (product?.id) {
      navigate(`/detail/${product.id}`);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBackToHome}
          className={styles.backButton}
        >
          Quay lại trang chủ
        </Button>

        <Title level={2} className={styles.title}>
          Kết quả tìm kiếm cho: "{searchTerm}"
        </Title>

        <Text type="secondary" className={styles.resultCount}>
          Tìm thấy {searchResults.length} kết quả
        </Text>
      </div>

      {/* Results */}
      {searchResults.length > 0 ? (
        <>
          <Row gutter={[16, 16]} className={styles.gridView}>
            {searchResults.map((item) => (
              <Col
                key={item.id}
                xs={24}
                sm={12}
                md={12}
                lg={8}
                xl={6}
                xxl={6}
              >
                <CardListing
                  listing={item}
                  onClick={handleProductClick}
                />
              </Col>
            ))}
          </Row>

          {/* Load More Button */}
          {hasNext && (
            <div className={styles.loadMoreContainer}>
              <Button
                type="primary"
                size="large"
                onClick={handleLoadMore}
                loading={loading}
              >
                {loading ? "Đang tải..." : "Tải thêm"}
              </Button>
            </div>
          )}
        </>
      ) : (
        <Empty
          description={
            <div>
              <Text>Không tìm thấy kết quả nào cho "{searchTerm}"</Text>
              <br />
              <Text type="secondary">
                Hãy thử với từ khóa khác hoặc kiểm tra chính tả
              </Text>
            </div>
          }
          className={styles.emptyState}
        >
          <Button type="primary" onClick={handleBackToHome}>
            Quay lại trang chủ
          </Button>
        </Empty>
      )}
    </div>
  );
};

export default SearchResults;
