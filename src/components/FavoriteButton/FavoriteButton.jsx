import React from "react";
import { Button, message } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useAuth } from "@hooks/useAuth";
import {
  addFavorite,
  removeFavorite,
  checkIsFavorite,
} from "@services/favoriteService";
import { useFavoritesContext } from "@contexts/FavoritesContext";

const FavoriteButton = ({
  listingId,
  onToggle,
  onShowLoginModal,
  size = "middle",
  showText = true,
  className = "",
}) => {
  const { isLoggedIn } = useAuth();
  const { triggerRefresh } = useFavoritesContext();
  const [isFavorited, setIsFavorited] = React.useState(false);
  const [loading, setLoading] = React.useState(true); // Bắt đầu với loading = true
  const [messageApi, contextHolder] = message.useMessage();

  // Kiểm tra trạng thái favorite khi component mount hoặc khi dependencies thay đổi
  React.useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!listingId) {
        setIsFavorited(false);
        setLoading(false);
        return;
      }

      if (!isLoggedIn) {
        setIsFavorited(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Sử dụng function mới để kiểm tra tất cả các trang
        const isInFavorites = await checkIsFavorite(listingId);
        setIsFavorited(isInFavorites);
      } catch (error) {
        console.error("Error checking favorite status:", error);
        setIsFavorited(false);
      } finally {
        setLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [isLoggedIn, listingId]);

  const handleToggle = async () => {
    if (!listingId) {
      messageApi.error("Không tìm thấy thông tin sản phẩm");
      return;
    }

    // Kiểm tra trạng thái đăng nhập
    if (!isLoggedIn) {
      messageApi.warning("Vui lòng đăng nhập để lưu tin");
      onShowLoginModal?.();
      return;
    }

    const previousState = isFavorited;

    // Optimistic UI: Cập nhật trạng thái ngay lập tức
    setIsFavorited(!isFavorited);
    setLoading(true);

    try {
      if (previousState) {
        // Nếu đang là favorite, gọi API xóa
        await removeFavorite(listingId);
        messageApi.success("Đã xóa khỏi danh sách theo dõi");
      } else {
        // Nếu chưa là favorite, gọi API thêm
        await addFavorite(listingId);
        messageApi.success("Đã thêm vào danh sách theo dõi");
      }

      // Gọi callback nếu có
      onToggle?.(!isFavorited);

      // Trigger refresh cho FavoritesDropdown
      triggerRefresh();
    } catch (error) {
      // Nếu API lỗi, hoàn tác lại trạng thái
      setIsFavorited(previousState);
      messageApi.error(error.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Button
        className={`favorite-button ${className}`}
        icon={isFavorited ? <HeartFilled /> : <HeartOutlined />}
        onClick={handleToggle}
        loading={loading}
        type={isFavorited ? "primary" : "default"}
        size={size}
      >
        {showText && (isFavorited ? "Đã lưu" : "Lưu")}
      </Button>
    </>
  );
};

export default FavoriteButton;
