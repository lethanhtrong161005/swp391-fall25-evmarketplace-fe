import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchBar = () => {
  return (
    <Input placeholder="Tìm kiếm..." 
    prefix={<SearchOutlined />} 
    allowClear 
    />
  );
};

export default SearchBar;
