import React from "react";
import { Button, Empty, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./EmptyState.module.scss";

const EmptyState = ({ onCreate, queryText = "", queryButtonText = "Đăng tin" }) => {
    return (
        <div className={styles.emptyWrap}>
            <Empty description={
                <div>
                    <Typography.Title level={5} style={{ marginBottom: 4 }}>
                        Không tìm thấy {queryText}
                    </Typography.Title>
                    <div className={styles.desc}>Bạn hiện tại không có {queryText ? queryText : "tin đăng"} nào cho trạng thái này</div>
                </div>
            } />
            <Button type="primary" icon={<PlusOutlined />} onClick={onCreate} size="large">
                {queryButtonText}
            </Button>
        </div>
    );
}

export default EmptyState;
