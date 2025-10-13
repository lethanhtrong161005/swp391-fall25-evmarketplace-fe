// src/pages/Member/Home/HeroHeader.jsx
import React from "react";
import s from "./HeroHeader.module.scss";
import bannerUrl from "@/assets/images/Error/inner_header_error.jpg";

export default function HeroHeader() {
  return (
    <header className={s.hero} style={{ backgroundImage: `url(${bannerUrl})` }}>
      <div className={s.overlay} />
      <div className={s.content}>
        <h1 className={s.title}>ReEV Marketplace</h1>
        <p className={s.subtitle}>Khám phá phương tiện và pin điện mới nhất</p>
      </div>
    </header>
  );
}
