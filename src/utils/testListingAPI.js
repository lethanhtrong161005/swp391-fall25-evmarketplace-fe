// Test file để kiểm tra API integration
import {
  getAllListings,
  getLatestListings,
  getFeaturedListings,
  searchListings,
} from "@/services/listingHomeService";

// Test function để kiểm tra API
export const testListingAPI = async () => {
  console.log("🧪 Testing Listing API Integration...");

  try {
    // Test 1: Get all listings
    console.log("📡 Testing getAllListings...");
    const allListings = await getAllListings({ page: 0, size: 5 });
    console.log("✅ getAllListings result:", allListings);

    // Test 2: Get latest listings
    console.log("📡 Testing getLatestListings...");
    const latestListings = await getLatestListings(3);
    console.log("✅ getLatestListings result:", latestListings);

    // Test 3: Get featured listings
    console.log("📡 Testing getFeaturedListings...");
    const featuredListings = await getFeaturedListings(3);
    console.log("✅ getFeaturedListings result:", featuredListings);

    // Test 4: Search listings
    console.log("📡 Testing searchListings...");
    const searchResults = await searchListings({ key: "BYD", size: 3 });
    console.log("✅ searchListings result:", searchResults);

    console.log("🎉 All API tests completed successfully!");
    return {
      success: true,
      allListings,
      latestListings,
      featuredListings,
      searchResults,
    };
  } catch (error) {
    console.error("❌ API test failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Export để có thể gọi từ console
window.testListingAPI = testListingAPI;
