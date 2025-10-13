import React from "react";
import { Breadcrumb, Card, Skeleton } from "antd";
import styles from "./MemberSectionLayout.module.scss";

const MemberSectionLayout = ({
    // props điều khiển layout
    breadcrumbItems = [],
    loading = false,
    hasData = true,
    // “slots” để nhét các khối UI
    profileBar = null,
    actions = null,      // SearchActions hoặc cụm nút
    tabs = null,         // StatusTabs nếu có
    empty = null,        // EmptyState khi không có dữ liệu
    children,            // nội dung bảng/lists chính
}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.breadcrumb}>
                <Breadcrumb items={breadcrumbItems} />
            </div>

            <Card className={styles.card} bordered={false}>
                {profileBar}
                {actions}
                {tabs}

                {loading ? (
                    <Skeleton active paragraph={{ rows: 6 }} />
                ) : hasData ? (
                    children
                ) : (
                    empty
                )}
            </Card>
        </div>
    );
};

export default MemberSectionLayout;
