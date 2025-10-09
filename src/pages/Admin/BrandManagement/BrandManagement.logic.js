import { useState, useEffect } from "react";
import { Form, message } from "antd";
import { getAllCategories } from "@/services/categoryService";
import {
  getAllBrands,
  addBrand,
  updateBrand,
  deleteBrand,
} from "@/services/brandService";

export const useBrandManagementLogic = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(1);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = async () => {
    setLoading(true);
    try {
      const [catRes, brandRes] = await Promise.all([
        getAllCategories(),
        getAllBrands(),
      ]);
      if (catRes.success) setCategories(catRes.data || []);
      if (brandRes.success) setBrands(brandRes.data || []);
    } catch {
      message.error("Lỗi khi tải dữ liệu");
    }
    setLoading(false);
  };

  const handleOpenModal = (record = null) => {
    setEditingBrand(record);
    if (record) {
      form.setFieldsValue({
        name: record.name,
        status: record.status,
        categoryIds: record.categoryIds,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: "ACTIVE", categoryIds: [] });
    }
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      const res = editingBrand
        ? await updateBrand(editingBrand.id, values)
        : await addBrand(values);

      if (res.success) {
        message.success(
          editingBrand ? "Cập nhật brand thành công" : "Thêm brand mới thành công"
        );
        await reloadData();
      } else {
        message.error(res.message || "Lỗi khi lưu brand");
      }
    } catch {
      message.error("Có lỗi khi lưu brand!");
    }
    setIsModalVisible(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await deleteBrand(deleteId);
      if (res.success) {
        message.success("Xóa brand thành công");
        await reloadData();
      } else {
        message.error(res.message || "Lỗi khi xóa brand");
      }
    } catch {
      message.error("Có lỗi khi xóa brand!");
    }
    setDeleteId(null);
  };

  const filteredBrands =
    selectedCategory && selectedCategory !== "ALL"
      ? brands.filter(
          (b) => Array.isArray(b.categoryIds) && b.categoryIds.includes(selectedCategory)
        )
      : brands;

  return {
    brands: filteredBrands,
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
  };
};
