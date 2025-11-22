// src/pages/Member/Home/HeroHeader.jsx
import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import s from "./HeroHeader.module.scss";
import heroBannerImage from "@assets/images/Banner/HeroBanner.jpg";

export default function HeroHeader() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/listings");
  };

  return (
    <section className={s.heroSection}>
      <div className={s.hero} style={{ backgroundImage: `url(${heroBannerImage})` }}>
        <div className={s.overlay} />
        <div className={s.content}>
          <h1 className={s.title}>Lái Tương Lai, Bền Vững</h1>
          <p className={s.subtitle}>
            Khám phá bộ sưu tập xe điện và pin đã qua sử dụng được tuyển chọn
            của chúng tôi.
          </p>
          <Button
            type="primary"
            size="large"
            onClick={handleExploreClick}
            className={s.exploreButton}
          >
            Khám Phá Ngay
          </Button>
        </div>
      </div>
    </section>
  );
}
