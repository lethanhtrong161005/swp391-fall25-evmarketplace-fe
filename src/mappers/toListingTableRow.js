import {fmtVN} from "@utils/formatDate.js";

function pickUpdatedDisplay(status, { createdAt, updatedAt, expiresAt, hiddenAt, deletedAt }) {
    const s = String(status || "").toUpperCase();
    if (s === "EXPIRED") return fmtVN(expiresAt || updatedAt || createdAt);
    if (s === "HIDDEN") return fmtVN(hiddenAt || updatedAt || createdAt);
    if (s === "SOFT_DELETED") return fmtVN(deletedAt || updatedAt || createdAt);
    return fmtVN(updatedAt || createdAt);
}

export function toListingTableRow(it = {}) {
    const createdAt = it.createdAt ? new Date(it.createdAt) : null;
    const updatedAt = it.updatedAt ? new Date(it.updatedAt) : null;
    const expiresAt = it.expiresAt ? new Date(it.expiresAt) : null;
    const promotedUntil = it.promotedUntil ? new Date(it.promotedUntil) : null;
    const hiddenAt = it.hiddenAt ? new Date(it.hiddenAt) : null;
    const deletedAt = it.deletedAt ? new Date(it.deletedAt) : null;
    const purgeAt = it.purgeAt ? new Date(it.purgeAt) : null;

    const status = String(it.status || "").toUpperCase();

    const titleFallback = [it.brand, it.model, it.year].filter(Boolean).join(" ");
    const categoryText = [it.brand, it.model, it.year].filter(Boolean).join(" ");

    return {
        // cơ bản
        id: it.id,
        title: it.title || titleFallback || "(Không tiêu đề)",
        category: categoryText || "—",
        location: it.province || "—",
        price: Number(it.price) || 0,
        status,
        _localDraft: false,

        // raw ISO (phục vụ sorter/filter)
        createdAt: createdAt ? createdAt.toISOString() : null,
        updatedAt: updatedAt ? updatedAt.toISOString() : null,
        expiresAt: expiresAt ? expiresAt.toISOString() : null,
        promotedUntil: promotedUntil ? promotedUntil.toISOString() : null,
        hiddenAt: hiddenAt ? hiddenAt.toISOString() : null,
        deletedAt: deletedAt ? deletedAt.toISOString() : null,
        purgeAt: purgeAt ? purgeAt.toISOString() : null,

        // chuỗi hiển thị
        createdAtDisplay: fmtVN(createdAt),
        updatedAtDisplay: pickUpdatedDisplay(status, { createdAt, updatedAt, expiresAt, hiddenAt, deletedAt }),
        expiresAtDisplay: fmtVN(expiresAt),
        promotedUntilDisplay: fmtVN(promotedUntil),
        purgeAtDisplay: fmtVN(purgeAt),
    };
}

//Map tin nháp từ local
export function mapDraftToRow(d) {
    const fv = d?.formValues || {};
    const addr = fv.address || {};
    const priceNum = fv.price ? Number(fv.price) : 0;

    return {
        id: `draft:${d.id}`,
        _draftId: d.id,
        _localDraft: true,

        title: fv.title || "(Nháp chưa có tiêu đề)",
        category: fv.categoryName || fv.category || "—",
        location: [addr.province?.label, addr.district?.label, addr.ward?.label]
            .filter(Boolean).join(", ") || "—",
        price: priceNum,
        updatedAt: new Date(d.savedAt || Date.now()).toLocaleString("vi-VN"),
        status: "DRAFT",
    };
}
