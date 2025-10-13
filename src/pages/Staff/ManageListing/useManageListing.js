import React, { useEffect, useState, useCallback } from "react";
import { message } from "antd";
import {
  getStaffListings,
  searchStaffListings,
  approveStaffListing,
  rejectStaffListing,
} from "@services/staff/listing.staff.service";

const PAGE_SIZE = 10;

export function useManageListing() {
  const [msg, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({
    page: 0,
    size: PAGE_SIZE,
    sort: "createdAt",
    dir: "desc",
  });
  const [data, setData] = useState({
    items: [],
    pagination: { totalRecords: 0, currentPage: 0, pageSize: PAGE_SIZE },
    stats: {},
  });

  // Store the actual total once we reach the last page
  const [actualTotal, setActualTotal] = useState(null);

  const handleSearch = (values) => {
    setQuery((q) => ({ ...q, page: 0, ...values }));
    setActualTotal(null); // Reset actual total when searching
  };
  const handleReset = () => {
    setQuery({ page: 0, size: PAGE_SIZE });
    setActualTotal(null); // Reset actual total when resetting
  };
  const setPage = (page) => setQuery((q) => ({ ...q, page }));

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      let res;

      // Check if we have any search parameters (keyword, category, or date filters)
      const hasSearchParams =
        query.q || query.category || query.dateFrom || query.dateTo;
      const hasKeywordSearch = query.q && query.q.trim();

      if (hasKeywordSearch) {
        // Use search API when there's a keyword
        const searchParams = {
          ...query,
          keyword: query.q,
        };

        // Remove undefined values
        Object.keys(searchParams).forEach((key) => {
          if (searchParams[key] === undefined) {
            delete searchParams[key];
          }
        });

        try {
          res = await searchStaffListings(searchParams);
        } catch (searchError) {
          console.warn(
            "Search API failed, falling back to listing API:",
            searchError
          );
          // Fallback to listing API with basic filters
          const listingParams = {
            page: query.page,
            size: query.size,
            sort: query.sort,
            dir: query.dir,
            category: query.category,
            dateFrom: query.dateFrom,
            dateTo: query.dateTo,
          };

          // Remove undefined values
          Object.keys(listingParams).forEach((key) => {
            if (listingParams[key] === undefined) {
              delete listingParams[key];
            }
          });

          res = await getStaffListings(listingParams);
        }
      } else if (hasSearchParams) {
        // Use listing API for non-keyword filters (category, dates)
        const listingParams = {
          page: query.page,
          size: query.size,
          sort: query.sort,
          dir: query.dir,
          category: query.category,
          dateFrom: query.dateFrom,
          dateTo: query.dateTo,
        };

        // Remove undefined values
        Object.keys(listingParams).forEach((key) => {
          if (listingParams[key] === undefined) {
            delete listingParams[key];
          }
        });

        res = await getStaffListings(listingParams);
      } else {
        // Use regular listing API for basic listing without filters
        const listingParams = {
          page: query.page,
          size: query.size,
          sort: query.sort,
          dir: query.dir,
        };

        // Remove undefined values
        Object.keys(listingParams).forEach((key) => {
          if (listingParams[key] === undefined) {
            delete listingParams[key];
          }
        });

        res = await getStaffListings(listingParams);
      }

      // Transform API response to match expected format
      if (res && res.data) {
        // Try different possible total field names
        let total =
          res.data.totalElements ||
          res.data.total ||
          res.data.totalRecords ||
          res.data.totalCount ||
          res.data.count ||
          0;

        // If no total found, try to calculate from pagination info
        if (total === 0) {
          const currentPage = res.data.page || 0;
          const pageSize = res.data.size || 10;
          const currentItems = res.data.items?.length || 0;
          const hasNext = res.data.hasNext;

          if (hasNext === false) {
            // If no more pages, calculate actual total and store it
            total = currentPage * pageSize + currentItems;
            setActualTotal(total); // Store the actual total
          } else if (actualTotal !== null) {
            // Use stored actual total if we have it
            total = actualTotal;
          } else {
            // If hasNext is true and we don't have actual total yet, show estimated
            total = (currentPage + 1) * pageSize + 1;
          }
        }

        const mapCategoryIdToName = (id) => {
          switch (id) {
            case 1:
              return "EV_CAR";
            case 2:
              return "E_MOTORBIKE";
            case 3:
              return "E_BIKE";
            case 4:
              return "BATTERY";
            default:
              return undefined;
          }
        };

        const items = (res.data.items || []).map((it) => ({
          ...it,
          category: it.category || mapCategoryIdToName(it.categoryId),
          category_id:
            typeof it.categoryId === "number" ? it.categoryId : undefined,
        }));

        const transformedData = {
          items,
          pagination: {
            totalRecords: total,
            currentPage: res.data.page || 0,
            pageSize: res.data.size || PAGE_SIZE,
          },
          stats: res.data.stats || {},
          hasNext: res.data.hasNext || false,
        };

        setData(transformedData);
      } else {
        console.warn("API response format unexpected:", res);
        setData({
          items: [],
          pagination: { totalRecords: 0, currentPage: 0, pageSize: PAGE_SIZE },
          stats: {},
        });
        msg.error("Dữ liệu không đúng định dạng");
      }
    } catch (e) {
      console.error("API call failed:", e);
      setData({
        items: [],
        pagination: { totalRecords: 0, currentPage: 0, pageSize: PAGE_SIZE },
        stats: {},
      });
      msg.error("Không tải được dữ liệu từ server");
    } finally {
      setLoading(false);
    }
  }, [msg, query, actualTotal]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onApprove = async (row) => {
    try {
      await approveStaffListing(row.id);
      msg.success("Đã duyệt");
      refresh();
    } catch (e) {
      console.error(e);
      msg.error("Duyệt thất bại");
    }
  };

  const onReject = async (row) => {
    try {
      await rejectStaffListing(row.id, "Từ chối bởi staff");
      msg.success("Đã từ chối");
      refresh();
    } catch (e) {
      console.error(e);
      msg.error("Từ chối thất bại");
    }
  };

  const onActivate = async (row) => {
    try {
      // TODO: implement activate functionality
      msg.success(`Đã kích hoạt listing ID: ${row.id}`);
      refresh();
    } catch (e) {
      console.error(e);
      msg.error("Kích hoạt thất bại");
    }
  };

  const onDeactivate = async (row) => {
    try {
      // TODO: implement deactivate functionality
      msg.success(`Đã ẩn listing ID: ${row.id}`);
      refresh();
    } catch (e) {
      console.error(e);
      msg.error("Ẩn listing thất bại");
    }
  };

  const onDelete = async (row) => {
    try {
      // TODO: implement delete functionality with confirmation
      msg.success(`Đã xóa listing ID: ${row.id}`);
      refresh();
    } catch (e) {
      console.error(e);
      msg.error("Xóa thất bại");
    }
  };

  const onRestore = async (row) => {
    try {
      // TODO: implement restore functionality
      msg.success(`Đã khôi phục listing ID: ${row.id}`);
      refresh();
    } catch (e) {
      console.error(e);
      msg.error("Khôi phục thất bại");
    }
  };

  const onRenew = async (row) => {
    try {
      // TODO: implement renew functionality
      msg.success(`Đã gia hạn listing ID: ${row.id}`);
      refresh();
    } catch (e) {
      console.error(e);
      msg.error("Gia hạn thất bại");
    }
  };

  const onEdit = async (row) => {
    try {
      // TODO: implement edit functionality
      // await editListing(row.id)
      msg.info(`Chỉnh sửa listing ID: ${row.id}`);
      // Tạm thời chỉ log, sau này sẽ điều hướng đến trang edit
    } catch (e) {
      console.error(e);
      msg.error("Chỉnh sửa thất bại");
    }
  };

  return {
    loading,
    data,
    query,
    handleSearch,
    handleReset,
    refresh,
    setPage,
    onApprove,
    onReject,
    onEdit,
    onActivate,
    onDeactivate,
    onDelete,
    onRestore,
    onRenew,
    contextHolder,
  };
}
