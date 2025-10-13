import React from "react";
import { Button, Input, Space, Tooltip } from "antd";
import { ThunderboltOutlined, GiftOutlined, TeamOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./SearchActions.module.scss";

const SearchActions = ({ query, onChangeQuery, onCreate }) => {
    return (
        <div className={styles.container}>

            <Space>
                <Input.Search
                    allowClear placeholder="Tìm tin đăng của bạn..."
                    value={query} onChange={(e) => onChangeQuery(e.target.value)}
                    onSearch={(v) => onChangeQuery(v)} style={{ width: 360 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>Đăng tin</Button>
            </Space>
        </div>
    );
}

export default SearchActions;
