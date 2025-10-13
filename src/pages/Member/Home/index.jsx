// src/pages/Member/Home/index.jsx
import React, { useState, useEffect } from "react";
import { theme, message } from "antd";
import LatestListingsSection from "./LatestListingsSection";
import FeaturedProductSection from "./FeaturedProductSection";
import CTABanner from "./CTABanner";

// Real API services
import {
  getLatestListings,
  getFeaturedListings,
  getTotalListingsCount,
} from "@/services/listingHomeService";

// Import test function for debugging
import { testListingAPI } from "@/utils/testListingAPI";
import { testSearchAPI } from "@/utils/testSearchAPI";

const Home = () => {
  const { token } = theme.useToken();
  const maxWidth = "var(--home-max-width, 1920px)";

  const [latestListings, setLatestListings] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Debug: Test API first
        console.log("🚀 Starting homepage data fetch...");

        // Fetch latest listings
        setLoadingLatest(true);
        const latestData = await getLatestListings(8);
        console.log("📦 Latest listings:", latestData);
        setLatestListings(latestData);
        setLoadingLatest(false);

        // Fetch featured listings
        setLoadingFeatured(true);
        const featuredData = await getFeaturedListings(8);
        console.log("⭐ Featured listings:", featuredData);
        setFeaturedItems(featuredData);
        setLoadingFeatured(false);

        // Fetch total count
        const totalCount = await getTotalListingsCount();
        console.log("📊 Total count:", totalCount);
        setTotalProducts(totalCount);

        console.log("✅ Homepage data fetch completed successfully!");
      } catch (error) {
        console.error("❌ Error fetching homepage data:", error);
        message.error("Không thể tải dữ liệu trang chủ");
        setLoadingLatest(false);
        setLoadingFeatured(false);
      }
    };

    fetchData();
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
