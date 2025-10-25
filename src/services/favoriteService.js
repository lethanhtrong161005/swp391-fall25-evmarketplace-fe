import api from "@utils/apiCaller";
import cookieUtils from "@utils/cookieUtils";

/**
 * Thêm sản phẩm vào danh sách yêu thích
 * @param {number} listingId - ID của sản phẩm
 * @returns {Promise} Response từ API
 */
export const addFavorite = async (listingId) => {
  // Kiểm tra token trước khi gọi API
  const token = cookieUtils.getToken();
  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    const res = await api.post(`/api/favorite/${listingId}`, {});
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || `Add favorite failed`
    );
  }
};

/**
 * Xóa sản phẩm khỏi danh sách yêu thích
 * @param {number} listingId - ID của sản phẩm
 * @returns {Promise} Response từ API
 */
export const removeFavorite = async (listingId) => {
  try {
    const res = await api.delete(`/api/favorite/${listingId}`);
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || `Remove favorite failed`
    );
  }
};

/**
 * Lấy danh sách sản phẩm yêu thích
 * @param {number} page - Trang hiện tại (mặc định 0)
 * @param {number} size - Số lượng item mỗi trang (mặc định 10)
 * @returns {Promise} Response từ API
 */
export const getFavorites = async (page = 0, size = 10) => {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("size", size);

  try {
    const res = await api.get(`/api/favorite?${params.toString()}`);
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || `Get favorites failed`
    );
  }
};

/**
 * Kiểm tra xem một listing có trong danh sách yêu thích không
 * @param {number} listingId - ID của sản phẩm
 * @returns {Promise<boolean>} true nếu đã lưu, false nếu chưa
 */
export const checkIsFavorite = async (listingId) => {
  try {
    let page = 0;
    const size = 100;

    while (true) {
      const response = await getFavorites(page, size);
      const favorites = response.data?.items || [];

      // Kiểm tra xem listingId có trong trang này không
      const found = favorites.some((fav) => {
        // Convert cả hai về number để so sánh
        const favId = Number(fav.listingId);
        const targetId = Number(listingId);
        return favId === targetId;
      });
      if (found) {
        return true;
      }

      // Nếu không còn trang tiếp theo, dừng lại
      if (!response.data?.hasNext) {
        break;
      }

      page++;

      // Giới hạn để tránh vòng lặp vô hạn
      if (page > 10) {
        break;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
};
