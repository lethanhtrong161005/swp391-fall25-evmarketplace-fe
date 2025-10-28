import React from "react";
import { App } from "antd";
import s from "./styles.module.scss";
import useStaffOrder from "./useStaffOrder";
import ProfileBar from "./ProfileBar";
import SearchActions from "./SearchActions";
import StatusTabs from "./StatusTabs";
import OrderTable from "./OrderTable";
import EmptyState from "./EmptyState";
import CashCollectModal from "./CashCollectModal";
import ContractCreateModal from "./ContractCreateModal";
import OrderDetail from "@components/OrderDetail";


const StaffOrder = () => {
    const logic = useStaffOrder();
    const { loading, rows, total } = logic;

    return (
        <App>
            <div className={s.root}>
                <ProfileBar rows={rows} loading={loading} />
                <SearchActions {...logic} />
                <StatusTabs status={logic.status} onChangeStatus={logic.onChangeStatus} />
                {(!loading && total === 0) ? (
                    <EmptyState onRefresh={logic.onRefresh} />
                ) : (
                    <OrderTable
                        {...logic}
                        onCollectCash={logic.openCashModal}
                        onCreateContract={logic.openCreateContract}
                        onCancel={logic.onCancel}
                    />
                )}

                <CashCollectModal
                    open={logic.cashModal.open}
                    order={logic.cashModal.order}
                    onCancel={logic.closeCashModal}
                    onSubmit={logic.submitCash}
                />

                <ContractCreateModal
                    open={logic.contractModal.open}
                    order={logic.contractModal.order}
                    staffId={logic.staffId}
                    onCancel={logic.closeCreateContract}
                    onSubmit={logic.submitCreateContract}
                />

                <OrderDetail
                    open={logic.detailModal.open}
                    orderId={logic.detailModal.orderId}
                    onClose={logic.closeDetail}
                />
            </div>
        </App>
    );
}

export default StaffOrder;
