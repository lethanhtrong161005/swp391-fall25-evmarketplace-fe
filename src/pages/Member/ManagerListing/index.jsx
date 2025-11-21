import React from "react";
import { Breadcrumb, Card, Skeleton } from "antd";
// import styles from "./styles.module.scss";
import style from "../shared/ListingPage.module.scss";

import ProfileBar from "./ProfileBar";
import SearchActions from "./SearchActions";
import StatusTabs from "./StatusTabs";
import ListingTable from "./ListingTable";
import EmptyState from "./EmptyState";

import useManagerListing from "@pages/Member/ManagerListing/useManagerListing";
import useListingPayment from "@hooks/useListingPayment";
import DynamicBreadcrumb from "../../../components/Breadcrumb/Breadcrumb";

const ManagerListing = () => {
  const {
    loading,
    tabs,
    counts,
    activeTab,
    setActiveTab,
    query,
    setQuery,
    itemsForActiveTab,
    goCreateListing,
    onView,
    onEdit,
    onDelete,
    pagination,
    onChangeTable,
    deletingId,
    onRestore,
    onHide,
    refreshData,
  } = useManagerListing();

  const { payingId, payForListing } = useListingPayment();

  return (
    <div
      className={style.layoutContainer}
      style={{ boxShadow: "none", padding: 0 }}
    >
      <div className={style.breadcrumbSection}>
        <DynamicBreadcrumb />
      </div>

      <div
        className={style.content}
        style={{ backgroundColor: "#E9F2FF", padding: "0px", marginBottom: 0 }}
      >
        <Card
          variant="borderless"
          style={{
            margin: 0,
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
            maxWidth: "1440px",
            width: "100%",
            borderTop: "1px solid rgb(0,0,0,0.1)",
          }}
        >
          <ProfileBar />
          <SearchActions
            query={query}
            onChangeQuery={setQuery}
            onCreate={goCreateListing}
            onRefresh={refreshData}
          />
          <StatusTabs
            tabs={tabs}
            counts={counts}
            activeKey={activeTab}
            onChange={(k) => {
              setActiveTab(k);
            }}
          />

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
              deletingId={deletingId}
              onRestore={(row, action) =>
                action === "hide" ? onHide(row) : onRestore(row)
              }
              isTrash={activeTab === "SOFT_DELETED"}
            />
          ) : (
            <EmptyState onCreate={goCreateListing} queryButtonText="Đăng tin" />
          )}
        </Card>
      </div>
    </div>
  );
};

export default ManagerListing;
