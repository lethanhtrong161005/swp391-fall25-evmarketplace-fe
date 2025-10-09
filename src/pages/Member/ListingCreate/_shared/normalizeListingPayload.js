import { normalizeAddressForBE } from "./address.mapper";

// Thêm tham số cuối 'status' (string)
export function normalizeListingPayload(values, tax, postType, visibility = "NORMAL", status = "PENDING") {
    const selectedCat = (tax?.categoryOptions || []).find(o => o.value === values.category);
    const code = selectedCat?.code ?? ""; // EV_CAR | E_MOTORBIKE | E_BIKE | BATTERY
    const itemType = code === "BATTERY" ? "BATTERY" : "VEHICLE";

    const { province, district, ward, address } = normalizeAddressForBE(values.address);

    const payload = {
        categoryId: values.category,
        categoryCode: code,
        itemType,

        brand: values.brand || "",
        brandId: values.brand_id ?? null,

        model: values.model || "",
        modelId: values.model_id ?? null,

        title: values.title || "",
        year: values.year ?? null,
        color: values.color || null,

        batteryCapacityKwh: values.battery_capacity_kwh ?? null,
        sohPercent: values.soh_percent ?? null,
        mileageKm: values.mileage_km ?? null,

        price: values.price ?? null,
        description: values.description || "",

        province, district, ward, address,

        postType,        // "FREE" | "PAID"
        visibility,      // "NORMAL" | "BOOSTED"
        status,          // ➜ NEW: "DRAFT" | "PENDING" | ...
    };

    // Ép kiểu số lớn sang string nếu BE yêu cầu (tùy hệ của bạn)
    ["price", "batteryCapacityKwh", "sohPercent"].forEach(k => {
        if (payload[k] != null) payload[k] = String(payload[k]);
    });

    return payload;
}
