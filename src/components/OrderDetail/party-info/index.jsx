import React from "react";
import { Card, Descriptions, Avatar, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import s from "./styles.module.scss";

export default function PartyInfo({ buyer, branch, createdBy }) {
    return (
        <Card title="Khách mua & Cơ sở" className={s.root}>
            <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Khách hàng">
                    <Avatar src={buyer?.profile?.avatarUrl} icon={<UserOutlined />} />
                    <span className={s.name}>{buyer?.profile?.fullName || buyer?.phoneNumber || "-"}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Cơ sở">
                    <b>{branch?.name || "-"}</b><br />
                    {branch?.address || "-"}{branch?.phone ? ` — ${branch.phone}` : ""}
                </Descriptions.Item>
                <Descriptions.Item label="Nhân viên tạo">
                    {createdBy?.profile?.fullName || "-"} {createdBy?.role ? <Tag>{createdBy.role}</Tag> : null}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
}


