import React from "react";
import { Tabs } from "antd";
import styles from "./StatusTabs.module.scss";

const StatusTabs = ({ activeKey, onChange }) => {
    const tabs = [
        { key: "all", label: "Tất cả" },
        { key: "PENDING_PAYMENT", label: "Chờ thanh toán" },
        { key: "PAID", label: "Đã thanh toán" },
        { key: "CONTRACT_SIGNED", label: "Đã ký HĐ" },
        { key: "COMPLETED", label: "Hoàn tất" },
        { key: "CANCELED", label: "Đã hủy" },
        { key: "PAYMENT_FAILED", label: "Thanh toán thất bại" },
    ];

    return (
        <div className={styles.container}>
            <Tabs
                items={tabs.map((t) => ({
                    key: t.key,
                    label: <span className={styles.label}>{t.label}</span>,
                }))}
                activeKey={activeKey}
                onChange={onChange}
                tabBarGutter={15}
            />
        </div>
    );
};

export default StatusTabs;

