import { useState, useEffect } from "react";
import { Form, message } from "antd";
import { get, put } from "@/utils/apiCaller";

// ✅ Hàm fetch tất cả danh mục
export const fetchCategories = async (setCategories, setLoading) => {
  setLoading(true);
  try {
    const res = await get("/api/category/all");
    if (res.success) {
      setCategories(res.data || []);
    } else {
      message.error(res.message || "Không lấy được danh sách danh mục");
    }
  } catch {
    message.error("Lỗi khi tải danh mục!");
  }
  setLoading(false);
};

// ✅ Hook logic chính
export const useCategoryManagementLogic = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // State cho modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [form] = Form.useForm();

  // ✅ Fetch danh sách khi vào trang
  useEffect(() => {
    fetchCategories(setCategories, setLoading);
  }, []);

  // ✅ Mở modal chỉnh sửa
  const handleOpenModal = (record) => {
    setEditingCategory(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      status: record.status,
    });
    setIsModalVisible(true);
  };

  // ✅ Lưu chỉnh sửa danh mục
  const handleSubmit = async (values) => {
    if (!editingCategory) return;

    try {
      const res = await put(`/api/category/update/${editingCategory.id}`, values);
      if (res.success) {
        message.success("Cập nhật danh mục thành công");
        await fetchCategories(setCategories, setLoading);
      } else {
        message.error(res.message || "Lỗi khi cập nhật danh mục");
      }
    } catch {
      message.error("Có lỗi khi lưu danh mục!");
    }

    setIsModalVisible(false);
  };

  // ✅ Ẩn danh mục (tương đương xóa mềm)
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await put(`/api/category/update/${deleteId}`, { status: "HIDDEN" });
      if (res.success) {
        message.success("Ẩn danh mục thành công");
        await fetchCategories(setCategories, setLoading);
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
