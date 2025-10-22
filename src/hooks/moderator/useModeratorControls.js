import { useState, useCallback } from "react";

export function useModeratorControls() {
  // Quản lý tìm kiếm và làm mới dữ liệu
  const [searchTitle, setSearchTitle] = useState("");

  // Tìm kiếm tin đăng
  const handleSearch = useCallback((title, fetchQueue, fetchMyLocks) => {
    setSearchTitle(title);
    fetchQueue(0, title);
    fetchMyLocks(title);
  }, []);

  // Làm mới dữ liệu
  const handleRefresh = useCallback(
    (fetchQueue, fetchMyLocks, queueData) => {
      fetchQueue(queueData.page, searchTitle);
      fetchMyLocks(searchTitle);
    },
    [searchTitle]
  );

  return {
    searchTitle,
    handleSearch,
    handleRefresh,
    setSearchTitle,
  };
}
