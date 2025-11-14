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
    new: "Tạo tin đăng",
    "info-user": "Thông tin cá nhân",
    listing: "Tin đăng",
    listings: "Tất cả tin đăng",
    "featured-listings": "Tất cả tin nổi bật",
    edit: "Chỉnh sửa tin đăng",
    member: "Thành viên",
    availability: "Lên lịch",
    "my-ads": "Quản lý tin",
  };

  // Custom URL mapping cho các route đặc biệt
  const getCustomUrl = (segment, segments, index) => {
    // Nếu đang ở /listing/new hoặc /listing/edit, thì "Tin đăng" link đến /my-ads
    if (segment === "listing" && segments[index + 1] && (segments[index + 1] === "new" || segments[index + 1] === "edit")) {
      return "/my-ads";
    }
    // Trường hợp khác, tạo URL bình thường
    return "/" + segments.slice(0, index + 1).join("/");
  };

  const filteredSnippets = pathSnippets.filter(
    (segment) => !/^\d+$/.test(segment)
  );

  const breadcrumbItems = filteredSnippets.map((_, index) => {
    const url = getCustomUrl(filteredSnippets[index], filteredSnippets, index);
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
    {
      title: (
        <Link to="/" className="link">
          ReEV
        </Link>
      ),
    },
    ...breadcrumbItems,
  ];

  return (
    <div className="breadcrumbWrapper">
      <Breadcrumb items={items} />
    </div>
  );
}
