import React, { useState } from "react";
import { Card, Space, Input, Select, Button } from "antd";

const { Search } = Input;

export default function ListingFilter({
  onSearch,
  onStatusChange,
  status,
  query,
  loading,
}) {
  const [searchValue, setSearchValue] = useState(query || "");

  return (
    <Card size="small" title="Bộ lọc bài đăng">
      <Space wrap style={{ width: "100%" }}>
        <Select
          placeholder="Trạng thái"
          allowClear
          value={status || undefined}
          onChange={onStatusChange}
          style={{ width: 200 }}
          options={[
            { value: "PENDING", label: "Chờ duyệt" },
            { value: "APPROVED", label: "Đã duyệt" },
            { value: "ACTIVE", label: "Đang hiển thị" },
            { value: "RESERVED", label: "Đã đặt cọc" },
            { value: "SOLD", label: "Đã bán" },
            { value: "EXPIRED", label: "Hết hạn" },
            { value: "REJECTED", label: "Từ chối" },
            { value: "ARCHIVED", label: "Lưu trữ" },
            { value: "HIDDEN", label: "Ẩn" },
            { value: "SOFT_DELETED", label: "Đã xóa tạm" },
          ]}
        />

        <Search
          placeholder="Tìm kiếm theo tiêu đề, địa chỉ, số điện thoại..."
          allowClear
          enterButton="Tìm kiếm"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={() => onSearch(searchValue)} // ✅ fix
          style={{ flex: 1, minWidth: 300 }}
          loading={loading}
        />

        <Button
          type="default"
          onClick={() => {
            setSearchValue("");
            onSearch("");
            onStatusChange("");
          }}
        >
          Làm mới
        </Button>
      </Space>
    </Card>
  );
}
