import React, { useEffect, useState } from "react";
import VehicleList from "./VehicleList";
import { getAllListings } from "@/services/listingHomeService";
const Vehicle = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getAllListings({
        page: 0,
        size: 20,
        sort: "createdAt",
        dir: "desc",
      });
      const items = res?.data?.items || [];
      setListings(items);
    };
    fetch();
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <main
        style={{ padding: "40px 40px", width: "maxWidth", margin: "0 auto" }}
      >
        <VehicleList listings={listings} />
      </main>
    </div>
  );
};

export default Vehicle;
