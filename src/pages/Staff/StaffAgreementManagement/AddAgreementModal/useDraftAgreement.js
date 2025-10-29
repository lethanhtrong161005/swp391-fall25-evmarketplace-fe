import { useEffect } from "react";
import dayjs from "dayjs";

const useDraftAgreement = (form, key = "agreement_draft") => {
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // ✅ Convert lại startAt nếu có
        if (parsed.startAt && typeof parsed.startAt === "string") {
          parsed.startAt = dayjs(parsed.startAt);
        }

        form.setFieldsValue(parsed);
      } catch (err) {
        console.error("Failed to parse saved draft:", err);
      }
    }
  }, [form, key]);

  const saveDraft = () => {
    try {
      const values = form.getFieldsValue();

      // ⚠️ Không lưu dayjs object trực tiếp (chuyển sang string)
      if (values.startAt && values.startAt.isValid) {
        values.startAt = values.startAt.format("YYYY-MM-DD HH:mm:ss");
      }

      localStorage.setItem(key, JSON.stringify(values));
      return true;
    } catch (err) {
      console.error("Failed to save draft:", err);
      return false;
    }
  };

  const loadDraft = () => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // ✅ Convert lại
        if (parsed.startAt && typeof parsed.startAt === "string") {
          parsed.startAt = dayjs(parsed.startAt);
        }
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  };

  const clearDraft = () => {
    localStorage.removeItem(key);
  };

  return { saveDraft, loadDraft, clearDraft };
};

export default useDraftAgreement;
