import React from "react";
import { Button, Input, Space, Tooltip } from "antd";
import {
  ThunderboltOutlined,
  GiftOutlined,
  TeamOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import styles from "./SearchActions.module.scss";

const SearchActions = ({ query, onChangeQuery, onCreate, onRefresh, createButtonText = "Đăng tin" }) => {
  return (
    <div className={styles.container}>
      <Space>
        <Input.Search
          allowClear
          placeholder="Tìm tin đăng của bạn..."
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
          onSearch={(v) => onChangeQuery(v)}
          style={{ width: 360 }}
        />
        <Tooltip title="Làm mới dữ liệu">
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            Làm mới
          </Button>
        </Tooltip>
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
          {createButtonText}
        </Button>
      </Space>
    </div>
  );
};

export default SearchActions;
