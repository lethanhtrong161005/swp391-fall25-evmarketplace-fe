
export function mapDraftToRow(d) {
    const fv = d?.formValues || {};
    const addr = fv.address || {};
    const priceNum = fv.price ? Number(fv.price) : 0;

    return {
        id: `draft:${d.id}`,             // rowKey duy nhất (phân biệt với id server)
        _draftId: d.id,                  // dùng cho các handler (xoá/mở)
        _localDraft: true,               // cờ giúp UI phân biệt

        title: fv.title || "(Nháp chưa có tiêu đề)",
        category: fv.categoryName || fv.category || "—",
        location: [addr.province?.label, addr.district?.label, addr.ward?.label]
            .filter(Boolean).join(", ") || "—",
        price: priceNum,
        updatedAt: new Date(d.savedAt || Date.now()).toLocaleString("vi-VN"),
        status: "DRAFT",
    };
}