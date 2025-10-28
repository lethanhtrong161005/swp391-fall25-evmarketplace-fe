import React from "react";
import { Card, Empty, Button } from "antd";
import { ShoppingOutlined, ReloadOutlined } from "@ant-design/icons";
import s from "./EmptyState.module.scss";

export default function EmptyState({ onRefresh }) {
    return (
        <Card className={s.root} bordered={false}>
            <Empty
                image={<ShoppingOutlined style={{ fontSize: 64, color: "#d9d9d9" }} />}
                imageStyle={{ height: 80 }}
                description={
                    <span style={{ color: "#8c8c8c" }}>
                        Chưa có đơn hàng nào
                    </span>
                }
            >
                <Button type="primary" icon={<ReloadOutlined />} onClick={onRefresh}>
                    Tải lại
                </Button>
            </Empty>
        </Card>
    );
}

