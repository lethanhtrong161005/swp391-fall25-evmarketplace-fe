import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  Tag,
  Typography,
  Skeleton,
  Button,
  Space,
  message,
  DatePicker,
} from "antd";
import useInspectionSchedule from "./useStaffInspectionSchedule";
import CancelInspectionModal from "../../../components/CancelInspectionModal/CancelInspectionModal";
import ConsignmentFilterCard from "../../../components/ConsignmentFilterCard/ConsignmentFilterCard";
import dayjs from "dayjs";
import "./StaffInspectionSchedule.scss";
import {
  INSPECTION_STATUS_COLOR,
  INSPECTION_STATUS_LABELS,
} from "../../../utils/constants";

const { Title } = Typography;

export default function StaffInspectionSchedule() {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today);
  const {
    schedules,
    loading,
    handleCheckIn,
    handleCancelSchedule,
    fetchSchedulesByDate,
  } = useInspectionSchedule();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const statusOptions = [
    { value: "ALL", label: "Tất cả" },
    { value: "SCHEDULED", label: "Đã lên lịch" },
    { value: "CHECKED_IN", label: "Đã check-in" },
    { value: "NO_SHOW", label: "Vắng mặt" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  useEffect(() => {
    fetchSchedulesByDate(selectedDate.format("YYYY-MM-DD"));
  }, [selectedDate]);

  const handleOpenCancelModal = (id) => {
    setSelectedId(id);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async (reason) => {
    setConfirmLoading(true);
    try {
      await handleCancelSchedule(selectedId, reason);
      message.success("Đã đánh dấu vắng mặt!");
      setCancelModalOpen(false);
    } catch {
      message.error("Không thể hủy lịch kiểm định.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const filteredSchedules = useMemo(() => {
    let data = schedules;
    if (selectedStatus !== "ALL")
      data = data.filter((s) => s.status === selectedStatus);
    return data;
  }, [schedules, selectedStatus]);

  const columns = [
    {
      title: "Mã ca kiểm định",
      dataIndex: "shiftCode",
      key: "shiftCode",
      align: "center",
    },
    {
      title: "Loại",
      dataIndex: "itemType",
      key: "itemType",
      align: "center",
      render: (v) => (v === "BATTERY" ? "Pin" : v === "CAR" ? "Xe điện" : "-"),
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
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => handleCheckIn(record.id)}
            disabled={record.status !== "SCHEDULED"}
          >
            Đã đến
          </Button>
          <Button
            danger
            size="small"
            onClick={() => handleOpenCancelModal(record.id)}
            disabled={record.status !== "SCHEDULED"}
          >
            Hủy lịch
          </Button>
        </Space>
      ),
    },
  ];

  // const disabledDate = (current) =>
  //   current && (current < today.startOf("day") || current > today.add(2, "day").endOf("day"));

  return (
    <div className="staff-inspection-page">
      <h2>Lịch hẹn kiểm định</h2>

      <div className="filter-section">
        <div className="date-picker">
          <span>Chọn ngày: </span>
          <DatePicker
            value={selectedDate}
            onChange={(date) => setSelectedDate(date || today)}
            format="DD/MM/YYYY"
            // disabledDate={disabledDate}
          />
        </div>

        <div className="filter-group">
          <ConsignmentFilterCard
            title="Lọc theo trạng thái"
            options={statusOptions}
            selectedValue={selectedStatus}
            onChange={setSelectedStatus}
          />
        </div>
      </div>

      <div className="list-section">
        <div className="list-header">
          <Title level={4}>
            Lịch kiểm định ngày {selectedDate.format("DD/MM/YYYY")}
          </Title>
        </div>

        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredSchedules}
            pagination={false}
            locale={{
              emptyText: "Không có lịch kiểm định phù hợp.",
            }}
          />
        )}

        <CancelInspectionModal
          open={cancelModalOpen}
          onCancel={() => setCancelModalOpen(false)}
          onConfirm={handleConfirmCancel}
          loading={confirmLoading}
        />
      </div>
    </div>
  );
}
