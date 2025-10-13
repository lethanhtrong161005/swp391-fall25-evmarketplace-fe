import React from "react";
import ProfileBar from "./ProfileBar";
import SearchActions from "./SearchActions";
import StatusTabs from "./StatusTabs";
import ListingTable from "./ListingTable";
import EmptyState from "./EmptyState";

import useManagerListing from "@pages/Member/ManagerListing/useManagerListing";
import useListingPayment from "@hooks/useListingPayment";

import MemberSectionLayout from "@layouts/LayoutMember/MemberSectionLayout";

const ManagerListing = () => {
    const {
        loading, tabs, counts, activeTab, setActiveTab,
        query, setQuery, itemsForActiveTab, goCreateListing,
        onView, onEdit, onDelete, pagination, onChangeTable,
        deletingId, onRestore, onHide,
    } = useManagerListing();

    const { payingId, payForListing } = useListingPayment();

    return (
        <MemberSectionLayout
            breadcrumbItems={[{ title: "ReEV", href: "/" }, { title: "Quản lý tin" }]}
            loading={loading}
            hasData={itemsForActiveTab.length > 0}
            profileBar={<ProfileBar />}
            actions={
                <SearchActions
                    query={query}
                    onChangeQuery={setQuery}
                    onCreate={goCreateListing}
                />
            }
            tabs={
                <StatusTabs
                    tabs={tabs}
                    counts={counts}
                    activeKey={activeTab}
                    onChange={(k) => setActiveTab(k)}
                />
            }
            empty={<EmptyState onCreate={goCreateListing} />}
        >
            <ListingTable
                items={itemsForActiveTab}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                pagination={pagination}
                onChange={onChangeTable}
                onPay={payForListing}
                payingId={payingId}
                deletingId={deletingId}
                onRestore={(row, action) =>
                    action === "hide" ? onHide(row) : onRestore(row)
                }
                isTrash={activeTab === "SOFT_DELETED"}
            />
        </MemberSectionLayout>
    );
};

export default ManagerListing;
