import React from "react";
import { Button, Empty } from "antd";

export default function EmptyState({ onRefresh }) {
    return (
        <Empty description="Không có bài ký gửi nào khớp bộ lọc">
            <Button type="primary" onClick={onRefresh}>Tải lại</Button>
        </Empty>
    );
}
