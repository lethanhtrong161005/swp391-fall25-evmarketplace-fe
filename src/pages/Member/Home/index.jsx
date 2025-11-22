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
    totalFeatured,
  } = useHomeData();

  const handleViewMoreListings = () => {
    navigate("/listings");
  };
  const handleViewMoreFeatured = () => {
    navigate("/featured-listings");
  };
  const handleItemClick = (item) => {
    if (!item) return;
    navigate(`/detail/${item.id}`);
  };
  const handleStartBuying = () => {};
  const handleConsignVehicle = () => {};

  return (
    <div style={{ minHeight: "100vh" }}>
      <HeroHeader />
      <main style={{ padding: "24px 40px 40px", maxWidth, margin: "0 auto" }}>
        <LatestListingsSection
          listings={latestListings}
          totalCount={totalProducts}
          loading={loadingLatest}
          onViewMore={handleViewMoreListings}
          onListingClick={handleItemClick}
        />

        <FeaturedProductSection
          items={featuredItems}
          totalCount={totalFeatured}
          loading={loadingFeatured}
          onViewMore={handleViewMoreFeatured}
          onItemClick={handleItemClick}
        />
      </main>
      <CTABanner />
    </div>
  );
};

export default Home;
// src/components/ViewAllLinkButton/ViewAllLink.jsx
