import React from "react";
import { Button, Space, Select } from "antd";
import {
  UnorderedListOutlined,
  AppstoreOutlined,
  DownOutlined,
} from "@ant-design/icons";
import styles from "../styles/Toolbar.module.scss";

const { Option } = Select;

export default function Toolbar({
  sortOptions,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}) {
  return (
    <div className={styles.toolbar}>
      <Space>
        <Select
          value={sortBy}
          onChange={onSortChange}
          style={{ width: 200 }}
          className={styles.sortSelect}
          suffixIcon={<DownOutlined />}
        >
          {sortOptions.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
      </Space>

      <Space>
        <span>{viewMode === "grid" ? "Dạng lưới" : "Dạng danh sách"}</span>
        <Button
          icon={
            viewMode === "grid" ? (
              <AppstoreOutlined />
            ) : (
              <UnorderedListOutlined />
            )
          }
          onClick={() =>
            onViewModeChange(viewMode === "grid" ? "list" : "grid")
          }
        />
      </Space>
    </div>
  );
}
