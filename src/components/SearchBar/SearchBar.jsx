import { Input, Button, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "@components/SearchBar/SearchBar.scss"
const { Option } = Select;

const SearchBar = () => {
  return (
    <div className="search-bar">
      <Select defaultValue="Danh mục" className="search-select">
        <Option value="all">Danh mục</Option>
        <Option value="xe">Vinfast</Option>
        <Option value="nha">Yadea</Option>
      </Select>

      <Input
        placeholder="Tìm sản phẩm..."
        className="search-input"
        allowClear
      />

      <Select defaultValue="Khu vực" className="search-select">
        <Option value="hn">Hà Nội</Option>
        <Option value="hcm">Hồ Chí Minh</Option>
      </Select>

      <Button type="primary" shape="round" icon={<SearchOutlined />}>
        Tìm kiếm
      </Button>
    </div>
  );
};

export default SearchBar;