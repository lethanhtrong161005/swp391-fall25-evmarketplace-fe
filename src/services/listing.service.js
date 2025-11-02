import api, { put, remove as httpDelete } from "@utils/apiCaller";

export async function createListing(payload, images = [], videos = []) {
  const fd = new FormData();
  const blob = new Blob([JSON.stringify(payload)], {
    type: "application/json",
  });
  fd.append("payload", blob);

  (images || []).forEach((f) => fd.append("images", f?.originFileObj || f));
  (videos || []).forEach((f) => fd.append("videos", f?.originFileObj || f));

  const res = await api.post("/api/listing/post", fd, {
    validateStatus: () => true,
  });

  const ok =
    res?.status >= 200 && res?.status < 300 && res?.data?.success !== false;
  if (!ok) {
    throw new Error(res?.data?.message || `Upload failed (${res?.data?.message})`);
  }
  return res.data;
}

export async function fetchMyListings({ page = 0, size = 10, status, q } = {}) {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("size", size);
  if (status && status !== "DRAFT") params.set("status", status); // DRAFT là local only
  if (q) params.set("q", q);

  const res = await api.get(`/api/listing/mine?${params.toString()}`, {
    validateStatus: () => true,
    withCredentials: true,
  });

  const ok =
    res?.status >= 200 && res?.status < 300 && res?.data?.success !== false;
  if (!ok)
    throw new Error(res?.data?.message || `Fetch failed (${res?.status})`);

  const d = res.data?.data || {};
  return {
    page: d.page ?? 0,
    size: d.size ?? size,
    total: d.totalElements ?? 0,
    totalPages: d.totalPages ?? 0,
    hasNext: !!d.hasNext,
    hasPrevious: !!d.hasPrevious,
    items: Array.isArray(d.items) ? d.items : [],
  };
}

export async function fetchMyListingCounts() {
  const res = await api.get("/api/listing/mine/counts", {
    validateStatus: () => true,
    withCredentials: true,
  });
  const ok =
    res?.status >= 200 && res?.status < 300 && res?.data?.success !== false;
  if (!ok)
    throw new Error(
      res?.data?.message || `Fetch counts failed (${res?.status})`
    );
  return res.data?.data || {};
}

export const uploadListingMedia = (listingId, files = []) => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  return api.post(
    `/listings/${listingId}/media`,
    form,
    {},
    {
      "Content-Type": "multipart/form-data",
    }
  );
};

export const getFeeListing = async () => {
  const res = await api.get("/api/config/listing/fee");
  if (res.status == 200) {
    return res.data;
  }
};

//Lấy chi tiết bài đăng của người đăng
export const getListingDetailBySeller = async (id) => {
  const res = await api.get(`/api/listing/seller/${id}`, {
    validateStatus: () => true,
  });

  const ok =
    res?.status >= 200 && res?.status < 300 && res?.data?.success !== false;
  if (!ok) {
    throw new Error(
      res?.data?.message || `Fetch listing detail failed (${res?.status})`
    );
  }

  return res.data;
};

export async function updateListing(
  listingId,
  payload,
  images = [],
  videos = []
) {
  const fd = new FormData();

  fd.append("payload", JSON.stringify(payload));

  const isServerItem = (x) =>
    x && (x.origin === "server" || x?._raw?.id || x?.id);
  const getServerId = (x) => x?._raw?.id ?? x?.id ?? null;
  const asFile = (x) => x?.originFileObj || (x instanceof File ? x : null);

  const keepMediaIds = [];
  (images || []).forEach((it) => {
    if (isServerItem(it)) {
      const id = getServerId(it);
      if (id != null) keepMediaIds.push(id);
    } else {
      const f = asFile(it);
      if (f) fd.append("images", f);
    }
  });
  (videos || []).forEach((it) => {
    if (isServerItem(it)) {
      const id = getServerId(it);
      if (id != null) keepMediaIds.push(id);
    } else {
      const f = asFile(it);
      if (f) fd.append("videos", f);
    }
  });

  keepMediaIds.forEach((id) => fd.append("keepMediaIds", String(id)));

  const res = await put(
    `/api/listing/${listingId}`,
    fd,
    {},
    {
      /* headers auto */
    }
  );
  return res;
}

//Xoá bài đăng
export const deleteListing = async (listingId) => {
  const data = await httpDelete(`/api/listing/delete/${listingId}`);
  if (data?.success) return data;
  throw new Error(data?.message || "Delete failed");
};

export const changeStatusListing = async ({ id, status }) => {
  const res = await api.post(
    "/api/listing/status/change",
    { id, status },
    { validateStatus: () => true }
  );
  return res; // giữ nguyên axios response
};

// Khôi phục (HIDDEN/SOFT_DELETED → ACTIVE hoặc EXPIRED tuỳ prevDeadline)
export const restoreListing = async (id) => {
  const res = await api.post(
    `/api/listing/${id}/restore`,
    {}, // body rỗng (tham số thứ 2) để param validateStatus đi vào config (tham số thứ 3)
    { validateStatus: () => true }
  );
  return res; // trả axios response
};

export async function fetchConsignmentListings({
  page = 0,
  size = 10,
  sort,
  dir,
  filters = {},
} = {}) {
  const p = new URLSearchParams();
  p.set("page", String(Math.max(0, page)));
  p.set("size", String(Math.max(1, size)));
  if (sort) p.set("sort", sort);
  if (dir) p.set("dir", dir);

  const setIf = (k, v) => {
    if (v === undefined || v === null || v === "") return;
    p.set(k, String(v));
  };

  // Map BE ConsignmentListingFilter
  setIf("q", filters.q);
  setIf("itemType", filters.itemType);              // VEHICLE | BATTERY
  setIf("status", filters.status);
  setIf("visibility", filters.visibility);
  setIf("categoryId", filters.categoryId);
  setIf("brandId", filters.brandId);
  setIf("modelId", filters.modelId);

  setIf("priceMin", filters.priceMin);
  setIf("priceMax", filters.priceMax);
  setIf("createdAtFrom", filters.createdAtFrom);
  setIf("createdAtTo", filters.createdAtTo);
  setIf("yearMin", filters.yearMin);
  setIf("yearMax", filters.yearMax);
  setIf("mileageMax", filters.mileageMax);
  setIf("sohMin", filters.sohMin);

  setIf("batteryCapacityMinKwh", filters.batteryCapacityMinKwh);
  setIf("batteryCapacityMaxKwh", filters.batteryCapacityMaxKwh);
  setIf("voltageMinV", filters.voltageMinV);
  setIf("voltageMaxV", filters.voltageMaxV);
  setIf("massMaxKg", filters.massMaxKg);

  if (Array.isArray(filters.chemistries) && filters.chemistries.length) {
    p.set("chemistries", JSON.stringify(filters.chemistries));
  }

  const res = await api.get(`/api/listing/consignment?${p.toString()}`, {
    validateStatus: () => true,
    withCredentials: true,
  });

  const ok = res?.status >= 200 && res?.status < 300 && res?.data?.success !== false;
  if (!ok) throw new Error(res?.data?.message || `Fetch failed (${res?.status})`);

  const d = res.data?.data || {};
  return {
    page: d.page ?? 0,
    size: d.size ?? size,
    total: d.totalElements ?? 0,
    totalPages: d.totalPages ?? 0,
    hasNext: !!d.hasNext,
    hasPrevious: !!d.hasPrevious,
    items: Array.isArray(d.items) ? d.items : [],
  };
}




