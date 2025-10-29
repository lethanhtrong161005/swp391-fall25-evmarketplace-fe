import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, message } from "antd";
import {
  addConsignment,
  updateConsignmentRequest,
} from "../../../services/consigmentService";
import { getAllCategoryDetail } from "../../../services/categoryService";

export default function useConsignmentCreate(
  mode = "create",
  initialData = null
) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [msg, contextHolder] = message.useMessage();

  // ====== FETCH TAXONOMY (category, brand, model) ======
  const [taxLoading, setTaxLoading] = useState(false);
  const [tax, setTax] = useState({
    categoryOptions: [],
    brandsByCategory: {},
    modelsByCatBrand: {},
  });

  useEffect(() => {
    const fetchTaxonomies = async () => {
      setTaxLoading(true);
      try {
        const catRes = await getAllCategoryDetail();
        const categories = Array.isArray(catRes)
          ? catRes.map((c) => ({
              id: c.id,
              name: c.name,
              description: c.description,
              code: c.code || c.name,
              brands: c.brands || [],
            }))
          : [];

        const categoryOptions = categories.map((c) => ({
          value: c.id,
          label: c.description || c.name,
          code: c.code,
        }));

        const brandsByCategory = categories.reduce((acc, cat) => {
          acc[cat.id] = (cat.brands || []).map((b) => ({
            id: b.id,
            label: b.name,
            value: b.id,
          }));
          return acc;
        }, {});

        const modelsByCatBrand = categories.reduce((acc, cat) => {
          (cat.brands || []).forEach((b) => {
            const key = `${cat.id}#${b.id}`;
            acc[key] = (b.models || []).map((m) => ({
              id: m.id,
              label: m.name,
              value: m.id,
              brandId: b.id,
            }));
          });
          return acc;
        }, {});

        setTax({ categoryOptions, brandsByCategory, modelsByCatBrand });
      } catch (err) {
        console.error(err);
        msg.error("Không thể tải danh mục chi tiết!");
      } finally {
        setTaxLoading(false);
      }
    };

    fetchTaxonomies();
  }, [msg]);

  const [submitting, setSubmitting] = useState(false);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const safeSetSubmitting = (v) => mountedRef.current && setSubmitting(v);

  const itemType = Form.useWatch("itemType", form);
  const categoryId = Form.useWatch("categoryId", form);
  const isBattery = itemType === "BATTERY";

  const selectedCategory = useMemo(
    () => (tax?.categoryOptions || []).find((c) => c.value === categoryId),
    [tax, categoryId]
  );

  useEffect(() => {
    if (!initialData) return;
    const imageFiles =
      initialData.mediaUrls?.map((url, index) => ({
        uid: String(index),
        name: url.split("/").pop(),
        status: "done",
        url,
      })) || [];

    form.setFieldsValue({
      itemType: initialData.itemType,

      category: initialData.categoryId, 
      brand_id: initialData.brandId, 
      model_id: initialData.modelId, 

      brand: initialData.brand,
      model: initialData.model,

      year: initialData.year,
      ownerExpectedPrice: initialData.ownerExpectedPrice,

      mileage_km: initialData.mileageKm,
      battery_capacity_kwh: initialData.batteryCapacityKwh,
      soh_percent: initialData.sohPercent,

      images: imageFiles,
      videos: [],

      note: initialData.note || "",
      preferredBranchId: initialData.preferredBranchId, 
    });
  }, [initialData, form]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    try {
      const values = await form.validateFields();
      safeSetSubmitting(true);

      const payload = {
        itemType: values.itemType,
        categoryId: values.category,
        brandId: values.brand_id || null,
        modelId: values.model_id || null,
        brand: values.brand || "",
        model: values.model || "",
        year: values.year,
        batteryCapacityKwh: values.battery_capacity_kwh || null,
        sohPercent: values.soh_percent || null,
        mileageKm: values.mileage_km || 0,
        preferredBranchId: values.preferredBranchId,
        ownerExpectedPrice: values.ownerExpectedPrice,
        note: values.note || "",
      };

      const files = {
        images: values.images?.map((f) => f.originFileObj),
        videos: values.videos?.map((f) => f.originFileObj),
      };

      let res;
      if (mode === "create") {
        res = await addConsignment(payload, files);
      } else {
        const requestId = initialData?.id || values?.id;
        if (!requestId) throw new Error("Thiếu ID ký gửi cần cập nhật!");
        res = await updateConsignmentRequest(
          requestId,
          payload,
          files.images,
          files.videos
        );
      }

      if (res?.success === true || res?.status === 200) {
        msg.success(
          mode === "create"
            ? "Gửi yêu cầu ký gửi thành công!"
            : "Cập nhật ký gửi thành công!"
        );
        if (mode === "create") {
          msg.success("Tạo yêu cầu ký gửi thành công!");
          setTimeout(() => navigate("/consignment"), 800);
        } else {
          msg.success("Cập nhật yêu cầu ký gửi thành công!");
          setTimeout(() => navigate("/consignment"), 800);
        }
      } else {
        msg.error(res?.message || "Không thể xử lý yêu cầu!");
      }
    } catch (e) {
      if (e?.errorFields)
        msg.error("Vui lòng điền đầy đủ các trường bắt buộc.");
      else msg.error(e?.message || "Lỗi khi gửi dữ liệu.");
    } finally {
      safeSetSubmitting(false);
    }
  }, [form, msg, submitting, mode, initialData]);

  return {
    form,
    msg,
    contextHolder,
    tax,
    taxLoading,
    isBattery,
    submitting,
    handleSubmit,
    selectedCategory,
  };
}
