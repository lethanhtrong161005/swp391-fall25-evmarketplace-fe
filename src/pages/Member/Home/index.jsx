// src/pages/Member/Home/index.jsx
import React, { useState, useEffect } from "react";
import { theme } from "antd";
import LatestListingsSection from "./LatestListingsSection";
import FeaturedProductSection from "./FeaturedProductSection";
import CTABanner from "./CTABanner";

// Fake data
import {
  getLatestProducts,
  getFeaturedProducts,
  getAllProductsCount,
} from "@data/HomeProduct.fake";

const Home = () => {
  const { token } = theme.useToken();
  const maxWidth = "var(--home-max-width, 1920px)";

  const [latestListings, setLatestListings] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  // Tổng số sản phẩm toàn nền tảng (để nút "Xem tất cả tin đăng")
  const totalProducts = getAllProductsCount();

  useEffect(() => {
    // Latest (8 gần nhất)
    setLoadingLatest(true);
    setLatestListings(getLatestProducts(8));
    setLoadingLatest(false);

    // Featured: lấy TẤT CẢ nổi bật để có total, rồi cắt 8 hiển thị
    setLoadingFeatured(true);
    const allFeatured = getFeaturedProducts(9999); // trả về toàn bộ
    setFeaturedItems(allFeatured); // component tự cắt 8
    setLoadingFeatured(false);
  }, []);

  const handleViewMoreListings = () => {
    // TODO: điều hướng tới trang danh sách tất cả sản phẩm
  };
  const handleViewMoreFeatured = () => {
    // TODO: điều hướng tới trang danh sách sản phẩm nổi bật (nếu có)
  };
  const handleItemClick = () => {};
  const handleStartBuying = () => {};
  const handleConsignVehicle = () => {};

  return (
    <div style={{ minHeight: "100vh", background: token.colorBgLayout }}>
      <main style={{ padding: "40px 40px", maxWidth, margin: "0 auto" }}>
        <LatestListingsSection
          listings={latestListings}
          totalCount={totalProducts}
          loading={loadingLatest}
          onViewMore={handleViewMoreListings}
          onListingClick={handleItemClick}
        />

        <FeaturedProductSection
          items={featuredItems}
          totalCount={featuredItems.length}
          loading={loadingFeatured}
          onViewMore={handleViewMoreFeatured}
          onItemClick={handleItemClick}
        />

        <CTABanner
          onStartBuying={handleStartBuying}
          onConsignVehicle={handleConsignVehicle}
        />
      </main>
    </div>
  );
};

export default Home;
// src/components/ViewAllLinkButton/ViewAllLink.jsx
