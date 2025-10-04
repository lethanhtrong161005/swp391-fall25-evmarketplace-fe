import { useState, useEffect } from "react";
import { Form, message } from "antd";
import { fetchCategories } from "@pages/Staff/CategoryManagement/CategoryManagement.logic";
import { fetchBrands } from "@pages/Staff/BrandManagement/BrandManagement.logic";
import { get, post, put, remove } from "@/utils/apiCaller";

export const useModelManagementLogic = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [deleteId, setDeleteId] = useState(null); // ✅ state modal xóa
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories(setCategories, setLoading);
    fetchBrands(setBrands, setLoading);
    reloadModels();
  }, []);

  const reloadModels = async () => {
    setLoading(true);
    try {
      const res = await get("/api/model/all");
      if (res.success) {
        setModels(res.data || []);
      } else {
        message.error(res.message || "Không tải được models");
      }
    } catch {
      message.error("Lỗi khi tải models");
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
      if (editingModel) {
        const res = await put(`/api/model/update/${editingModel.id}`, {
          name: values.name,
          year: values.year,
          categoryId: values.categoryId,
          brandId: values.brandId,
          status: values.status,
        });
        if (res.success) {
          message.success("Cập nhật model thành công");
          await reloadModels();
        } else {
          message.error(res.message || "Lỗi khi cập nhật model");
        }
      } else {
        const res = await post("/api/model/add", {
          name: values.name,
          year: values.year,
          categoryId: values.categoryId,
          brandId: values.brandId,
        });
        if (res.success) {
          message.success("Thêm mới model thành công");
          await reloadModels();
        } else {
          message.error(res.message || "Lỗi khi thêm mới model");
        }
      }
    } catch {
      message.error("Có lỗi khi lưu model!");
    }
    setIsModalVisible(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await remove(`/api/model/delete/${deleteId}`, undefined);
      if (res.success) {
        message.success("Xóa model thành công");
        await reloadModels();
      } else {
        message.error(res.message || "Lỗi khi xóa model");
      }
    } catch {
      message.error("Có lỗi khi xóa model!");
    }
    setDeleteId(null); // đóng modal
  };

  const filteredModels = models.filter((m) => m.categoryId === selectedCategory);

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
