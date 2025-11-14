import { useState, useCallback } from "react";
import dayjs from "dayjs";
import { App, Upload } from "antd";
import { updateContract } from "@services/contract.service";

export const STATUS_OPTIONS = ["UPLOADED", "SIGNED", "ACTIVE", "EXPIRED", "CANCELLED"];

export const LOCKED_STATUSES = new Set([]);
export const isLockedStatus = (st) => LOCKED_STATUSES.has(st);

export const STATUS_TEXT = {
  UPLOADED: "Đã tải lên",
  SIGNED: "Đã ký",
  ACTIVE: "Đang hiệu lực",
  EXPIRED: "Hết hiệu lực",
  CANCELLED: "Đã hủy",
};

export const STATUS_CHOICES = STATUS_OPTIONS.map((v) => ({
  value: v,
  label: STATUS_TEXT[v] || v,
}));

export default function useContractEditModal({ onUpdated } = {}) {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [record, setRecord] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [initialValues, setInitialValues] = useState({});

  const openModal = useCallback((row) => {
    setRecord(row || null);
    setInitialValues({
      status: row?.status ?? "UPLOADED",
      effectiveRange: [
        row?.effectiveFrom ? dayjs(row.effectiveFrom) : null,
        row?.effectiveTo ? dayjs(row.effectiveTo) : null,
      ],
      currentFileUrl: row?.fileUrl || "",
      readOnly: isLockedStatus(row?.status),
    });
    setFileList([]);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    setSubmitting(false);
    setRecord(null);
    setFileList([]);
  }, []);

  const beforeUpload = (file) => {
    const isPdf = file.type === "application/pdf" || file.name?.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      message.error("Vui lòng chọn file PDF.");
      return Upload.LIST_IGNORE;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Kích thước file phải nhỏ hơn 10MB.");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleSubmit = useCallback(
    async (values) => {
      if (!record?.id) {
        message.error("Thiếu thông tin hợp đồng.");
        return;
      }

      if (isLockedStatus(record?.status)) {
        message.warning("Trạng thái hiện tại không cho phép chỉnh sửa.");
        return;
      }

      const [from, to] = values.effectiveRange || [];
      if (from && to && to.isBefore(from)) {
        message.error("Ngày hiệu lực 'đến' phải sau 'từ'.");
        return;
      }

      setSubmitting(true);
      try {
        const newFile = values?.file?.fileList?.[0]?.originFileObj;

        await updateContract(
          record.id,
          {
            status: values.status,
            effectiveFrom: from ? dayjs(from) : null,
            effectiveTo: to ? dayjs(to) : null,
            note: values?.note || null,
          },
          newFile
        );

        message.success("Cập nhật hợp đồng thành công.");

        // ✅ Tự động đóng modal và reload danh sách
        setOpen(false);
        setSubmitting(false);
        onUpdated?.(); // <-- gọi callback load lại danh sách
      } catch (e) {
        console.error(e);
        message.error("Cập nhật hợp đồng thất bại.");
      } finally {
        setSubmitting(false);
      }
    },
    [record?.id, onUpdated, message]
  );

  return {
    open,
    submitting,
    record,
    initialValues,
    fileList,
    setFileList,
    beforeUpload,
    openModal,
    closeModal,
    handleSubmit,
    STATUS_CHOICES,
    STATUS_TEXT,
  };
}
