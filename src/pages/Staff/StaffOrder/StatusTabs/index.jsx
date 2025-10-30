import React from "react";
import { Tag } from "antd";
import {
    FileTextOutlined, ClockCircleOutlined, FileDoneOutlined,
    DollarCircleOutlined, CheckCircleOutlined, CloseCircleOutlined,
} from "@ant-design/icons";
import { STATUS_META } from "../constants";

export const StatusTag = ({ st }) => {
    const meta = STATUS_META[st] || { color: "default", label: st };
    const iconMap = {
        INITIATED: <FileTextOutlined />,
        PENDING_PAYMENT: <ClockCircleOutlined />,
        PAID: <DollarCircleOutlined />,
        CONTRACT_SIGNED: <FileDoneOutlined />,
        COMPLETED: <CheckCircleOutlined />,
        CANCELED: <CloseCircleOutlined />,   
        PAYMENT_FAILED: <CloseCircleOutlined />,
    };
    return <Tag color={meta.color} icon={iconMap[st]}>{meta.label}</Tag>;
};

export default StatusTag;
