export function useNotificationDrawer(data) {
  const processedData = data.map((notification) => ({
    ...notification,
    time: notification.time || new Date().toLocaleString("vi-VN"),
  }));

  return {
    processedData,
  };
}
