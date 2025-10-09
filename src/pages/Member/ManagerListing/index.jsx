
import React from "react";
import { Breadcrumb, Card, Skeleton } from "antd";
import styles from "./styles.module.scss";

import ProfileBar from "./ProfileBar";
import SearchActions from "./SearchActions";
import StatusTabs from "./StatusTabs";
import ListingTable from "./ListingTable";
import EmptyState from "./EmptyState";

import useManagerListing from "@hooks/useManagerListing";
import useListingPayment from "@/hooks/useListingPayment";


const ManagerListing = () => {
    const {
        loading, tabs, counts, activeTab, setActiveTab,
        query, setQuery, itemsForActiveTab, goCreateListing,
        onView, onEdit, onDelete, pagination, onChangeTable,
    } = useManagerListing();

    const { payingId, payForListing } = useListingPayment();

    return (
        <div className={styles.wrapper}>
            <div className={styles.breadcrumb}>
                <Breadcrumb items={[{ title: "ReEV", href: "/" }, { title: "Quản lý tin" }]} />
            </div>

            <Card className={styles.card} bordered={false}>
                <ProfileBar />
                <SearchActions query={query} onChangeQuery={setQuery} onCreate={goCreateListing} />
                <StatusTabs tabs={tabs} counts={counts} activeKey={activeTab} onChange={(k) => { setActiveTab(k); }} />

                {loading ? (
                    <Skeleton active paragraph={{ rows: 6 }} />
                ) : itemsForActiveTab.length ? (
                    <ListingTable
                        items={itemsForActiveTab}
                        onView={onView}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        pagination={pagination}
                        onChange={onChangeTable}
                        onPay={payForListing}
                        payingId={payingId}
                    />
                ) : (
                    <EmptyState onCreate={goCreateListing} />
                )}
            </Card>
        </div>
    );
};

export default ManagerListing;
