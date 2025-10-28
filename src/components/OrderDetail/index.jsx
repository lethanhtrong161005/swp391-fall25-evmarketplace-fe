import React from "react";
import { Modal, Space, Skeleton, Empty, Button } from "antd";
import useOrderDetail from "./useOrderDetail";
import Summary from "./summary";
import PartyInfo from "./party-info";
import ProductCard from "./product-card";
import s from "./styles.module.scss";

export default function OrderDetail({ open, orderId, onClose }) {
    const { loading, data, actions } = useOrderDetail(open, orderId);

    return (
        <>
            <Modal
                title="Chi tiết đơn hàng"
                open={open}
                onCancel={onClose}
                footer={<Button onClick={onClose}>Đóng</Button>}
                width={920}
                destroyOnClose
            >
                {loading ? (
                    <Skeleton active />
                ) : !data?.order ? (
                    <Empty description="Không có thông tin" />
                ) : (
                    <Space direction="vertical" size="large" className={s.root}>
                        <Summary order={data.order} onCopyOrderNo={actions.copyOrderNo} />
                        <PartyInfo buyer={data.buyer} branch={data.branch} createdBy={data.createdBy} />
                        <ProductCard listing={data.listing} />
                        <div className={s.actions}>
                            {actions.canDownloadContract ? (
                                <Button type="primary" onClick={actions.viewContract} aria-label="Xem hợp đồng">Xem hợp đồng</Button>
                            ) : null}
                            <Button onClick={actions.copyOrderNo} aria-label="Sao chép Order No">Sao chép Order No</Button>
                            <Button onClick={actions.viewPaymentHistory} aria-label="Xem lịch sử thanh toán">Xem lịch sử thanh toán</Button>
                        </div>
                    </Space>
                )}
            </Modal>

            <Modal
                title="Hợp đồng"
                open={actions.contract.open}
                onCancel={actions.closeContract}
                footer={<Button onClick={actions.closeContract}>Đóng</Button>}
                width={980}
                style={{ top: 24 }}
                bodyStyle={{ padding: 0, height: "80vh" }}
                destroyOnClose
            >
                {actions.contract.url ? (
                    <iframe title="contract" src={actions.contract.url} style={{ width: "100%", height: "100%", border: 0 }} />
                ) : (
                    <Skeleton active style={{ margin: 24 }} />
                )}
            </Modal>
        </>
    );
}


