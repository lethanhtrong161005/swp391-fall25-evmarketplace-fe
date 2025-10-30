
import React from "react";
import s from "./EmptyState.module.scss";
import { Empty, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

export default function EmptyState({ onRefresh }) {
    return (
        <div className={s.root}>
            <Empty description="Không có đơn hàng nào phù hợp" />
            <Button icon={<ReloadOutlined />} onClick={onRefresh}>Tải lại</Button>
        </div>
    );
}
