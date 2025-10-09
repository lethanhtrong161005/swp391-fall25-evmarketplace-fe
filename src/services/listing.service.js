import api from "@utils/apiCaller";

export async function createListing(payload, images = [], videos = []) {
  const fd = new FormData();
  const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
  fd.append("payload", blob);

  (images || []).forEach(f => fd.append("images", f?.originFileObj || f));
  (videos || []).forEach(f => fd.append("videos", f?.originFileObj || f));

  const res = await api.post("/api/listing/post", fd, {
    validateStatus: () => true,
  });

  const ok = res?.status >= 200 && res?.status < 300 && res?.data?.success !== false;
  if (!ok) {
    throw new Error(res?.data?.message || `Upload failed (${res?.status})`);
  }
  console.log(res.data);
  return res.data;
}

export async function fetchMyListings({ page = 0, size = 10, status, q } = {}) {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('size', size);
  if (status && status !== 'DRAFT') params.set('status', status); // DRAFT là local only
  if (q) params.set('q', q);

  const res = await api.get(`/api/listing/mine?${params.toString()}`, {
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

export async function fetchMyListingCounts() {
  const res = await api.get('/api/listing/mine/counts', {
    validateStatus: () => true,
    withCredentials: true,
  });
  const ok = res?.status >= 200 && res?.status < 300 && res?.data?.success !== false;
  if (!ok) throw new Error(res?.data?.message || `Fetch counts failed (${res?.status})`);
  return res.data?.data || {};
}


export const uploadListingMedia = (listingId, files = []) => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  // override header sang multipart/form-data
  return api.post(`/listings/${listingId}/media`, form, {}, {
    "Content-Type": "multipart/form-data",
  });
};

export const getFeeListing = async () =>{
  const res = await api.get("/api/config/listing/fee");
  if(res.status == 200){
    return res.data;
  }
}


