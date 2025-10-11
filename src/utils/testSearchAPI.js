// Test search functionality
import { searchListings } from "@/services/listingHomeService";

// Test function để kiểm tra search API
export const testSearchAPI = async (searchTerm = "BYD") => {
  console.log("🔍 Testing Search API...");

  try {
    console.log(`📡 Searching for: "${searchTerm}"`);
    const searchResults = await searchListings({
      key: searchTerm,
      page: 0,
      size: 5,
    });

    console.log("✅ Search results:", searchResults);

    if (searchResults?.success && searchResults?.data?.items) {
      console.log(`📦 Found ${searchResults.data.items.length} results`);
      searchResults.data.items.forEach((item, index) => {
        console.log(
          `${index + 1}. ${item.title} - ${item.brand} ${item.model}`
        );
      });
    }

    return {
      success: true,
      searchResults,
      searchTerm,
    };
  } catch (error) {
    console.error("❌ Search test failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Export để có thể gọi từ console
window.testSearchAPI = testSearchAPI;

// Test với các từ khóa khác nhau
export const testMultipleSearches = async () => {
  const searchTerms = ["BYD", "Tesla", "VinFast", "pin", "xe điện"];

  console.log("🧪 Testing multiple search terms...");

  for (const term of searchTerms) {
    console.log(`\n--- Testing: "${term}" ---`);
    await testSearchAPI(term);
    // Delay để tránh spam API
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("🎉 All search tests completed!");
};

window.testMultipleSearches = testMultipleSearches;
