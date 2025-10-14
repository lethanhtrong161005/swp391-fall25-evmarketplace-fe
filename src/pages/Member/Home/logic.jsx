// src/pages/Member/Home/logic.jsx
import { useEffect, useState } from "react";
import {
  getLatestListings,
  getFeaturedListings,
  getTotalListingsCount,
} from "@/services/listingHomeService";

export function useHomeData() {
  const [latestListings, setLatestListings] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

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

        const totalCount = await getTotalListingsCount();
        setTotalProducts(totalCount);
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
  };
}
