import { useMemo } from "react";

export function useStatusHistory(items) {
  const normalizedItems = useMemo(() => {
    return (items || []).map((h) => ({
      key: h.id || `${h.listingId}-${h.at}`,
      at: h.at,
      from: h.from_status ?? h.from ?? "",
      to: h.to_status ?? h.to ?? "",
      by: h.by_name ?? h.by ?? "—",
      note: h.note,
    }));
  }, [items]);

  return {
    normalizedItems,
  };
}
