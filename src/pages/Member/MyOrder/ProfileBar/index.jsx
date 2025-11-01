import React from "react";
import { Avatar, Badge, Space, Tag, Skeleton } from "antd";
import styles from "./ProfileBar.module.scss";
import useProfileBar from "./useProfileBar";

const roleLabel = (r) => (r === "ADMIN" ? "Quản trị" : r === "STAFF" ? "Nhân viên" : "Thành viên");

const ProfileBar = ({ rows = [], loading }) => {
    const { loading: profileLoading, data } = useProfileBar();

    if (loading || profileLoading) {
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

    // Calculate stats from rows
    const stats = {
        total: rows.length,
        pending: rows.filter(r => ['PENDING_PAYMENT'].includes(r.status)).length,
        completed: rows.filter(r => ['COMPLETED', 'CONTRACT_SIGNED'].includes(r.status)).length,
    };

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
                        <Tag color="processing">Đơn hàng của tôi</Tag>
                    </Space>
                </div>
            </div>

            <div className={styles.actions}>
                <Space size={8}>
                    {stats.total > 0 && <Tag color="success">Tổng đơn: {stats.total}</Tag>}
                    {stats.pending > 0 && <Tag color="gold">Chờ thanh toán: {stats.pending}</Tag>}
                    {stats.completed > 0 && <Tag color="green">Hoàn tất: {stats.completed}</Tag>}
                </Space>
            </div>
        </div>
    );
};

export default ProfileBar;

