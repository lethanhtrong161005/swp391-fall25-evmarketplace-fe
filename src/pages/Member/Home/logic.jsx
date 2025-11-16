// src/pages/Member/Home/logic.jsx
import { useEffect, useState } from "react";
import {
  getLatestListings,
  getFeaturedListings,
  getTotalListingsCount,
  getAllListings,
} from "@/services/listingHomeService";

export function useHomeData() {
  const [latestListings, setLatestListings] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalFeatured, setTotalFeatured] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingLatest(true);
        const latestData = await getLatestListings(10);
        setLatestListings(latestData);
        setLoadingLatest(false);

        setLoadingFeatured(true);
        const featuredData = await getFeaturedListings(10);
        setFeaturedItems(featuredData);
        setLoadingFeatured(false);

        // Lấy tổng số sản phẩm
        const totalCount = await getTotalListingsCount();
        setTotalProducts(totalCount);

        // Lấy tổng số tin nổi bật (chỉ đếm ACTIVE + BOOSTED)
        try {
          // Lấy một số lượng lớn để đếm chính xác số tin nổi bật có status ACTIVE
          const countResponse = await getAllListings({
            page: 0,
            size: 1000, // Lấy nhiều để đếm chính xác
            isBoosted: true,
          });
          
          if (countResponse?.success && countResponse?.data?.items) {
            // Đếm số lượng items có status ACTIVE
            const activeBoostedCount = countResponse.data.items.filter(
              (item) => item.status === "ACTIVE"
            ).length;
            setTotalFeatured(activeBoostedCount);
          } else {
            // Fallback: đếm từ featuredData (đã được filter ACTIVE)
            setTotalFeatured(featuredData.length);
          }
        } catch (error) {
          // Nếu không lấy được, dùng số lượng featured items hiện có (đã filter ACTIVE)
          setTotalFeatured(featuredData.length);
        }
      } catch (error) {
        // swallow; UI will show empties
        setLoadingLatest(false);
        setLoadingFeatured(false);
      }
    };
    fetchData();
  }, []);

  return {
    latestListings,
    featuredItems,
    loadingLatest,
    loadingFeatured,
    totalProducts,
    totalFeatured,
  };
}
