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
  return res.data; 
}

/**
 * (Tuỳ chọn) Upload media sau khi có listingId
 * files: mảng File từ Upload (originFileObj)
 */
export const uploadListingMedia = (listingId, files = []) => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  // override header sang multipart/form-data
  return post(`/listings/${listingId}/media`, form, {}, {
    "Content-Type": "multipart/form-data",
  });
};
