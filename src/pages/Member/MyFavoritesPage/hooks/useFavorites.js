import { useState, useEffect } from "react";
import { message } from "antd";
import { getFavorites, removeFavorite } from "@services/favoriteService";

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [removingIds, setRemovingIds] = useState(new Set());

  // Load favorites khi component mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async (pageNum = 0, append = false) => {
    try {
      if (pageNum === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await getFavorites(pageNum, 10);
      const { items, hasNext: nextPage } = response.data;

      if (append) {
        setFavorites(prev => [...prev, ...items]);
      } else {
        setFavorites(items);
      }
      
      setPage(pageNum);
      setHasNext(nextPage);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải danh sách yêu thích");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    loadFavorites(page + 1, true);
  };

  const handleRemoveFavorite = async (listingId) => {
    setRemovingIds(prev => new Set([...prev, listingId]));
    
    try {
      await removeFavorite(listingId);
      
      // Xóa khỏi danh sách local
      setFavorites(prev => prev.filter(item => item.listingId !== listingId));
      message.success("Đã xóa khỏi danh sách yêu thích");
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi xóa yêu thích");
    } finally {
      setRemovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(listingId);
        return newSet;
      });
    }
  };

  const isRemoving = (listingId) => {
    return removingIds.has(listingId);
  };

  return {
    favorites,
    loading,
    loadingMore,
    hasNext,
    loadFavorites,
    handleLoadMore,
    handleRemoveFavorite,
    isRemoving,
  };
}
