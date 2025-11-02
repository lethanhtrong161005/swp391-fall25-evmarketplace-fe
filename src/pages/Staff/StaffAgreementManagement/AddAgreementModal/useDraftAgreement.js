import { useEffect } from "react";
import dayjs from "dayjs";

const useDraftAgreement = (form, key = "agreement_draft") => {
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
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
      const values = form.getFieldsValue(true);
      // ❌ Không lưu các field chứa file
      const { images, videos, agreementFile, ...rest } = values;

      if (rest.startAt && rest.startAt.isValid) {
        rest.startAt = rest.startAt.format("YYYY-MM-DD HH:mm:ss");
      }

      localStorage.setItem(key, JSON.stringify(rest));
      return true;
    } catch (err) {
      console.error("Failed to save draft:", err);
      return false;
    }
  };

  const loadDraft = () => {
    const saved = localStorage.getItem(key);
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.startAt && typeof parsed.startAt === "string") {
        parsed.startAt = dayjs(parsed.startAt);
      }
      return parsed;
    } catch {
      return null;
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(key);
  };

  return { saveDraft, loadDraft, clearDraft };
};

export default useDraftAgreement;
