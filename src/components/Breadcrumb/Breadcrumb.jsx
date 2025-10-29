import React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import "./Breadcrumb.scss";

export default function DynamicBreadcrumb() {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter(Boolean);

  const nameMap = {
    admin: "Quản trị",
    product: "Sản phẩm",
    category: "Danh mục",
    brand: "Thương hiệu",
    model: "Model",
    vehicle: "Xe điện",
    battery: "Pin",
    staff: "Nhân viên",
    manager: "Quản lý",
    inspector: "Kiểm định viên",
    consignment: "Quản lý ký gửi",
    new: "Tạo mới",
    "info-user": "Thông tin cá nhân",
    listing: "Tin đăng",
    edit: "Chỉnh sửa",
    member: "Thành viên",
    availability: "Lên lịch"
  };

  // ⚙️ Loại bỏ các đoạn là số (id)
  const filteredSnippets = pathSnippets.filter(
    (segment) => !/^\d+$/.test(segment)
  );

  const breadcrumbItems = filteredSnippets.map((_, index) => {
    const url = "/" + filteredSnippets.slice(0, index + 1).join("/");
    const isLast = index === filteredSnippets.length - 1;
    const label = nameMap[filteredSnippets[index]] || filteredSnippets[index];

    return {
      title: isLast ? (
        <span className="active">{label}</span>
      ) : (
        <Link to={url} className="link">
          {label}
        </Link>
      ),
    };
  });

  const items = [
    { title: <Link to="/" className="link">ReEV</Link> },
    ...breadcrumbItems,
  ];

  return (
    <div className="breadcrumbWrapper">
      <Breadcrumb items={items} />
    </div>
  );
}
