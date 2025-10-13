import React from "react";
import MemberSectionLayout from "@layouts/LayoutMember/MemberSectionLayout";
import ProfileBar from "@pages/Member/ManagerListing/ProfileBar"; // tái dùng nếu ok
import FavoriteSearchActions from "./FavoriteSearchActions";
import FavoriteList from "./FavoriteList";
import FavoriteEmpty from "./FavoriteEmpty";
import useFavoriteListings from "./useFavoriteListings";
import styles from "./ManageFavoriteListing.module.scss";

const ManageFavoriteListing = () => {
    const {
        loading,
        items,
        pagination,
        onChangeTable,
        query,
        setQuery,
        onToggleFavorite,
        onChat,
    } = useFavoriteListings();

    return (
        <MemberSectionLayout
            breadcrumbItems={[{ title: "ReEV", href: "/" }, { title: "Tin đã lưu" }]}
            loading={loading}
            hasData={items.length > 0}
            profileBar={<ProfileBar />}
            actions={
                <FavoriteSearchActions
                    className={styles.actions}
                    query={query}
                    onChangeQuery={setQuery}
                />
            }
            empty={<FavoriteEmpty />}
        >
            <FavoriteList
                items={items}
                pagination={pagination}
                onChange={onChangeTable}
                onToggleFavorite={onToggleFavorite}
                onChat={onChat}
            />
        </MemberSectionLayout>
    );
};

export default ManageFavoriteListing;
