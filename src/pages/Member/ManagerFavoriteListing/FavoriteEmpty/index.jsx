import React from "react";
import { Empty, Button } from "antd";

const FavoriteEmpty = () => (
    <Empty
        description="Bạn chưa lưu tin nào"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
    >
        <Button type="primary" href="/">Khám phá tin</Button>
    </Empty>
);

export default FavoriteEmpty;
