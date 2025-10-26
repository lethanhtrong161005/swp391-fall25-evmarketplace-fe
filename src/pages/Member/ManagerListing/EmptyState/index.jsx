import React from "react";
import { Button, Empty, Typography } from "antd";
import styles from "./EmptyState.module.scss";

const EmptyState = ({ onCreate, queryText, queryButtonText }) => {
    return (
        <div className={styles.emptyWrap}>
            <Empty description={
                <div>
                    <Typography.Title level={5} style={{ marginBottom: 4 }}>
                        Không tìm thấy {queryText}
                    </Typography.Title>
                    <div className={styles.desc}>Bạn hiện tại không có {queryText} nào cho trạng thái này</div>
                </div>
            } />
            <Button type="primary" onClick={onCreate}>{queryButtonText}</Button>
        </div>
    );
}

export default EmptyState;
