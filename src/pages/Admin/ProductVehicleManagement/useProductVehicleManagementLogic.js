import { useState, useEffect } from "react";
import { Form, message } from "antd";
import { getAllCategories } from "@/services/categoryService";
import { getAllBrands } from "@/services/brandService";
import { getAllModels } from "@/services/modelService";
import {
  getAllVehicles,
  addVehicle,
  updateVehicle,
} from "@/services/vehicleService";

export const useProductVehicleManagementLogic = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("EV_CAR");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = async () => {
    setLoading(true);
    try {
      const [catRes, brandRes, modelRes, vehicleRes] = await Promise.all([
        getAllCategories(),
        getAllBrands(),
        getAllModels(),
        getAllVehicles(),
      ]);

      if (catRes.success) setCategories(catRes.data || []);
      if (brandRes.success) setBrands(brandRes.data || []);
      if (modelRes.success) setModels(modelRes.data || []);
      if (vehicleRes.success) setVehicles(vehicleRes.data || []);
    } catch {
      message.error("Lỗi khi tải dữ liệu!");
    }
    setLoading(false);
  };

  const handleOpenModal = (record = null) => {
    setEditingVehicle(record);

    if (record) {
      setSelectedCategory(record.category);
      setSelectedBrand(record.brandId || null);

      const car = record.car || record.carDetail;
      const bike = record.bike || record.bikeDetail;
      const ebike = record.ebike || record.ebikeDetail;

      form.setFieldsValue({
        category: record.category,
        name: record.name,
        description: record.description,
        releaseYear: record.releaseYear ?? 2020,
        batteryCapacityKwh: record.batteryCapacityKwh ?? 0,
        rangeKm: record.rangeKm ?? 0,
        motorPowerKw: record.motorPowerKw ?? 0,
        acChargingKw: record.acChargingKw ?? 0,
        dcChargingKw: record.dcChargingKw ?? 0,
        acConnector: record.acConnector,
        dcConnector: record.dcConnector,
      });

      if (record.category === "EV_CAR" && car) {
        form.setFieldsValue({
          seatingCapacity: car.seatingCapacity ?? 5,
          bodyType: car.bodyType ?? "SEDAN",
          drivetrain: car.drivetrain ?? "RWD",
          trunkRearL: car.trunkRearL ?? 400,
        });
      } else if (record.category === "E_MOTORBIKE" && bike) {
        form.setFieldsValue({
          motorLocation: bike.motorLocation ?? "HUB",
          wheelSize: bike.wheelSize ?? "14",
          brakeType: bike.brakeType ?? "DISC",
          weightKg: bike.weightKg ?? 90,
        });
      } else if (record.category === "E_BIKE" && ebike) {
        form.setFieldsValue({
          frameSize: ebike.frameSize ?? "M",
          wheelSize: ebike.wheelSize ?? "27.5",
          weightKg: ebike.weightKg ?? 25,
          maxLoad: ebike.maxLoad ?? 120,
          gears: ebike.gears ?? 7,
          removableBattery: !!ebike.removableBattery,
          throttle: !!ebike.throttle,
        });
      }
    } else {
      form.resetFields();
      form.setFieldsValue({
        category: selectedCategory || "EV_CAR",
      });
      setSelectedBrand(null);
    }

    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (!values.category && editingVehicle) {
        values.category = editingVehicle.category;
      }

      const payload = {
        name: values.name?.trim(),
        description: values.description || "",
        releaseYear: values.releaseYear,
        batteryCapacityKwh: values.batteryCapacityKwh,
        rangeKm: values.rangeKm,
        motorPowerKw: values.motorPowerKw,
        acChargingKw: values.acChargingKw ?? 0,
        dcChargingKw: values.dcChargingKw ?? null,
        acConnector: values.acConnector || "TYPE2",
        dcConnector: values.dcConnector || "CCS2",
        carDetail: null,
        bikeDetail: null,
        ebikeDetail: null,
        status: values.status || editingVehicle?.status || "ACTIVE",
      };

      if (payload.dcConnector === "NONE") {
        payload.dcChargingKw = null;
      } else if (!payload.dcChargingKw || payload.dcChargingKw <= 0) {
        payload.dcChargingKw = 1;
      }

      if (
        payload.acConnector === "OTHER" &&
        (!payload.acChargingKw || payload.acChargingKw <= 0)
      ) {
        payload.acChargingKw = 0.25;
      }

      switch (values.category) {
        case "EV_CAR":
          payload.carDetail = {
            seatingCapacity: values.seatingCapacity ?? 5,
            bodyType: values.bodyType ?? "SEDAN",
            drivetrain: values.drivetrain ?? "RWD",
            trunkRearL: values.trunkRearL ?? 400,
          };
          break;
        case "E_MOTORBIKE":
          payload.bikeDetail = {
            motorLocation: values.motorLocation ?? "HUB",
            wheelSize: values.wheelSize?.replace(/"/g, "") ?? "14",
            brakeType: values.brakeType ?? "DISC",
            weightKg: values.weightKg ?? 90,
          };
          break;
        case "E_BIKE":
          payload.ebikeDetail = {
            frameSize: values.frameSize || "M",
            wheelSize: values.wheelSize?.replace(/"/g, "") || "27.5",
            weightKg: values.weightKg ?? 25,
            maxLoad: values.maxLoad ?? 120,
            gears: values.gears ?? 7,
            removableBattery: Boolean(values.removableBattery),
            throttle: Boolean(values.throttle),
          };
          break;
        default:
          message.error("Danh mục không hợp lệ!");
          return;
      }

      if (editingVehicle) {
        const res = await updateVehicle(editingVehicle.id, payload);
        if (res.success) {
          message.success("Cập nhật xe thành công");
          await reloadData();
        } else {
          message.error(res.message || "Lỗi khi cập nhật xe");
        }
      } else {
        const selectedCat =
          categories.find((c) => c.name === values.category) || null;

        payload.categoryId = selectedCat ? selectedCat.id : null;
        payload.brandId = values.brandId;
        payload.modelId = values.modelId;
        if (!payload.carDetail) payload.carDetail = null;
        if (!payload.bikeDetail) payload.bikeDetail = null;
        if (!payload.ebikeDetail) payload.ebikeDetail = null;
        delete payload.status;

        const res = await addVehicle(payload);
        if (res.success) {
          message.success("Thêm xe mới thành công");
          await reloadData();
        } else {
          message.error(res.message || "Lỗi khi thêm xe mới");
        }
      }
    } catch (err) {
      console.error("handleSubmit error:", err);
      message.error("Có lỗi khi lưu xe!");
    }

    setIsModalVisible(false);
  };

  const filteredVehicles =
    selectedCategory === "ALL"
      ? vehicles
      : vehicles.filter((v) => v.category === selectedCategory);

  return {
    categories,
    brands,
    models,
    vehicles: filteredVehicles,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    loading,
    isModalVisible,
    setIsModalVisible,
    editingVehicle,
    form,
    handleOpenModal,
    handleSubmit,
  };
};
