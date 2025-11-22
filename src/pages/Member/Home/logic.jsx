import { useEffect, useState } from "react";
import {
  getLatestListings,
  getFeaturedListings,
  getTotalListingsCount,
  getAllListings,
} from "@/services/listingHomeService";

// Hook quản lý dữ liệu trang chủ: tin đăng mới nhất, tin nổi bật và tổng số lượng
export function useHomeData() {
  const [latestListings, setLatestListings] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalFeatured, setTotalFeatured] = useState(0);

  useEffect(() => {
    // Tải dữ liệu tin đăng mới nhất, tin nổi bật và tổng số lượng
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

        const totalCount = await getTotalListingsCount();
        setTotalProducts(totalCount);

        try {
          const countResponse = await getAllListings({
            page: 0,
            size: 1,
            isBoosted: true,
          });

          if (countResponse?.success && countResponse?.data) {
            setTotalFeatured(countResponse.data.totalElements || 0);
          } else {
            setTotalFeatured(featuredData.length);
          }
        } catch {
          setTotalFeatured(featuredData.length);
        }
      } catch {
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
