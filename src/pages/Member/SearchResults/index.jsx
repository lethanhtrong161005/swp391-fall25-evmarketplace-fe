// src/pages/Member/SearchResults/index.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Empty, Button, Spin, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CardListing from "@components/CardListing";
import { searchListings, transformListingData } from "@/services/listingHomeService";
import styles from "../Home/LatestListingsSection.module.scss";

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
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToHome}
            style={{ marginBottom: "16px" }}
          >
            Quay lại trang chủ
          </Button>

          <Title level={2}>Kết quả tìm kiếm cho: "{searchTerm}"</Title>

          <Text type="secondary">Tìm thấy {searchResults.length} kết quả</Text>
        </div>

        {/* Results */}
        {searchResults.length > 0 ? (
          <>
            <div className={styles.grid5x}>
              {searchResults.map((item) => (
                <div key={item.id} className={styles.gridItem}>
                  <CardListing
                    listing={item}
                    onClick={handleProductClick}
                  />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasNext && (
              <div style={{ textAlign: "center", marginTop: "32px" }}>
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
            style={{ marginTop: "60px" }}
          >
            <Button type="primary" onClick={handleBackToHome}>
              Quay lại trang chủ
            </Button>
          </Empty>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
