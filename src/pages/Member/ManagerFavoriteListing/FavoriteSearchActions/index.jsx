import React from "react";
import { Input } from "antd";
import clsx from "clsx";

const FavoriteSearchActions = ({ className, query, onChangeQuery }) => {
    return (
        <div className={clsx(className)}>
            <Input.Search
                allowClear
                placeholder="Tìm theo tiêu đề, địa điểm..."
                value={query}
                onChange={(e) => onChangeQuery(e.target.value)}
                onSearch={(v) => onChangeQuery(v)}
            />
        </div>
    );
};

export default FavoriteSearchActions;
