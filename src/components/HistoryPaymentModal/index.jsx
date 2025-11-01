import React from "react";
import { Modal, List, Button, Skeleton, Empty, Space, Typography, Tag } from "antd";
import usePaymentHistory from "./usePaymentHistory";
import PaymentItem from "./PaymentItem";
import s from "./HistoryPaymentModal.module.scss";

const HistoryPaymentModal = ({ open, orderId, onClose }) => {
    const { loading, items, hasMore, loadMore, refresh } = usePaymentHistory(open, orderId);

    const toVnd = (n) => typeof n === "number"
        ? n.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
        : n;

    return (
        <Modal
            title="Lịch sử thanh toán"
            open={open}
            onCancel={onClose}
            width={860}
            destroyOnClose
            footer={null}
        >
            <div className={s.headerRow}>
                <Typography.Text type="secondary">Mã đơn</Typography.Text>
                <Typography.Text strong className={s.mono}>{orderId ?? "-"}</Typography.Text>
                {items.length > 0 && (
                    <Tag color="blue" className={s.countTag}>{items.length} giao dịch</Tag>
                )}
                <div className={s.spacer} />
            </div>

            {loading && items.length === 0 ? (
                <Skeleton active paragraph={{ rows: 6 }} />
            ) : items.length === 0 ? (
                <div className={s.emptyWrap}>
                    <Empty description="Chưa có giao dịch" />
                </div>
            ) : (
                <>
                    <div className={s.listWrap}>
                        <List
                            dataSource={items}
                            rowKey={(p) => p.id}
                            split
                            renderItem={(p) => (
                                <List.Item className={s.item}>
                                    <PaymentItem p={p} toVnd={toVnd} />
                                </List.Item>
                            )}
                        />
                    </div>
                    <div className={s.footerBar}>
                        <div className={s.loadMore}>
                            {hasMore && (
                                <Button onClick={loadMore} loading={loading}>
                                    Tải thêm
                                </Button>
                            )}
                        </div>
                        <div className={s.actions}>
                            <Space>
                                <Button onClick={refresh}>Làm mới</Button>
                                <Button onClick={onClose} type="primary">Đóng</Button>
                            </Space>
                        </div>
                    </div>
                </>
            )}
        </Modal>
    );
}

export default HistoryPaymentModal;