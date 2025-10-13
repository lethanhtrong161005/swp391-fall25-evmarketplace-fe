import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Form, message } from "antd";
import { useTaxonomy } from "@hooks/useTaxonomy";
import { getListingDetailBySeller, updateListing } from "@services/listing.service";
import { normalizeListingPayload } from "@utils/normalizeListingPayload";
import { mapMediaToUploadFormat, debugMediaMapping } from "@utils/mediaUtils";

export function useListingEdit({ userId = null, listingId = null } = {}) {
    const [form] = Form.useForm();
    const [msg, contextHolder] = message.useMessage();

    const { loading, tax } = useTaxonomy(msg, { activeOnly: true, pruneEmpty: true, sort: true });

    const [fetching, setFetching] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [postType, setPostType] = useState("FREE");
    const [visibility, setVisibility] = useState("NORMAL");
    const [postTypeOpen, setPostTypeOpen] = useState(false);
    const [status, setStatus] = useState(null);
    const [rejectedReason, setRejectedReason] = useState(null);
    const [rejectedAt, setRejectedAt] = useState(null);


    // giữ “cat info” để force khi submit
    const [forcedCatCode, setForcedCatCode] = useState(null);
    const [forcedItemType, setForcedItemType] = useState(null); // "VEHICLE" | "BATTERY"

    const mountedRef = useRef(true);
    useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);
    const safeSetSubmitting = (v) => { if (mountedRef.current) setSubmitting(v); };
    const safeSetFetching = (v) => { if (mountedRef.current) setFetching(v); };

    const mapListingToForm = (data) => {
        if (!data?.listing) return {};
        const l = data.listing;
        const v = data.productVehicle || {};

        return {
            category: l.categoryId,

            brand: l.brand || undefined,
            brand_id: l.brandId || undefined,
            model: l.model || undefined,
            model_id: l.modelId || undefined,

            title: l.title,
            price: l.price,
            year: l.year,
            color: l.color,
            description: l.description,

            status: l.status,
            rejectedReason: l.rejectedReason,
            rejectedAt: l.rejectedAt,

            // Pin
            voltage: l.voltage ?? null,
            chemistry: l.batteryChemistry ?? null,
            weight_kg: l.massKg ?? null,
            dimension: l.dimensions ?? null,

            // Địa chỉ
            address: {
                line: l.address,
                province: l.province ? { value: l.province, label: l.province } : undefined,
                district: l.district ? { value: l.district, label: l.district } : undefined,
                ward: l.ward ? { value: l.ward, label: l.ward } : undefined,
            },

            // Xe
            battery_capacity_kwh: l.batteryCapacityKwh || v.batteryCapacityKwh,
            soh_percent: l.sohPercent,
            mileage_km: l.mileageKm,

            range_km: v.rangeKm,
            motor_power_kw: v.motorPowerKw,
            ac_charging_kw: v.acChargingKw,
            dc_charging_kw: v.dcChargingKw,
            ac_connector: v.acConnector,
            dc_connector: v.dcConnector,

            images: (() => {
                const media = data.media || [];
                debugMediaMapping(media);
                return mapMediaToUploadFormat(media, "IMAGE");
            })(),
            videos: (() => {
                const media = data.media || [];
                return mapMediaToUploadFormat(media, "VIDEO");
            })(),
        };
    };

    const loadListingForEdit = useCallback(async (id) => {
        if (!id) return;
        try {
            safeSetFetching(true);
            const res = await getListingDetailBySeller(id);

            if (res?.data) {
                const listingData = res.data;
                const mapped = mapListingToForm(listingData);
                form.setFieldsValue(mapped);

                // set visibility/postType
                const vis = listingData.listing.visibility || "NORMAL";
                setVisibility(vis);
                setPostType(vis === "BOOSTED" ? "PAID" : "FREE");

                // force categoryCode + itemType cho EDIT
                const catOpt = (tax?.categoryOptions || []).find(o => o.value === listingData.listing.categoryId);
                const catCode = catOpt?.code || null;
                setForcedCatCode(catCode);
                setForcedItemType(catCode === "BATTERY" ? "BATTERY" : "VEHICLE");

                setStatus(listingData.listing.status || null);
                setRejectedReason(listingData.listing.rejectedReason || null);
                setRejectedAt(listingData.listing.rejectedAt || null);

                msg.success("Đã tải dữ liệu bài đăng.");
            } else {
                msg.error("Không tìm thấy dữ liệu bài đăng.");
            }
        } catch (err) {
            msg.error("Lỗi khi tải dữ liệu bài đăng: " + (err?.message || "Unknown error"));
        } finally {
            safeSetFetching(false);
        }
    }, [form, msg, tax]);

    useEffect(() => {
        if (!listingId) { safeSetFetching(false); return; }
        if (loading) return;   // đợi taxonomy có options
        loadListingForEdit(listingId);
    }, [listingId, loading, loadListingForEdit]);

    // Cho phần Battery form
    const categoryId = Form.useWatch("category", form);
    const selectedCategory = useMemo(
        () => (tax?.categoryOptions || []).find((o) => o.value === categoryId),
        [tax, categoryId]
    );
    const isBattery = (forcedItemType ?? (selectedCategory?.code === "BATTERY" ? "BATTERY" : "VEHICLE")) === "BATTERY";

    const handleChangeVisibility = useCallback((v) => {
        setVisibility(v);
        setPostType(v === "BOOSTED" ? "PAID" : "FREE");
    }, []);

    const handleSubmit = useCallback(async () => {
        if (submitting) return;
        try {
            const values = await form.validateFields();
            safeSetSubmitting(true);

            const submitStatus = values.status;

            const payload = normalizeListingPayload(
                values,
                tax,
                postType,
                visibility,
                submitStatus,
                { forcedCategoryCode: forcedCatCode, forcedItemType: forcedItemType }
            );

            const res = await updateListing(listingId, payload, values.images, values.videos);
            if (res?.success !== false) msg.success("Cập nhật tin thành công!");
            else msg.error(res?.message || "Cập nhật tin thất bại.");
        } catch (e) {
            if (e?.errorFields) msg.error("Vui lòng điền đầy đủ các trường bắt buộc.");
            else msg.error(e?.message || "Lỗi khi cập nhật tin.");
        } finally {
            safeSetSubmitting(false);
        }
    }, [form, tax, postType, visibility, listingId, submitting, msg, forcedCatCode, forcedItemType]);

    const onValuesChange = useCallback(() => { }, []);

    return {
        form, msg, contextHolder,
        loading, tax, fetching,
        isBattery, postType, visibility, submitting,
        postTypeOpen, setPostTypeOpen,
        handleChangeVisibility, handleSubmit,
        onValuesChange,
        status, rejectedReason, rejectedAt,
    };
}
