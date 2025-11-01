import React, { useState, useEffect } from "react";
import { Popover, List, Avatar, Button, Typography, Spin, Empty } from "antd";
import { HeartOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getFavorites, removeFavorite } from "@services/favoriteService";
import { toVND } from "@pages/Member/ProductDetail/utils/productFormatters";
import { useFavoritesContext } from "@contexts/FavoritesContext";
import "./FavoritesDropdown.styles.scss";

const { Text, Title } = Typography;

const FavoritesDropdown = () => {
  const navigate = useNavigate();
  const { refreshTrigger } = useFavoritesContext();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingIds, setRemovingIds] = useState(new Set());

  // Load favorites khi popover mở
  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await getFavorites(0, 5); // Chỉ lấy 5 item đầu tiên
      setFavorites(response.data?.items || []);
    } catch {
      setFavorites([]); // Set empty array nếu có lỗi
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (listingId, e) => {
    e.stopPropagation(); // Ngăn popover đóng
    setRemovingIds((prev) => new Set([...prev, listingId]));

    try {
      await removeFavorite(listingId);
      setFavorites((prev) =>
        prev.filter((item) => item.listingId !== listingId)
      );
    } catch {
      // Error handling - có thể thêm notification sau
    } finally {
      setRemovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(listingId);
        return newSet;
      });
    }
  };

  // Lắng nghe refresh trigger từ FavoriteButton
  useEffect(() => {
    if (refreshTrigger > 0) {
      loadFavorites();
    }
  }, [refreshTrigger]);

  const handleViewProduct = (listingId) => {
    navigate(`/detail/${listingId}`);
  };

  const handleViewAll = () => {
    navigate("/my-favorites");
  };

  const renderFavoriteItem = (item) => {
    const isRemoving = removingIds.has(item.listingId);

    return (
      <List.Item
        key={item.listingId}
        className="favorites-dropdown__item"
        onClick={() => handleViewProduct(item.listingId)}
      >
        <List.Item.Meta
          avatar={
            <Avatar
              shape="square"
              size={60}
              src={
                item.thumbnailUrl ||
                item.imageUrl ||
                item.image ||
                item.thumbnail ||
                item.mainImage ||
                item.listingImage ||
                item.photo ||
                item.picture ||
                item.avatar
              }
              className="favorites-dropdown__image"
            >
              {!item.thumbnailUrl &&
                !item.imageUrl &&
                !item.image &&
                !item.thumbnail &&
                !item.mainImage &&
                !item.listingImage &&
                !item.photo &&
                !item.picture &&
                !item.avatar && (
                  <div className="favorites-dropdown__placeholder">
                    <EyeOutlined />
                  </div>
                )}
            </Avatar>
          }
          title={
            <div className="favorites-dropdown__item-header">
              <Text strong className="favorites-dropdown__title" ellipsis>
                {item.title}
              </Text>
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                loading={isRemoving}
                onClick={(e) => handleRemoveFavorite(item.listingId, e)}
                className="favorites-dropdown__remove-btn"
              />
            </div>
          }
          description={
            <div className="favorites-dropdown__item-content">
              <div className="favorites-dropdown__price">
                <Text strong className="favorites-dropdown__price-text">
                  {toVND(item.price)}
                </Text>
              </div>
              {item.location && (
                <div className="favorites-dropdown__location">
                  <Text
                    type="secondary"
                    className="favorites-dropdown__location-text"
                  >
                    {item.location}
                  </Text>
                </div>
              )}
            </div>
          }
        />
      </List.Item>
    );
  };

  const content = (
    <div className="favorites-dropdown">
      <div className="favorites-dropdown__header">
        <Title level={5} className="favorites-dropdown__title">
          Tin đăng đã lưu
        </Title>
        <Button
          type="link"
          size="small"
          onClick={handleViewAll}
          className="favorites-dropdown__view-all"
        >
          Xem tất cả
        </Button>
      </div>

      <div className="favorites-dropdown__content">
        {loading ? (
          <div className="favorites-dropdown__loading">
            <Spin size="small" />
          </div>
        ) : favorites.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có tin nào được lưu"
            className="favorites-dropdown__empty"
          />
        ) : (
          <List
            dataSource={favorites}
            renderItem={renderFavoriteItem}
            className="favorites-dropdown__list"
            size="small"
          />
        )}
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      title={null}
      trigger="click"
      placement="bottomRight"
      onOpenChange={(open) => {
        if (open) {
          loadFavorites();
        }
      }}
      overlayClassName="favorites-dropdown-overlay"
    >
      <Button
        type="text"
        icon={<HeartOutlined style={{ fontSize: "18px" }} />}
        className="favorites-dropdown__trigger"
        title="Tin đăng đã lưu"
        style={{
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </Popover>
  );
};

export default FavoritesDropdown;
