import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useTaxonomy } from "@hooks/useTaxonomy";
import { normalizeListingPayload } from "@utils/normalizeListingPayload";
import { listingDrafts } from "@utils/listingDrafts";
import {
  staffCreateListing as StaffCreateListing,
  updateConsignmentListing,
} from "../services/staff/staffConsignmentService";
import { createListing as createUserListing } from "@services/listing.service";

export function useListingCreate({ userId = null, currentListingId = null } = {}) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [msg, contextHolder] = message.useMessage();

  const { loading, tax } = useTaxonomy(msg, {
    activeOnly: true,
    pruneEmpty: true,
    sort: true,
  });

  const [postTypeOpen, setPostTypeOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [postType, setPostType] = useState("FREE");
  const [visibility, setVisibility] = useState("NORMAL");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [draftId, setDraftId] = useState(() => listingDrafts.getCurrentId(userId));

  const categoryId = Form.useWatch("category", form);
  const selectedCategory = useMemo(
    () => (tax?.categoryOptions || []).find((o) => o.value === categoryId),
    [tax, categoryId]
  );
  const isBattery = selectedCategory?.code === "BATTERY";

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

  const handleChangeVisibility = useCallback(
    (v) => {
      setVisibility(v);
      setPostType(v === "BOOSTED" ? "PAID" : "FREE");
      if (draftId)
        listingDrafts.update(
          draftId,
          { visibility: v, postType: v === "BOOSTED" ? "PAID" : "FREE" },
          userId
        );
    },
    [draftId, userId]
  );

  useEffect(() => {
    const curId = listingDrafts.getCurrentId(userId);
    const id = draftId || curId;
    if (!id) return;
    const d = listingDrafts.load(id, userId);
    if (!d) return;
    if (d.formValues) form.setFieldsValue(d.formValues);
    if (d.visibility) setVisibility(d.visibility);
    if (d.postType) setPostType(d.postType);
    setDraftId(id);
    msg.info("Đã khôi phục bản nháp từ máy.");
  }, []);

  const autosaveTimer = useRef(null);
  const onValuesChange = useCallback(
    (_, all) => {
      if (!draftId) return;
      clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(() => {
        listingDrafts.update(
          draftId,
          {
            formValues: all,
            title: all?.title || "(Không tiêu đề)",
            visibility,
            postType,
          },
          userId
        );
      }, 600);
    },
    [draftId, visibility, postType, userId]
  );
  useEffect(() => () => clearTimeout(autosaveTimer.current), []);

  const handleDraft = useCallback(() => {
    const id = draftId || undefined;
    const formValues = form.getFieldsValue(true);
    const data = {
      id,
      formValues,
      visibility,
      postType,
      title: form.getFieldValue("title") || "(Không tiêu đề)",
    };
    const newId = listingDrafts.save(data, userId);
    setDraftId(newId);
    msg.success(`Đã lưu nháp #${String(newId).slice(-6)} trên máy.`);
  }, [draftId, form, visibility, postType, userId, msg]);

  const handleSubmit = useCallback(
    async (arg1 = "normal", arg2 = {}) => {
      if (submitting) return;
      try {
        const values = await form.validateFields();
        const allValues = form.getFieldsValue(true);
        safeSetSubmitting(true);

        const isModeString = typeof arg1 === "string";
        const mode = isModeString ? arg1 : "normal";
        const extra = isModeString ? arg2 : arg1;

        const status = extra?.status || "PENDING";
        const payload = normalizeListingPayload(
          allValues,
          tax,
          postType,
          visibility,
          status
        );

        if (mode === "agreement") {
          payload.consignmentAgreementId =
            allValues.consignmentAgreementId ?? payload.consignmentAgreementId ?? null;
          payload.responsibleStaffId =
            allValues.responsibleStaffId ?? payload.responsibleStaffId ?? userId ?? null;
          payload.branchId = allValues.branchId ?? payload.branchId ?? null;
        }

        let res;

        if (mode === "agreement-update") {
          const listingId = currentListingId || allValues.id;
          if (!listingId) {
            msg.error("Không tìm thấy ID tin đăng để cập nhật!");
            safeSetSubmitting(false);
            return;
          }

          const newImages =
            (allValues.images || [])
              .filter((f) => f?.originFileObj)
              .map((f) => f.originFileObj) || [];

          const newVideos =
            (allValues.videos || [])
              .filter((f) => f?.originFileObj)
              .map((f) => f.originFileObj) || [];

          const keepMediaIds = null;

          res = await updateConsignmentListing(
            listingId,
            payload,
            newImages,
            newVideos,
            keepMediaIds
          );
        } else if (mode === "agreement") {
          const imgs = (allValues.images || [])
            .map((f) => f.originFileObj || f)
            .filter((f) => f instanceof File);
          const vids = (allValues.videos || [])
            .map((f) => f.originFileObj || f)
            .filter((f) => f instanceof File);

          res = await StaffCreateListing(payload, imgs, vids);
        } else {
          res = await createUserListing(payload, images, videos);
        }

        if (res?.success !== false) {
          msg.success(
            mode === "agreement-update"
              ? "Cập nhật tin đăng thành công!"
              : "Đăng tin thành công!"
          );

          if (draftId) {
            listingDrafts.remove(draftId, userId);
            setDraftId(null);
          }

          form.resetFields();
          setImages([]);
          setVideos([]);

          if (mode === "agreement") {
            setTimeout(() => navigate("/staff/consignment/agreement"), 800);
          } else if (mode !== "agreement-update") {
            setTimeout(() => navigate("/my-ads"), 1000);
          }
        } else {
          msg.error(res?.message || "Thao tác thất bại!");
        }
      } catch (e) {
        if (e?.errorFields) msg.error("Vui lòng điền đầy đủ các trường bắt buộc.");
        else msg.error(e?.message || "Gửi dữ liệu thất bại.");
      } finally {
        safeSetSubmitting(false);
      }
    },
    [
      form,
      tax,
      postType,
      visibility,
      msg,
      submitting,
      draftId,
      userId,
      navigate,
      images,
      videos,
      currentListingId,
    ]
  );

  const handlePreview = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const preview = normalizeListingPayload(
        values,
        tax,
        postType,
        visibility,
        "PENDING"
      );
      localStorage.setItem("listing_preview", JSON.stringify(preview));
      msg.success("Đã lưu bản xem trước.");
    } catch {
      msg.error("Hãy điền đủ các trường bắt buộc trước khi xem trước.");
    }
  }, [form, tax, postType, visibility, msg]);

  const listLocalDrafts = useCallback(() => listingDrafts.list(userId), [userId]);

  const loadLocalDraftById = useCallback(
    (id) => {
      const d = listingDrafts.load(id, userId);
      if (!d) return false;
      if (d.formValues) form.setFieldsValue(d.formValues);
      if (d.visibility) setVisibility(d.visibility);
      if (d.postType) setPostType(d.postType);
      setDraftId(id);
      listingDrafts.setCurrentId(id, userId);
      msg.success(`Đã mở nháp #${String(id).slice(-6)}.`);
      return true;
    },
    [form, userId, msg]
  );

  const deleteLocalDraftById = useCallback(
    (id) => {
      listingDrafts.remove(id, userId);
      if (draftId === id) setDraftId(null);
      msg.success("Đã xoá nháp.");
    },
    [draftId, userId, msg]
  );

  return {
    form,
    msg,
    contextHolder,
    loading,
    tax,
    isBattery,
    postType,
    visibility,
    postTypeOpen,
    submitting,
    setPostTypeOpen,
    handleChangeVisibility,
    handleSubmit,
    handlePreview,
    handleDraft,
    onValuesChange,
    draftId,
    listLocalDrafts,
    loadLocalDraftById,
    deleteLocalDraftById,
    images,
    setImages,
    videos,
    setVideos,
  };
}
