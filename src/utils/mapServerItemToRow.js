export function mapServerItemToRow(it = {}) {
    const titleFallback = [it.brand, it.model, it.year].filter(Boolean).join(" ");
    const category = [it.brand, it.model, it.year].filter(Boolean).join(" ");
    const time = it.createdAt ? new Date(it.createdAt).toLocaleString("vi-VN") : "—";

    return {
        id: it.id,
        title: it.title || titleFallback || "(Không tiêu đề)",
        category: category || "—",
        location: it.province || "—",
        price: Number(it.price) || 0,
        updatedAt: time,                // dùng createdAt
        status: String(it.status || "").toUpperCase(),
        _localDraft: false,
    };
}