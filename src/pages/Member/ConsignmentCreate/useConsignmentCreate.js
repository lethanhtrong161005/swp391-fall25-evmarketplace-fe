import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { Form, message } from "antd";
import { addConsignment } from "../../../services/consigmentService";
import { getAllCategoryDetail } from "../../../services/categoryService";

export default function useConsignmentCreate() {
  const [form] = Form.useForm();
  const [msg, contextHolder] = message.useMessage();

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
  const safeSetSubmitting = (v) => {
    if (mountedRef.current) setSubmitting(v);
  };

  const itemType = Form.useWatch("itemType", form);
  const categoryId = Form.useWatch("categoryId", form);

  const isBattery = itemType === "BATTERY";

  const selectedCategory = useMemo(
    () => (tax?.categoryOptions || []).find((c) => c.value === categoryId),
    [tax, categoryId]
  );

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

      const res = await addConsignment(payload, files);

      if (res?.success) {
        msg.success("Gửi yêu cầu ký gửi thành công!");
        form.resetFields();
      } else {
        msg.error(res?.message || "Không thể gửi ký gửi!");
      }
    } catch (e) {
      if (e?.errorFields)
        msg.error("Vui lòng điền đầy đủ các trường bắt buộc.");
      else msg.error(e?.message || "Lỗi khi gửi ký gửi.");
    } finally {
      safeSetSubmitting(false);
    }
  }, [form, msg, submitting]);

  return {
    form,
    msg,
    contextHolder,
    tax,
    taxLoading,
    isBattery,
    submitting,
    handleSubmit,
    selectedCategory
  };
}
