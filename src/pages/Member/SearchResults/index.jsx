// src/pages/Member/SearchResults/index.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Row, Col, Empty, Button, Spin, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ProductCard from "@/components/ProductCard/ProductCard";
import { searchListings } from "@/services/listingHomeService";

const { Title, Text } = Typography;

// Transform function để convert API data về format phù hợp với ProductCard
const transformListingData = (apiItem) => {
  // Xử lý thumbnailUrl từ API response mới
  const getThumbnailUrl = (thumbnailUrl) => {
    if (!thumbnailUrl) return "";

    // Đảm bảo URL hợp lệ
    if (typeof thumbnailUrl === "string" && thumbnailUrl.startsWith("http")) {
      return thumbnailUrl.trim();
    }

    return "";
  };

  return {
    id: apiItem.id?.toString() || "",
    title: apiItem.title || "",
    category: determineCategory(apiItem.brand, apiItem.model),
    brand: apiItem.brand || "",
    model: apiItem.model || "",
    year: apiItem.year || null,
    batteryCapacityKwh: apiItem.batteryCapacityKwh || null,
    sohPercent: apiItem.sohPercent || null,
    mileageKm: apiItem.mileageKm ? parseInt(apiItem.mileageKm) : null,
    powerKw: null, // API không có field này, có thể tính từ batteryCapacityKwh
    price: apiItem.price || 0,
    province: apiItem.province || "",
    city: "", // API không có field city riêng
    status: apiItem.status || "ACTIVE",
    visibility: apiItem.visibility || "NORMAL",
    verified: apiItem.isConsigned || false, // Sử dụng isConsigned làm verified
    isConsigned: apiItem.isConsigned || false,
    branchId: null, // API không có field này
    thumbnailUrl: getThumbnailUrl(apiItem.thumbnailUrl),
    images: [], // Không còn sử dụng images array cho search results
    createdAt: apiItem.createdAt || new Date().toISOString(),
    sellerName: apiItem.sellerName || "",
  };
};

// Xác định category dựa trên brand và model
const determineCategory = (brand, model) => {
  const brandLower = (brand || "").toLowerCase();
  const modelLower = (model || "").toLowerCase();

  // Logic xác định category dựa trên brand/model
  if (
    brandLower.includes("tesla") ||
    brandLower.includes("vinfast") ||
    brandLower.includes("byd") ||
    brandLower.includes("nissan")
  ) {
    return "EV_CAR";
  }

  if (
    brandLower.includes("yamaha") ||
    brandLower.includes("honda") ||
    brandLower.includes("dat bike")
  ) {
    return "E_MOTORBIKE";
  }

  if (brandLower.includes("giant") || brandLower.includes("trek")) {
    return "E_BIKE";
  }

  if (
    modelLower.includes("battery") ||
    modelLower.includes("pin") ||
    modelLower.includes("pack")
  ) {
    return "BATTERY";
  }

  return "EV_CAR"; // Default
};

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
      // Transform dữ liệu từ API về format phù hợp với ProductCard
      const transformedResults = (searchResults || []).map(
        transformListingData
      );
      setSearchResults(transformedResults);
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
    // TODO: Navigate to product detail page
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
            <Row gutter={[16, 16]}>
              {searchResults.map((item) => (
                <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                  <ProductCard
                    listing={item}
                    onClick={handleProductClick}
                    size="default"
                  />
                </Col>
              ))}
            </Row>

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
