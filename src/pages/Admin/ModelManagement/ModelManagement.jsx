import React from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Row,
  Col,
  Card,
  Tag,
} from "antd";
import { useModelManagementLogic } from "./ModelManagement.logic";
import "./ModelManagement.scss";
import HiddenModal from "../../../components/Modal/HiddenModal/HiddenModal";
import ModelModal from "../../../components/Modal/ModelModal/ModelModal";
import CategoryFilter from "../../../components/CategoryFilter/CategoryFilter";

const { Option } = Select;

const ModelManagement = () => {
  const {
    categories,
    brands,
    models,
    loading,
    selectedCategory,
    setSelectedCategory,
    isModalVisible,
    setIsModalVisible,
    editingModel,
    form,
    handleOpenModal,
    handleSubmit,
    deleteId,
    setDeleteId,
    handleDelete,
  } = useModelManagementLogic();

  const statusLabels = {
    ACTIVE: { label: "Hoạt động", color: "green" },
    HIDDEN: { label: "Đang ẩn", color: "red" },
  };

  const columns = [
    { title: "Tên Model", dataIndex: "name" },
    { title: "Năm sản xuất", dataIndex: "year" },
    { title: "Thương hiệu", dataIndex: "brandName" },
    {
      title: "Danh mục",
      render: (_, record) => {
        const cat = categories.find((c) => c.id === record.categoryId);
        return (
          <Tag color="blue" style={{ fontWeight: 500 }}>
            {cat ? cat.description : "Không xác định"}
          </Tag>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
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
    <div className="model-management">
      <h2>Quản lý mẫu mã</h2>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <Card
        title="Danh sách mẫu mã"
        extra={
          <Button type="primary" onClick={() => handleOpenModal()}>
            Thêm mẫu mới
          </Button>
        }
      >
        <Table
          rowKey="id"
          loading={loading}
          dataSource={models}
          columns={columns}
        />
      </Card>

      <ModelModal
        form={form}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleSubmit}
        editingModel={editingModel}
        categories={categories}
        brands={brands}
        setSelectedCategory={setSelectedCategory}
      />

      <HiddenModal
        visible={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ModelManagement;
