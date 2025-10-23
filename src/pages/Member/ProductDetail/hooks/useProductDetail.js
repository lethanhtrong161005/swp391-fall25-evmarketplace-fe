// src/pages/Member/ProductDetail/hooks/useProductDetail.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getListingDetail } from "@/services/listingHomeService";

export function useProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getListingDetail(id);

        if (alive) {
          setProduct(data);
        }
      } catch (err) {
        if (alive) {
          setError(err);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      alive = false;
    };
  }, [id]);

  const isBattery = product?.category === "BATTERY";

  return {
    product,
    loading,
    error,
    isBattery,
    hasProduct: !!product,
    isNotFound: !loading && !product && !error,
  };
}
