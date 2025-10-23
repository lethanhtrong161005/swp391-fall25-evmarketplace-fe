import { useEffect, useRef } from "react";
import { useModeratorData } from "./moderator/useModeratorData";
import { useModeratorModal } from "./moderator/useModeratorModal";
import { useModeratorActions } from "./moderator/useModeratorActions";
import { useModeratorAutoHealing } from "./moderator/useModeratorAutoHealing";
import { useModeratorControls } from "./moderator/useModeratorControls";

// Utility function for React Query integration (if implemented in the future)
// eslint-disable-next-line no-unused-vars
const createReleaseListingMutation = (queryClient) => ({
  mutationFn: async (listingId) => {
    const { releaseModeratorListing } = await import(
      "@services/moderator/listing.moderator.service"
    );
    return releaseModeratorListing(listingId);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["moderatorQueue"] });
    queryClient.invalidateQueries({ queryKey: ["myLocks"] });
  },
});

export function useModeratorApprovalLogic() {
  // Kết hợp các hooks con
  const data = useModeratorData();
  const modal = useModeratorModal();
  const actions = useModeratorActions();
  const controls = useModeratorControls();

  // Theo dõi việc tải dữ liệu
  const hasFetchedData = useRef(false);

  // Cơ chế tự động nhả khóa
  // eslint-disable-next-line no-unused-vars
  const autoHealing = useModeratorAutoHealing(
    data.queueData,
    data.fetchQueue,
    data.fetchMyLocks,
    controls.searchTitle,
    () =>
      controls.handleRefresh(data.fetchQueue, data.fetchMyLocks, data.queueData)
  );

  // Tải dữ liệu ban đầu
  useEffect(() => {
    if (hasFetchedData.current) {
      return;
    }

    hasFetchedData.current = true;
    data.fetchQueue();
    data.fetchMyLocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Các hàm xử lý sự kiện
  const handleClaim = (listingId) => {
    modal.handleClaim(
      listingId,
      data.transformListingData,
      data.fetchQueue,
      data.fetchMyLocks,
      data.queueData,
      controls.searchTitle
    );
  };

  const handleApprove = () => {
    actions.handleApprove(
      modal.reviewingItem,
      modal.handleCloseModal,
      data.fetchQueue,
      data.fetchMyLocks,
      data.queueData,
      controls.searchTitle
    );
  };

  const handleConfirmReject = (reason) => {
    actions.handleConfirmReject(
      reason,
      modal.reviewingItem,
      modal.handleCloseModal,
      data.fetchQueue,
      data.fetchMyLocks,
      data.queueData,
      controls.searchTitle
    );
  };

  const handleRelease = () => {
    actions.handleRelease(
      modal.reviewingItem,
      modal.handleCloseModal,
      data.fetchQueue,
      data.fetchMyLocks,
      data.queueData,
      controls.searchTitle
    );
  };

  const handleExtend = () => {
    actions.handleExtend(
      modal.reviewingItem,
      modal.setReviewingItem,
      data.setMyLocks,
      data.setQueueData
    );
  };

  const handleSearch = (title) => {
    controls.handleSearch(title, data.fetchQueue, data.fetchMyLocks);
  };

  const handleRefresh = () => {
    controls.handleRefresh(data.fetchQueue, data.fetchMyLocks, data.queueData);
  };

  const handleAutoRelease = () => {
    modal.handleAutoRelease(
      data.fetchQueue,
      data.fetchMyLocks,
      data.queueData,
      controls.searchTitle
    );
  };

  return {
    // Dữ liệu
    queueData: data.queueData,
    myLocks: data.myLocks,
    loading: data.loading,

    // Modal
    isDetailLoading: modal.isDetailLoading,
    isModalVisible: modal.isModalVisible,
    reviewingItem: modal.reviewingItem,

    // Hành động
    isRejecting: actions.isRejecting,

    // Tìm kiếm
    searchTitle: controls.searchTitle,

    // Xử lý sự kiện
    handleClaim,
    handleCloseModal: modal.handleCloseModal,
    handleAutoRelease,
    handleEnterRejectMode: actions.handleEnterRejectMode,
    handleExitRejectMode: actions.handleExitRejectMode,
    handleConfirmReject,
    handleApprove,
    handleRelease,
    handleExtend,
    handleSearch,
    handleRefresh,

    // API
    fetchQueue: data.fetchQueue,
    fetchMyLocks: data.fetchMyLocks,
  };
}
