import React from "react";
import { Card, Table, Tag, Typography, Skeleton } from "antd";
import useInspectionSchedule from "./useStaffInspectionSchedule";
import dayjs from "dayjs";
import "./StaffInspectionSchedule.scss";
import {INSPECTION_STATUS_COLOR, INSPECTION_STATUS_LABELS} from "../../../utils/constants"

const { Title } = Typography;

export default function StaffInspectionSchedule() {
  const { schedules, loading, today } = useInspectionSchedule();

  const columns = [
    {
      title: "Mã ca kiểm định",
      dataIndex: "shiftCode",
      key: "shiftCode",
      align: "center",
    },
    {
      title: "Ngày kiểm định",
      dataIndex: "scheduleDate",
      key: "scheduleDate",
      align: "center",
      render: (v) => dayjs(v).format("DD/MM/YYYY"),
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "shiftStartTime",
      key: "shiftStartTime",
      align: "center",
      render: (v) => v || "-",
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "shiftEndTime",
      key: "shiftEndTime",
      align: "center",
      render: (v) => v || "-",
    },
    {
      title: "Người lên lịch",
      dataIndex: "scheduledByName",
      key: "scheduledByName",
      align: "center",
      render: (v) => v || "—",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
         <Tag color={INSPECTION_STATUS_COLOR[status] || "default"}>
              {INSPECTION_STATUS_LABELS[status] || status}
            </Tag>
      ),
    },
  ];

   return (
    <div className="staff-inspection-page">
      <h2>Lịch hẹn kiểm định</h2>
      <div className="list-section">
        <div className="list-header">
          <Title level={4}>
            Lịch kiểm định ngày {dayjs(today).format("DD/MM/YYYY")}
          </Title>
        </div>

        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={schedules}
            pagination={false}
            locale={{
              emptyText: "Không có lịch kiểm định nào cho ngày hôm nay.",
            }}
          />
        )}
      </div>
    </div>
  );
}
