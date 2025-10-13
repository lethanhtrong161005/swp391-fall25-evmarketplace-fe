import React from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Card,
  Tag,
} from "antd";
import { useBrandManagementLogic } from "./useBrandManagementLogic";
import "./BrandManagement.scss";
import CategoryFilter from "@components/CategoryFilter/CategoryFilter";
import BrandModal from "@components/Modal/BrandModal/BrandModal";
import HiddenModal from "@components/Modal/HiddenModal/HiddenModal";

const { Option } = Select;

const BrandManagement = () => {
  const {
    brands,
    categories,
    loading,
    selectedCategory,
    setSelectedCategory,
    isModalVisible,
    setIsModalVisible,
    editingBrand,
    form,
    handleOpenModal,
    handleSubmit,
    deleteId,
    setDeleteId,
    handleDelete,
  } = useBrandManagementLogic();

  const statusLabels = {
    ACTIVE: { label: "Hoạt động", color: "green" },
    HIDDEN: { label: "Đang ẩn", color: "red" },
  };

  const columns = [
    { title: "Tên thương hiệu", dataIndex: "name" },
    {
      title: "Danh mục",
      render: (_, record) =>
        record.categoryIds?.map((id) => {
          const cat = categories.find((c) => c.id === id);
          return (
            <Tag
              key={id}
              color="blue"
              style={{ marginBottom: 4, fontWeight: 500 }}
            >
              {cat ? cat.description : "Không xác định"}
            </Tag>
          );
        }),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        const s = statusLabels[status] || { label: status, color: "default" };
        return <Tag color={s.color}>{s.label}</Tag>;
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
    <div className="brand-management">
      <h2>Quản lý thương hiệu</h2>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <Card
        title="Danh sách thương hiệu"
        extra={
          <Button type="primary" onClick={() => handleOpenModal()}>
            Thêm thương hiệu mới
          </Button>
        }
      >
        <Table
          rowKey="id"
          loading={loading}
          dataSource={brands}
          columns={columns}
        />
      </Card>
      <BrandModal
        form={form}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleSubmit}
        editingBrand={editingBrand}
        categories={categories}
      />

      <HiddenModal
        visible={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default BrandManagement;
