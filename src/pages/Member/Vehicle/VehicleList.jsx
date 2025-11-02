import React from "react";
import { Empty } from "antd";
import styles from "../Home/LatestListingsSection.module.scss";
import { useNavigate } from "react-router-dom";
import ProductCard from "@components/ProductCard/ProductCard";

const VehicleList = ({ listings, onClick }) => {
  const navigate = useNavigate();
  const pageSize = 20; // hiển thị tối đa 20 sản phẩm mới nhất

  const handleClick = (listing) => {
    if (onClick) {
      onClick(listing);
    } else if (listing?.id) {
      navigate(`/detail/${listing.id}`);
    }
  };

  // API đã lọc theo type=VEHICLE và status=ACTIVE rồi, không cần lọc lại
  const currentData = listings.slice(0, pageSize);

  return (
    <>
      {listings.length === 0 ? (
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

export default VehicleList;
