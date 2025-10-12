import React, { useState } from "react";
import { Input, Card } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import s from "../AccountTable.module.scss";

const SearchBar = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value) => {
    const trimmedValue = value?.trim();
    onSearch?.({ search: trimmedValue });
  };

  return (
    <Card size="small" className={s.searchCard} style={{ marginBottom: 16 }}>
      <Input.Search
        placeholder="Tìm kiếm theo tên, email, số điện thoại..."
        allowClear
        enterButton={<SearchOutlined />}
        size="middle"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onSearch={handleSearch}
        className={s.searchInput}
        style={{ maxWidth: 400 }}
      />
    </Card>
  );
};

export default SearchBar;
