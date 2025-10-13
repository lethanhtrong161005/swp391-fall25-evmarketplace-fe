// src/pages/Member/ManageFavoriteListing/FavoriteList.jsx
import React from "react";
import { List, Pagination } from "antd";
import FavoriteListItem from "../FavoriteListItem";
import styles from "./FavoriteList.module.scss";

const FavoriteList = ({ items, pagination, onChange, onToggleFavorite, onChat }) => {
    return (
        <div className={styles.container}>
            <List
                dataSource={items}
                renderItem={(item) => (
                    <FavoriteListItem
                        key={item.id}
                        item={item}
                        onToggleFavorite={() => onToggleFavorite(item)}
                        onChat={() => onChat(item)}
                    />
                )}
            />
            <div className={styles.paging}>
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={(page, pageSize) => onChange({ page, pageSize })}
                    showSizeChanger
                />
            </div>
        </div>
    );
};

export default FavoriteList;
