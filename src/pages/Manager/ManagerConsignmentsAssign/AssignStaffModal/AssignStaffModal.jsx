import React, { useState } from "react";
import { Modal, Select, Button, Space, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import useBranchStaff from "@/hooks/useStaffOfBranch";

const AssignStaffModal = ({ branchId, visible, onClose, onAssign }) => {
  const { staffList, loading } = useBranchStaff(branchId);
  const [selectedStaffId, setSelectedStaffId] = useState(null);

  const handleOk = () => {
    if (!selectedStaffId) return;
    onAssign(selectedStaffId);
    onClose();
  };

  return (
    <Modal
      title="Phân công nhân viên"
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Select
          showSearch
          placeholder="Chọn nhân viên"
          value={selectedStaffId}
          loading={loading}
          onChange={(value) => setSelectedStaffId(value)}
          style={{ width: "100%" }}
          filterOption={(input, option) =>
            option?.staffName?.toLowerCase().includes(input.toLowerCase()) ||
            option?.staffEmail?.toLowerCase().includes(input.toLowerCase())
          }
          options={staffList.map((staff) => ({
            value: staff.id,
            staffName: staff.profile?.fullName || "",
            staffEmail: staff.email || "",
            label: (
              <Space>
                <Avatar
                  src={staff.profile?.avatarUrl}
                  icon={<UserOutlined />}
                  size="small"
                />
                <span>
                  {staff.profile?.fullName || "Chưa có tên"}
                  {staff.email && (
                    <span style={{ color: "#888", marginLeft: 4 }}>
                      ({staff.email})
                    </span>
                  )}
                </span>
              </Space>
            ),
          }))}
        />

        <div style={{ textAlign: "right", marginTop: 16 }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" disabled={!selectedStaffId} onClick={handleOk}>
            Xác nhận
          </Button>
        </div>
      </Space>
    </Modal>
  );
};

export default AssignStaffModal;
