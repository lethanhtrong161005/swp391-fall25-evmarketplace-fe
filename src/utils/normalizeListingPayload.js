const normalizeAddressForBE = (addr = {}) => ({
    province: addr?.province?.label ?? addr?.province ?? "",
    district: addr?.district?.label ?? addr?.district ?? "",
    ward: addr?.ward?.label ?? addr?.ward ?? "",
    address: addr?.line ?? "",
});

export function normalizeListingPayload(
    values,
    tax,
    postType,
    visibility = "NORMAL",
    status = "PENDING",
    opts = {}
) {
    // 1) Xác định categoryCode + itemType
    let code =
        opts.forcedCategoryCode ??
        (tax?.categoryOptions || []).find((o) => o.value === values.category)?.code ??
        ""; // EV_CAR | E_MOTORBIKE | E_BIKE | BATTERY

    let itemType =
        opts.forcedItemType ??
        (code === "BATTERY" ? "BATTERY" : "VEHICLE");

    // 2) Địa chỉ
    const { province, district, ward, address } = normalizeAddressForBE(values.address);

    // 3) Payload chung
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
        status,          // "PENDING"|...
    };

    // 4) Field riêng cho pin
    if (itemType === "BATTERY") {
        payload.voltageV = values.voltage ?? null;
        payload.batteryChemistry = values.chemistry || null;
        payload.massKg = values.weight_kg ?? null;
        payload.dimensionsMm = values.dimension || null;
    }

    // 5) Ép string cho BigDecimal nếu BE parse từ chuỗi
    ["price", "batteryCapacityKwh", "sohPercent", "voltageV", "massKg"].forEach((k) => {
        if (payload[k] != null) payload[k] = String(payload[k]);
    });
    
    return payload;
}
