// src/pages/Member/Home/index.jsx
import React from "react";
import { theme } from "antd";
import LatestListingsSection from "./LatestListingsSection";
import FeaturedProductSection from "./FeaturedProductSection";
import CTABanner from "./CTABanner";
import { useHomeData } from "./logic";
import HeroHeader from "./HeroHeader";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const maxWidth = "var(--home-max-width, 1920px)";

  const {
    latestListings,
    featuredItems,
    loadingLatest,
    loadingFeatured,
    totalProducts,
  } = useHomeData();

  const handleViewMoreListings = () => {
    // TODO: điều hướng tới trang danh sách tất cả sản phẩm
  };
  const handleViewMoreFeatured = () => {
    // TODO: điều hướng tới trang danh sách sản phẩm nổi bật (nếu có)
  };
  const handleItemClick = (item) => {
    if (!item) return;
    const type =
      item?.category || (item?.category_id === 4 ? "BATTERY" : "VEHICLE");
    navigate(`/detail/${type}/${item.id}`);
  };
  const handleStartBuying = () => {};
  const handleConsignVehicle = () => {};

  return (
    <div style={{ minHeight: "100vh", background: token.colorBgLayout }}>
      <main style={{ padding: "24px 40px 40px", maxWidth, margin: "0 auto" }}>
        <HeroHeader />

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
