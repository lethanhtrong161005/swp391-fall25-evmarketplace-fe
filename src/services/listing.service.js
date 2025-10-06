import { buildCreateListingFormData } from "@/pages/Member/ListingCreate/_shared/normalizeListingPayload";
import api, { post } from "@utils/apiCaller";

/**
 * Tạo tin đăng.
 * BE gợi ý endpoint: POST /listings
 * dto: { brand, model, year, price, description, province, city, ... }
 */
export async function createListing(values, tax, postType) {
  const fd = buildCreateListingFormData(values, tax, postType);

  // 👉 KHÔNG tự set Content-Type, để browser tự thêm boundary
  const res = api.post("/api/listing/post", fd);
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
  return post(
    `/listings/${listingId}/media`,
    form,
    {},
    {
      "Content-Type": "multipart/form-data",
    }
  );
};
