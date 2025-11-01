import React, { useEffect, useState } from "react";
import { getBatteryListings } from "@/services/listingHomeService";
import BatteryList from "./BatteryList";
const Battery = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const result = await getBatteryListings({
        page: 0,
        size: 20,
        sort: "createdAt",
        dir: "desc",
      });
      setListings(result?.items || []);
    };
    fetch();
  }, []);
  return (
    <div style={{ minHeight: "100vh" }}>
      <main
        style={{ padding: "40px 40px", width: "maxWidth", margin: "0 auto" }}
      >
        <BatteryList listings={listings} />
      </main>
    </div>
  );
};

export default Battery;
