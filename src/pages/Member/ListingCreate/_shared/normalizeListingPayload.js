// pages/Member/ListingCreate/_shared/normalizeListingPayload.js
import { normalizeAddressForBE } from "./address.mapper";

const isNil = (v) => v === null || v === undefined;

function getCategoryMeta(tax, categoryId) {
    const cat = (tax?.categoryOptions || []).find((o) => o.value === categoryId);
    return { code: cat?.code ?? null, isBattery: cat?.code === "BATTERY" };
}
const normalizePostType = (pt) => (pt === "PAID" ? "PAID" : "FREE");
const mapPostTypeToVisibility = (pt) => (pt === "PAID" ? "BOOSTED" : "NORMAL");

export function normalizeListingPayload(values, tax, postType) {
    const { province, district, ward, address } = normalizeAddressForBE(values.address);
    const { code: categoryCode, isBattery } = getCategoryMeta(tax, values.category);
    const _postType = normalizePostType(postType);
    const _visibility = mapPostTypeToVisibility(_postType);

    const base = {
        // ✅ tên camelCase theo CreateListingRequest
        categoryId: values.category,
        categoryCode,
        itemType: isBattery ? "BATTERY" : "VEHICLE",
        brand: values.brand || "",
        brandId: values.brand_id ?? values.brandId ?? null,
        model: values.model || "",
        modelId: values.model_id ?? values.modelId ?? null,
        title: values.title ?? null,
        year: values.year ?? null,
        color: values.color ?? null,
        description: values.description ?? null,
        price: values.price,
        province, district, ward, address,
        postType: _postType,          // FREE | PAID
        visibility: _visibility,      // NORMAL | BOOSTED
    };

    return isBattery
        ? {
            ...base,
            batteryCapacityKwh: values.battery_capacity_kwh ?? null,
            sohPercent: values.soh_percent ?? null,
        }
        : {
            ...base,
            batteryCapacityKwh: values.battery_capacity_kwh ?? null,
            sohPercent: values.soh_percent ?? null,
            mileageKm: values.mileage_km ?? null,
        };
}

export function buildCreateListingFormData(values, tax, postType) {
    const json = normalizeListingPayload(values, tax, postType);
    const fd = new FormData();

    // text/number fields — bỏ qua null/undefined để tránh gửi "null" (string)
    Object.entries(json).forEach(([k, v]) => {
        if (isNil(v)) return;
        fd.append(k, String(v));
    });

    // files từ Ant Upload
    (values.images || []).forEach((f, idx) => {
        const file = f.originFileObj || f.file || f;
        if (file instanceof File || file instanceof Blob) {
            fd.append("images", file, file.name ?? `image_${idx}.jpg`);
        }
    });
    (values.videos || []).forEach((f, idx) => {
        const file = f.originFileObj || f.file || f;
        if (file instanceof File || file instanceof Blob) {
            fd.append("videos", file, file.name ?? `video_${idx}.mp4`);
        }
    });

    return fd;
}
