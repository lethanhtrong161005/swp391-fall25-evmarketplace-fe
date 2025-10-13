import React from "react";
import { Tabs } from "antd";
import styles from "./StatusTabs.module.scss";

const StatusTabs = ({ tabs, counts, activeKey, onChange }) => {
    const items = tabs.map(t => ({
        key: t.key,
        label: <span className={styles.label}>{t.label} ({counts?.[t.key] || 0})</span>,
    }));

    return (
        <div className={styles.container}>
            <Tabs
                items={items}
                activeKey={activeKey}
                onChange={onChange}
                tabBarGutter={15}
            />
        </div>
    );
};

export default StatusTabs;
