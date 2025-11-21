import React, { useState } from "react";
import { Card, Input, Button, Table, message, Typography } from "antd";
import {
  getInspectionAvailability,
  bookInspectionSchedule,
} from "@/services/consigmentService";
import { useLocation, useNavigate } from "react-router-dom";
import "./InspectionAvailabilityPage.scss";
import DynamicBreadcrumb from "../../../../components/Breadcrumb/Breadcrumb";
import BookScheduleModal from "./BookingModal";
// import styles from "../../shared/ListingPage.module.scss";

const { Title } = Typography;

export default function InspectionAvailabilityPage() {
  const location = useLocation();
  const { requestId } = location.state || {};

  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [openBookModal, setOpenBookModal] = useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const navigate = useNavigate();

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];
  const maxDate = new Date(today.setDate(today.getDate() + 9))
    .toISOString()
    .split("T")[0];

  const handleOpenBookModal = (shiftId) => {
    setSelectedShiftId(shiftId);
    setOpenBookModal(true);
  };

  const handleConfirmBook = async (note) => {
    try {
      setBookingLoading(true);
      const res = await bookInspectionSchedule({
        requestId,
        shiftId: selectedShiftId,
        date: selectedDate,
        note,
      });
      if (res?.success) {
        message.success("Đặt lịch kiểm định thành công!");
        handleFetchAvailability();
        setOpenBookModal(false);
        navigate("/consignment");
      } else {
        message.error(res?.message || "Không thể đặt lịch kiểm định");
      }
    } catch {
      message.error("Lỗi khi đặt lịch kiểm định!");
    } finally {
      setBookingLoading(false);
    }
  };

  const columns = [
    { title: "Mã ca", dataIndex: "code", key: "code" },
    { title: "Tên ca", dataIndex: "name", key: "name" },
    {
      title: "Bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      align: "center",
    },
    {
      title: "Kết thúc",
      dataIndex: "endTime",
      key: "endTime",
      align: "center",
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleOpenBookModal(record.shiftId)}
        >
          Đặt ca
        </Button>
      ),
    },
  ];

  const handleFetchAvailability = async () => {
    if (!requestId) {
      message.error("Thiếu thông tin ký gửi. Vui lòng quay lại trang trước.");
      return;
    }
    if (!selectedDate) {
      message.warning("Vui lòng chọn ngày kiểm định");
      return;
    }
    try {
      setLoading(true);
      const res = await getInspectionAvailability({
        requestId,
        date: selectedDate,
      });
      if (res?.success && res?.data?.shifts) {
        const availableShifts = res.data.shifts.filter(
          (s) => !s.booked && !s.disable
        );
        setAvailability({ ...res.data, shifts: availableShifts });
        message.success("Tải danh sách ca kiểm định thành công!");
      } else {
        setAvailability(null);
        message.warning(res?.message || "Không có dữ liệu ca khả dụng!");
      }
    } catch {
      message.error("Lỗi khi tải danh sách ca kiểm định!");
    } finally {
      setLoading(false);
    }
  };

  if (!requestId) {
    return (
      <div className="inspectionPage">
        <Card
          className="inspectionCard"
          variant="borderless"
        >
          <Title level={4} className="inspection-title">
            Thiếu dữ liệu ký gửi
          </Title>
          <p style={{ textAlign: "center" }}>
            Vui lòng quay lại trang trước và chọn "Lên lịch" từ một ký gửi hợp
            lệ.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="inspectionPage">
      {/* Breadcrumb giống ReEV */}
      <div className="breadcrumbSection">
        <DynamicBreadcrumb />
      </div>

      {/* Content giống ReEV */}
      <div className="content">
        <div className="pageInner">
          <Card
            className="inspectionCard"
            variant="borderless"
          >
            <Title level={3} className="inspectionTitle">
              Kiểm tra lịch hẹn khả dụng
            </Title>

            <div className="inspectionControls">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="dateInput"
                min={minDate}
                max={maxDate}
              />

              <Button
                type="primary"
                onClick={handleFetchAvailability}
                loading={loading}
                className="fetchBtn"
              >
                Xem lịch hẹn khả dụng
              </Button>
            </div>

            {availability && (
              <div className="inspectionResult">
                <Title level={4} className="inspectionSubtitle">
                  Ngày: {availability.date}
                </Title>

                <Table
                  showHeader
                  columns={columns}
                  dataSource={availability.shifts}
                  rowKey="shiftId"
                  pagination={false}
                  className="inspectionTable"
                />
              </div>
            )}
          </Card>
        </div>
      </div>

      <BookScheduleModal
        open={openBookModal}
        onCancel={() => setOpenBookModal(false)}
        onConfirm={handleConfirmBook}
        loading={bookingLoading}
      />
    </div>
  );
}
