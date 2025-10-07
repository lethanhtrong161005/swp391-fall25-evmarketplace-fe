import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { Form, message } from "antd";
import { useTaxonomy } from "@hooks/useTaxonomy";
import { createListing } from "@services/listing.service";
import { normalizeListingPayload } from "@pages/Member/ListingCreate/_shared/normalizeListingPayload";

export function useListingCreate() {
    const [form] = Form.useForm();
    const [msg, contextHolder] = message.useMessage();

    const { loading, tax } = useTaxonomy(msg, { activeOnly: true, pruneEmpty: true, sort: true });

    const [postTypeOpen, setPostTypeOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // 👉 tách rõ 2 state
    const [postType, setPostType] = useState("FREE");       // FREE | PAID
    const [visibility, setVisibility] = useState("NORMAL"); // NORMAL | BOOSTED

    const categoryId = Form.useWatch("category", form);
    const selectedCategory = useMemo(
        () => (tax?.categoryOptions || []).find((o) => o.value === categoryId),
        [tax, categoryId]
    );
    const isBattery = selectedCategory?.code === "BATTERY";

    const mountedRef = useRef(true);
    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);
    const safeSetSubmitting = (v) => { if (mountedRef.current) setSubmitting(v); };

    // 👉 handler khi chọn trong modal (phát ra NORMAL/BOOSTED)
    const handleChangeVisibility = useCallback((v) => {
        setVisibility(v);
        setPostType(v === "BOOSTED" ? "PAID" : "FREE");
    }, []);

    const handleSubmit = useCallback(async () => {
        if (submitting) return;
        try {
            const values = await form.validateFields();
            safeSetSubmitting(true);

            const payload = normalizeListingPayload(values, tax, postType, visibility);
            await createListing(payload, values.images, values.videos);

            msg.success("Đăng tin thành công!");
            form.resetFields();
        } catch (e) {
            if (e?.errorFields) msg.error("Vui lòng điền đầy đủ các trường bắt buộc.");
            else msg.error(e?.message || "Đăng tin thất bại.");
        } finally {
            safeSetSubmitting(false);
        }
    }, [form, tax, postType, visibility, msg, submitting]);

    const handlePreview = useCallback(async () => {
        try {
            const values = await form.validateFields();
            const preview = normalizeListingPayload(values, tax, postType, visibility);
            localStorage.setItem("listing_preview", JSON.stringify(preview));
            msg.success("Đã lưu bản xem trước.");
        } catch {
            msg.error("Hãy điền đủ các trường bắt buộc trước khi xem trước.");
        }
    }, [form, tax, postType, visibility, msg]);

    const handleDraft = useCallback(() => {
        const values = form.getFieldsValue(true);
        const payload = normalizeListingPayload(values, tax, postType, visibility);
        localStorage.setItem("listing_draft", JSON.stringify(payload));
        msg.success("Đã lưu nháp.");
    }, [form, tax, postType, visibility, msg]);

    return {
        form, msg, contextHolder,
        loading, tax, isBattery,

        // expose cả 2 state + modal
        postType, visibility, postTypeOpen, submitting,
        setPostTypeOpen, handleChangeVisibility,

        handleSubmit, handlePreview, handleDraft,
    };
}
