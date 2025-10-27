import React from "react";
import s from "./styles.module.scss";
import useStaffOrder from "./useStaffOrder";
import ProfileBar from "./ProfileBar";
import SearchActions from "./SearchActions";
import StatusTabs from "./StatusTabs";
import OrderTable from "./OrderTable";
import EmptyState from "./EmptyState";
import CashCollectModal from "./CashCollectModal";


const StaffOrder = () => {
    const logic = useStaffOrder();
    const { loading, rows, total } = logic;

    return (
        <div className={s.root}>
            <ProfileBar rows={rows} loading={loading} />
            <SearchActions {...logic} />
            <StatusTabs status={logic.status} onChangeStatus={logic.onChangeStatus} />
            {(!loading && total === 0) ? (
                <EmptyState onRefresh={logic.onRefresh} />
            ) : (
                <OrderTable {...logic} onCollectCash={logic.openCashModal} />
            )}

            <CashCollectModal
                open={logic.cashModal.open}
                order={logic.cashModal.order}
                onCancel={logic.closeCashModal}
                onSubmit={logic.submitCash}
            />
        </div>
    );
}

export default StaffOrder;
