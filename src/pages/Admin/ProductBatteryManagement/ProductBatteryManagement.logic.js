import { useState, useEffect } from "react";
import { Form, message } from "antd";
import { getAllBrands } from "@/services/brandService";
import { getAllModels } from "@/services/modelService";
import {
  getAllBatteries,
  addBattery,
  updateBattery,
} from "@/services/batteryService";

export const useProductBatteryManagementLogic = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBattery, setEditingBattery] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = async () => {
    setLoading(true);
    try {
      const [brandRes, modelRes, batteryRes] = await Promise.all([
        getAllBrands(),
        getAllModels(),
        getAllBatteries(),
      ]);
      if (brandRes.success) setBrands(brandRes.data || []);
      if (modelRes.success) setModels(modelRes.data || []);
      if (batteryRes.success) setBatteries(batteryRes.data || []);
    } catch {
      message.error("Lỗi khi tải dữ liệu");
    }
    setLoading(false);
  };

  const handleOpenModal = (record = null) => {
    setEditingBattery(record);

    if (record) {
      // === Sửa ===
      form.setFieldsValue({
        modelId: record.modelId,
        chemistry: record.chemistry,
        capacityKwh: record.capacityKwh,
        voltage: record.voltage,
        weightKg: record.weightKg,
        dimension: record.dimension,
        status: record.status || "ACTIVE",
      });
    } else {
      // === Thêm mới ===
      form.resetFields();
      form.setFieldsValue({ status: "ACTIVE" });
    }

    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        modelId: values.modelId,
        chemistry: values.chemistry?.trim(),
        capacityKwh: values.capacityKwh,
        voltage: values.voltage,
        weightKg: values.weightKg || null,
        dimension: values.dimension?.trim() || null,
      };

      const res = editingBattery
        ? await updateBattery(editingBattery.id, {
            ...payload,
            status: values.status,
          })
        : await addBattery(payload);

      if (res.success) {
        message.success(
          editingBattery ? "Cập nhật pin thành công" : "Thêm pin mới thành công"
        );
        await reloadData();
      } else {
        message.error(res.message || "Lỗi khi lưu pin");
      }
    } catch (err) {
      message.error("Có lỗi khi lưu pin!");
    }

    setIsModalVisible(false);
  };

  return {
    brands,
    models,
    batteries,
    loading,
    isModalVisible,
    setIsModalVisible,
    editingBattery,
    form,
    handleOpenModal,
    handleSubmit,
  };
};
