import { useState, useEffect } from "react";
import { Form, message } from "antd";
import { getAllCategories } from "@/services/categoryService";
import { getAllBrands } from "@/services/brandService";
import {
  getAllModels,
  addModel,
  updateModel,
  deleteModel,
} from "@/services/modelService";

export const useModelManagementLogic = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = async () => {
    setLoading(true);
    try {
      const [catRes, brandRes, modelRes] = await Promise.all([
        getAllCategories(),
        getAllBrands(),
        getAllModels(),
      ]);

      if (catRes.success) setCategories(catRes.data || []);
      if (brandRes.success) setBrands(brandRes.data || []);
      if (modelRes.success) setModels(modelRes.data || []);
    } catch {
      message.error("Lỗi khi tải dữ liệu!");
    }
    setLoading(false);
  };

  const handleOpenModal = (record = null) => {
    setEditingModel(record);
    if (record) {
      form.setFieldsValue({
        categoryId: record.categoryId,
        brandId: record.brandId,
        name: record.name,
        year: record.year,
        status: record.status || "ACTIVE",
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: "ACTIVE" });
    }
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      const res = editingModel
        ? await updateModel(editingModel.id, values)
        : await addModel(values);

      if (res.success) {
        message.success(editingModel ? "Cập nhật model thành công" : "Thêm model mới thành công");
        await reloadData();
      } else {
        message.error(res.message || "Lỗi khi lưu model");
      }
    } catch {
      message.error("Có lỗi khi lưu model!");
    }
    setIsModalVisible(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await deleteModel(deleteId);
      if (res.success) {
        message.success("Xóa model thành công");
        await reloadData();
      } else {
        message.error(res.message || "Lỗi khi xóa model");
      }
    } catch {
      message.error("Có lỗi khi xóa model!");
    }
    setDeleteId(null);
  };

  const filteredModels = models.filter(
    (m) => m.categoryId === selectedCategory
  );

  return {
    categories,
    brands,
    models: filteredModels,
    selectedCategory,
    setSelectedCategory,
    loading,
    isModalVisible,
    setIsModalVisible,
    editingModel,
    form,
    handleOpenModal,
    handleSubmit,
    deleteId,
    setDeleteId,
    handleDelete,
  };
};
