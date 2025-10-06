export function useInfoCards() {
  const formatSeller = {
    name: (seller) => seller.name || "—",
    phone: (seller) => seller.phone || "—",
    email: (seller) => seller.email || "—",
  };

  return {
    formatSeller,
  };
}
