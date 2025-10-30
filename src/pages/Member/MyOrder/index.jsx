import React from "react";
import { Breadcrumb, Card, App } from "antd";
import OrderDetail from "@components/OrderDetail";
import HistoryPaymentModal from "@components/HistoryPaymentModal";
import s from "./styles.module.scss";
import useMyOrder from "./useMyOrder";
import ProfileBar from "./ProfileBar";
import SearchActions from "./SearchActions";
import OrderTable from "./OrderTable";
import EmptyState from "./EmptyState";
import PaymentModal from "./PaymentModal";

const MyOrder = () => {
    const logic = useMyOrder();
    const { loading, rows, total } = logic;

    return (
        <App>
            <div className={s.wrapper}>
                <div className={s.breadcrumb}>
                    <Breadcrumb items={[{ title: "ReEV", href: "/" }, { title: "Đơn hàng của tôi" }]} />
                </div>
                <div className={s.content}>
                    <Card className={s.card} bordered={false}>
                        <ProfileBar rows={rows} loading={loading} />
                        <SearchActions {...logic} />
                        {(!loading && total === 0) ? (
                            <EmptyState onRefresh={logic.onRefresh} />
                        ) : (
                            <OrderTable
                                {...logic}
                                onPay={logic.openPaymentModal}
                                onDownloadContract={logic.onDownloadContract}
                                onCancel={logic.onCancel}
                                onViewDetail={logic.onViewDetail}
                            />
                        )}
            </Card>
                            </div>

                <PaymentModal
                    open={logic.paymentModal.open}
                    order={logic.paymentModal.order}
                    onCancel={logic.closePaymentModal}
                    onSubmit={logic.submitPayment}
                />

                <OrderDetail
                    open={logic.detailModal.open}
                    orderId={logic.detailModal.orderId}
                    onClose={logic.closeDetailModal}
                    onOpenPaymentHistory={logic.openPaymentHistory}
                />

                <HistoryPaymentModal
                    open={logic.historyModal.open}
                    orderId={logic.historyModal.orderId}
                    onClose={logic.closePaymentHistory}
                />
        </div>
        </App>
    );
};

export default MyOrder;
