export function useSummaryCards() {
  const items = [
    { title: "Chờ duyệt", key: "PENDING" },
    { title: "Đã đăng", key: "ACTIVE" },
    { title: "Từ chối", key: "REJECTED" },
    { title: "Đã bán", key: "SOLD" },
    { title: "Lưu trữ", key: "ARCHIVED" },
  ];

  return { items };
}
