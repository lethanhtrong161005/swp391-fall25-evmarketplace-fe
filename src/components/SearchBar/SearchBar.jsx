import React, { useState } from "react";
import { Input, Button, Select, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { searchListings } from "@/services/listingHomeService";
import "../SearchBar/SearchBar.scss";

const { Option } = Select;

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [area, setArea] = useState("all");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      message.warning("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }

    setLoading(true);
    try {
      console.log("🔍 Searching with:", { searchTerm, category, area });

      // Gọi API search
      const response = await searchListings({
        key: searchTerm.trim(),
        page: 0,
        size: 20,
        sort: "createdAt",
        dir: "desc",
      });

      console.log("📦 Search results:", response);

      if (response?.success && response?.data?.items) {
        // Chuyển đến trang kết quả tìm kiếm với dữ liệu
        navigate("/search-results", {
          state: {
            searchResults: response.data.items,
            searchTerm,
            category,
            area,
            totalCount: response.data.items.length,
            hasNext: response.data.hasNext,
          },
        });
      } else {
        message.error("Không tìm thấy kết quả nào");
      }
    } catch (error) {
      console.error("❌ Search error:", error);
      message.error("Có lỗi xảy ra khi tìm kiếm");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <Select
        value={category}
        onChange={setCategory}
        className="search-select"
        placeholder="Danh mục"
      >
        <Option value="all">Tất cả</Option>
        <Option value="xe">Xe điện</Option>
        <Option value="pin">Pin</Option>
        <Option value="vinfast">VinFast</Option>
        <Option value="tesla">Tesla</Option>
        <Option value="byd">BYD</Option>
      </Select>

      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Tìm sản phẩm..."
        className="search-input"
        allowClear
      />

      <Select
        value={area}
        onChange={setArea}
        className="search-select"
        placeholder="Khu vực"
      >
        <Option value="all">Tất cả</Option>
        <Option value="hanoi">Hà Nội</Option>
        <Option value="hcm">Hồ Chí Minh</Option>
        <Option value="danang">Đà Nẵng</Option>
        <Option value="haiphong">Hải Phòng</Option>
      </Select>

      <Button
        type="primary"
        shape="round"
        icon={<SearchOutlined />}
        onClick={handleSearch}
        loading={loading}
      >
        Tìm kiếm
      </Button>
    </div>
  );
};

export default SearchBar;
