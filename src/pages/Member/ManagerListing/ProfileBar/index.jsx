import React from "react";
import { Avatar, Badge, Space, Tag, Skeleton } from "antd";
import styles from "./ProfileBar.module.scss";
import useUserProfileBar from "./useProfileBar";

const roleLabel = (r) => (r === "ADMIN" ? "Quản trị" : r === "STAFF" ? "Nhân viên" : "Thành viên");

const ProfileBar = () => {
    const { loading, data } = useUserProfileBar();

    if (loading) {
        return (
            <div className={styles.profileBar}>
                <div className={styles.left}>
                    <Skeleton.Avatar active size={48} />
                    <div style={{ marginLeft: 12 }}>
                        <Skeleton.Input active size="small" style={{ width: 180 }} />
                        <div style={{ height: 6 }} />
                        <Skeleton.Input active size="small" style={{ width: 120 }} />
                    </div>
                </div>
                <div className={styles.actions}>
                    <Skeleton.Button active size="small" />
                </div>
            </div>
        );
    }

    const name = data?.profile?.fullName || "Người dùng";
    const role = data?.profile?.role || "MEMBER";
    const avatar =
        data?.profile?.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=96&background=D9E3F0&color=2F365F`;


    return (
        <div className={styles.profileBar}>
            <div className={styles.left}>
                <Badge count={data?.unread || 0} size="small">
                    <Avatar size={48} src={avatar} />
                </Badge>
                <div>
                    <div className={styles.name}>{name}</div>
                    <Space size={8} wrap>
                        <Tag>{roleLabel(role)}</Tag>
                    </Space>
                </div>
            </div>

            <div className={styles.actions}>
                <Space size={8}>
                    {data?.stats?.published > 0 && <Tag color="success">Đang hiển thị: {data.stats.published}</Tag>}
                    {data?.stats?.pending > 0 && <Tag color="gold">Chờ duyệt: {data.stats.pending}</Tag>}
                    {data?.stats?.draft > 0 && <Tag color="blue">Nháp: {data.stats.draft}</Tag>}
                </Space>
            </div>
        </div>
    );   
};

export default ProfileBar;
