// src/pages/Member/Home/HeroHeader.jsx
import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import s from "./HeroHeader.module.scss";

const bannerUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD-h-Apa7Nr4Kkx-mK5NasXoeFg6ayEh_1hapJWhWOgw2ftdsGQzt2edwk4UiCZBKknez0jIo1xYhLSKs5D_KfpY2QQlRC97dfx5hPdVcFyF4XZI3QOTLnKsvMgUyMa1Rh0Z2yau0iF8lFB1vQdl_dM-l9nJTHWeZCoDXt1lpXNaCyFTIxn9-o1dJpeijWEAHYJAu-K-TlNaQ8YoRJ54GJFZP7d92LQtnB70CxVBht2-A-7GG6wiz4qsEI9Rv7r_2G9c0cCukbx2YDr";

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
