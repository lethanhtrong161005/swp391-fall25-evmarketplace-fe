// src/pages/Member/Home/HeroHeader.jsx
import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import s from "./HeroHeader.module.scss";

const bannerUrl = "https://idsb.tmgrup.com.tr/ly/uploads/images/2021/09/17/145313.jpg";

export default function HeroHeader() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/listings");
  };

  return (
    <section className={s.heroSection}>
      <div className={s.hero} style={{ backgroundImage: `url(${bannerUrl})` }}>
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
