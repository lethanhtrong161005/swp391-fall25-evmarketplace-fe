import React from "react";
import { Table, Button, Modal, Form, Input, Select, Card, Tag } from "antd";
import "./CategoryManagement.scss";
import { useCategoryManagementLogic } from "./CategoryManagement.logic";
import CategoryModal from "../../../components/Modal/CategoryModal/CategoryModal";
import HiddenModal from "../../../components/Modal/HiddenModal/HiddenModal";

const { Option } = Select;

export default function CategoryManagement() {
  const {
    categories,
    loading,
    isModalVisible,
    setIsModalVisible,
    editingCategory,
    form,
    handleOpenModal,
    handleSubmit,
    deleteId,
    setDeleteId,
    handleDelete,
  } = useCategoryManagementLogic();

  const statusLabels = {
    ACTIVE: { label: "Hoạt động", color: "green" },
    HIDDEN: { label: "Đang ẩn", color: "red" },
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (desc) => desc || <i style={{ color: "#999" }}>Không có mô tả</i>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const info = statusLabels[status] || {
          label: status,
          color: "default",
        };
        return (
          <Tag color={info.color} style={{ fontWeight: 500 }}>
            {info.label}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleOpenModal(record)}>
            Chỉnh sửa
          </Button>
          <Button
            danger
            type="link"
            onClick={() => setDeleteId(record.id)}
            disabled={record.status === "HIDDEN"} 
          >
            Ẩn
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="category-management">
      <h2>Quản lý danh mục</h2>

      <Card title="Danh sách danh mục">
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={categories}
          pagination={false}
        />
      </Card>

      <CategoryModal
        form={form}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleSubmit}
        editingCategory={editingCategory}
      />

      <HiddenModal
        visible={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
