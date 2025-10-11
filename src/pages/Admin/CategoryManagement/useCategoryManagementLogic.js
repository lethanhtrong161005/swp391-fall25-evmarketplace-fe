import { useState, useEffect } from "react";
import { Form, message } from "antd";
import {
  getAllCategories,
  updateCategory,
  hideCategory,
} from "@/services/categoryService";

export const useCategoryManagementLogic = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form] = Form.useForm();

  const reloadCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories();
      if (res.success) {
        setCategories(res.data || []);
      } else {
        message.error(res.message || "Không lấy được danh sách danh mục");
      }
    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    reloadCategories();
  }, []);

  const handleOpenModal = (record = null) => {
    setEditingCategory(record);

    if (record) {
      form.setFieldsValue({
        name: record.name,
        description: record.description,
        status: record.status,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: "ACTIVE" });
    }

    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    if (!editingCategory) return;

    try {
      const res = await updateCategory(editingCategory.id, values);
      if (res.success) {
        message.success("Cập nhật danh mục thành công");
        await reloadCategories();
      } else {
        message.error(res.message || "Lỗi khi cập nhật danh mục");
      }
    } catch {
      message.error("Có lỗi khi lưu danh mục!");
    }

    setIsModalVisible(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await hideCategory(deleteId);
      if (res.success) {
        message.success("Ẩn danh mục thành công");
        await reloadCategories();
      } else {
        message.error(res.message || "Lỗi khi ẩn danh mục");
      }
    } catch {
      message.error("Có lỗi khi ẩn danh mục!");
    }

    setDeleteId(null);
  };

  return {
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
  };
};
