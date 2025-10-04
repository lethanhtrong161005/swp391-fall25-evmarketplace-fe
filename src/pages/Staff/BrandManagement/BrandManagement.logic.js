import { useState, useEffect } from "react";
import { Form, message } from "antd";
import { get, post, put, remove } from "@/utils/apiCaller";
import { fetchCategories } from "@pages/Staff/CategoryManagement/CategoryManagement.logic";

// ✅ Export để ModelManagement có thể dùng chung
export const fetchBrands = async (setBrands, setLoading) => {
  setLoading(true);
  try {
    const res = await get("/api/brand/all");
    if (res.success) {
      setBrands(res.data || []);
    } else {
      message.error(res.message || "Không tải được danh sách brand");
    }
  } catch {
    message.error("Lỗi khi tải brand!");
  }
  setLoading(false);
};

export const useBrandManagementLogic = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔁 Filter theo Category
  const [selectedCategory, setSelectedCategory] = useState(1);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories(setCategories, setLoading);
    fetchBrands(setBrands, setLoading);
  }, []);

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
      if (editingBrand) {
        const res = await put(`/api/brand/update/${editingBrand.id}`, values);
        if (res.success) {
          message.success("Cập nhật brand thành công");
          await fetchBrands(setBrands, setLoading);
        } else {
          message.error(res.message || "Lỗi khi cập nhật brand");
        }
      } else {
        const res = await post("/api/brand/add", values);
        if (res.success) {
          message.success("Thêm mới brand thành công");
          await fetchBrands(setBrands, setLoading);
        } else {
          message.error(res.message || "Lỗi khi thêm mới brand");
        }
      }
    } catch {
      message.error("Có lỗi khi lưu brand!");
    }
    setIsModalVisible(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await remove(`/api/brand/delete/${deleteId}`, undefined);
      if (res.success) {
        message.success("Xóa brand thành công");
        await fetchBrands(setBrands, setLoading);
      } else {
        message.error(res.message || "Lỗi khi xóa brand");
      }
    } catch {
      message.error("Có lỗi khi xóa brand!");
    }
    setDeleteId(null);
  };

  // ✅ Filter theo category (nếu có selectedCategory)
  const filteredBrands =
    selectedCategory
      ? brands.filter(
          (b) => Array.isArray(b.categoryIds) && b.categoryIds.includes(selectedCategory)
        )
      : brands;

  return {
    brands: filteredBrands, // dùng danh sách đã filter
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
