import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { searchListings, transformListingData } from "@/services/listingHomeService";
import "@components/SearchBar/SearchBar.scss";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      message.warning("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }

    setLoading(true);
    try {
      // Gọi API search
      const response = await searchListings({
        key: searchTerm.trim(),
        page: 0,
        size: 20,
        sort: "createdAt",
        dir: "desc",
      });

      if (response?.success && response?.data?.items) {
        // Transform dữ liệu trước khi navigate
        const transformedItems = response.data.items.map(transformListingData);
        
        // Chuyển đến trang kết quả tìm kiếm với dữ liệu
        navigate("/search-results", {
          state: {
            searchResults: transformedItems,
            searchTerm,
            totalCount: response.data.totalElements || transformedItems.length,
            hasNext: response.data.hasNext,
          },
        });
      } else {
        message.error("Không tìm thấy kết quả nào");
      }
    } catch {
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
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Tìm sản phẩm..."
        className="search-input"
        allowClear
        size="large"
      />

      <Button
        type="primary"
        shape="round"
        icon={<SearchOutlined />}
        onClick={handleSearch}
        loading={loading}
        size="large"
      >
        Tìm kiếm
      </Button>
    </div>
  );
};

export default SearchBar;
