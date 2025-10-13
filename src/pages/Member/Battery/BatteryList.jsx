// src/pages/Member/Battery/BatteryList.jsx
import React from "react";
import { Empty } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "../Home/LatestListingsSection.module.scss";
import ProductCard from "@components/ProductCard/ProductCard";

const BatteryList = ({ listings, onClick }) => {
  const navigate = useNavigate();
  const pageSize = 20; // hiển thị tối đa 20 sản phẩm

  const handleClick = (listing) => {
    if (onClick) {
      onClick(listing);
    } else if (listing?.id) {
      let type = "vehicle"; // mặc định

      const cat = listing.category?.toUpperCase();
      if (cat === "BATTERY") {
        type = "battery";
      } else if (
        cat === "EV_CAR" ||
        cat === "E_MOTORBIKE" ||
        cat === "E_BIKE"
      ) {
        type = "vehicle";
      } else {
        console.warn("Category không xác định:", cat);
      }

      navigate(`/detail/${type}/${listing.id}`);
    }
  };

  // lọc ra sản phẩm là BATTERY và ACTIVE
  const batteries = listings.filter(
    (listing) =>
      listing.category?.toUpperCase() === "BATTERY" &&
      listing.status?.toUpperCase() === "ACTIVE"
  );

  // lấy tối đa 20 sản phẩm mới nhất (API đã sort)
  const currentData = batteries.slice(0, pageSize);

  return (
    <>
      {batteries.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Empty description="Không có sản phẩm nào được tìm thấy" />
        </div>
      ) : (
        <div className={styles.grid5x}>
          {currentData.map((listing) => (
            <div key={listing.id} className={styles.gridItem}>
              <ProductCard
                listing={listing}
                onClick={() => handleClick(listing)}
                style={{ height: "100%" }}
                showVerifiedTag={false}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default BatteryList;
