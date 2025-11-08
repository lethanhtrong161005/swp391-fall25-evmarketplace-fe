import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  theme,
  Form,
  DatePicker,
  Select,
  Space,
  Button,
  Tabs,
  Alert,
  Spin,
  Skeleton,
  Table,
  Tooltip,
  Flex,
} from "antd";
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons";
import { Area, Column, Pie } from "@ant-design/plots";
import FilterBar from "./components/FilterBar";
import TransactionsWidget from "./components/TransactionsWidget";
import RevenueWidget from "./components/RevenueWidget";
import MarketWidget from "./components/MarketWidget";
import dayjs from "dayjs";
import { get } from "@/utils/apiCaller";
import { getAllBranches } from "@/services/branchService";

// Toggle mock data to preview UI without backend
const USE_MOCK_DASHBOARD = false;

// Simple in-memory cache with TTL
const cacheStore = new Map();
const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes
function getCache(key) {
  const now = Date.now();
  const hit = cacheStore.get(key);
  if (!hit) return null;
  if (now - hit.time > (hit.ttl ?? DEFAULT_TTL_MS)) {
    cacheStore.delete(key);
    return null;
  }
  return hit.data;
}
function setCache(key, data, ttl = DEFAULT_TTL_MS) {
  cacheStore.set(key, { data, time: Date.now(), ttl });
}

function buildKey(endpoint, filters) {
  return `${endpoint}::${JSON.stringify(filters)}`;
}

function formatCurrency(value, currency = "VND") {
  if (!Number.isFinite(value)) return "0";
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    return new Intl.NumberFormat("vi-VN").format(value);
  }
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return "0%";
  return `${(value * 100).toFixed(2)}%`;
}

function safeRatio(numerator, denominator) {
  if (!denominator) return { value: 0, isZero: true };
  return { value: numerator / denominator, isZero: false };
}

// Format date for LocalDate (YYYY-MM-DD) - backend expects LocalDate, not LocalDateTime
function toLocalDate(d) {
  return dayjs(d).format("YYYY-MM-DD");
}

// Keep old function for backward compatibility if needed elsewhere
function toISOWithTz(d, tzOffset = "+07:00") {
  return dayjs(d).format("YYYY-MM-DD[T]HH:mm:ss") + tzOffset;
}

function useDebouncedValue(value, delay = 400) {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return deb;
}

const listingTypeOptions = [
  { label: "Tất cả", value: undefined },
  { label: "Normal", value: "normal" },
  { label: "Booster", value: "booster" },
];

const categoryOptions = [
  { label: "Tất cả", value: undefined },
  { label: "Battery", value: "battery" },
  { label: "Car", value: "car" },
  { label: "Bike", value: "bike" },
  { label: "Motobike", value: "motobike" },
];

const timezoneDefault = "Asia/Ho_Chi_Minh";

const ManagerDashboard = () => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const abortRef = useRef({});

  // Shared filter state
  const [filters, setFilters] = useState(() => {
    const to = dayjs();
    const from = to.subtract(29, "day");
    return {
      from: toLocalDate(from.startOf("day")),
      to: toLocalDate(to.endOf("day")),
      branchId: 1,
      listingType: undefined,
      category: undefined,
      timezone: timezoneDefault,
    };
  });

  // Fetch branch list on mount
  useEffect(() => {
    async function loadBranches() {
      setBranchLoading(true);
      try {
        const response = await getAllBranches();
        if (response?.success && Array.isArray(response.data)) {
          const options = response.data.map((branch) => ({
            label: branch.name || `Chi nhánh ${branch.id}`,
            value: branch.id,
          }));
          setBranchOptions(options);
          
          // Set default branchId to first branch if current branchId is not valid
          if (options.length > 0) {
            const validBranchIds = options.map((opt) => opt.value);
            const currentBranchId = filters.branchId;
            
            // If current branchId is not in the list, use first branch
            if (!validBranchIds.includes(currentBranchId)) {
              const firstBranchId = options[0].value;
              setFilters((f) => ({ ...f, branchId: firstBranchId }));
              form.setFieldsValue({ branchId: firstBranchId });
            }
          }
        }
      } catch (error) {
        console.error("Failed to load branches:", error);
      } finally {
        setBranchLoading(false);
      }
    }
    loadBranches();
  }, []);

  // Initialize form values
  useEffect(() => {
    form.setFieldsValue({
      range: [dayjs(filters.from), dayjs(filters.to)],
      branchId: filters.branchId,
      listingType: filters.listingType,
      category: filters.category,
    });
  }, []);

  const debouncedFilters = useDebouncedValue(filters, 450);

  // Data states per widget
  const [txState, setTxState] = useState({
    loading: false,
    error: null,
    data: null,
  });
  const [revState, setRevState] = useState({
    loading: false,
    error: null,
    data: null,
  });
  const [marketState, setMarketState] = useState({
    loading: false,
    error: null,
    data: null,
  });

  // Branch options state
  const [branchOptions, setBranchOptions] = useState([]);
  const [branchLoading, setBranchLoading] = useState(false);

  // Fetch helpers
  async function fetchWithCache(endpoint, params) {
    // Map frontend params to backend API params
    const mappedParams = mapToApiParams(params);
    const cleanedParams = cleanParams(mappedParams);
    const key = buildKey(endpoint, cleanedParams);
    const cached = getCache(key);
    if (cached) return cached;
    try {
      // Log request for debugging (remove in production)
      if (import.meta.env.DEV) {
        console.log(`[API Request] ${endpoint}`, cleanedParams);
      }
      // Always call real API; do not pass signal to avoid CORS header issues
      const data = await get(endpoint, cleanedParams);
      // Only cache successful responses with data
      if (data != null) {
        setCache(key, data);
      }
      return data;
    } catch (error) {
      // Log error for debugging
      if (import.meta.env.DEV) {
        console.error(`[API Error] ${endpoint}`, error);
      }
      // Re-throw error so Promise.allSettled can catch it
      throw error;
    }
  }

  function abortPrev(name) {
    const c = abortRef.current[name];
    if (c) c.abort();
    const controller = new AbortController();
    abortRef.current[name] = controller;
    return controller.signal;
  }

  // Parallel fetch on debounced filter change
  useEffect(() => {
    if (!debouncedFilters.branchId) return;
    const txSignal = abortPrev("tx");
    const revSignal = abortPrev("rev");
    const mkSignal = abortPrev("mk");

    setTxState((s) => ({ ...s, loading: true, error: null }));
    setRevState((s) => ({ ...s, loading: true, error: null }));
    setMarketState((s) => ({ ...s, loading: true, error: null }));

    // Fire 3 in parallel
      Promise.allSettled([
        fetchWithCache("/api/reports/transaction-counts", debouncedFilters),
        fetchWithCache("/api/reports/revenue", debouncedFilters),
        fetchWithCache("/api/reports/market", debouncedFilters),
      ]).then((results) => {
      const [txRes, revRes, mkRes] = results;

      // Helper to safely extract error message
      const getErrorMessage = (reason) => {
        if (!reason) return "Unknown error";
        if (typeof reason === 'string') return reason;
        if (reason?.message) return reason.message;
        if (reason?.status) return `Server error: ${reason.status}`;
        try {
          return String(reason);
        } catch {
          return "Unknown error";
        }
      };

      if (txRes.status === "fulfilled") {
        // Ensure data is set to null if value is null/undefined
        setTxState({ loading: false, error: null, data: txRes.value ?? null });
      } else {
        const errorMsg = getErrorMessage(txRes.reason);
        setTxState({ loading: false, error: errorMsg, data: null });
      }

      if (revRes.status === "fulfilled") {
        setRevState({ loading: false, error: null, data: revRes.value ?? null });
      } else {
        const errorMsg = getErrorMessage(revRes.reason);
        setRevState({ loading: false, error: errorMsg, data: null });
      }

      if (mkRes.status === "fulfilled") {
        const marketData = mkRes.value ?? null;
        // Log response để kiểm tra cấu trúc dữ liệu
        console.log("=== MARKET API RESPONSE ===", marketData);
        if (marketData) {
          console.log("topBrands:", marketData.topBrands);
          console.log("topModels:", marketData.topModels);
          console.log("avgListingPriceByCategory:", marketData.avgListingPriceByCategory);
        }
        setMarketState({ loading: false, error: null, data: marketData });
      } else {
        const errorMsg = getErrorMessage(mkRes.reason);
        setMarketState({ loading: false, error: errorMsg, data: null });
      }
    }).catch((error) => {
      // Fallback error handler - should not happen with Promise.allSettled
      console.error("Unexpected error in Promise.allSettled:", error);
    });
  }, [debouncedFilters]);

  // Map frontend filter params to backend API params
  function mapToApiParams(filters) {
    const { branchId, listingType, category, ...rest } = filters;
    const apiParams = { ...rest };
    
    // Map branchId -> branch (if backend expects 'branch')
    if (branchId !== undefined && branchId !== null) {
      apiParams.branch = branchId; // Backend expects 'branch' parameter
    }
    
    // Map listingType: frontend uses "normal"/"booster"
    // Backend response uses "NORMAL"/"BOOSTER" (not "FREE"/"BOOSTER" as in spec)
    // When sending request, try both formats for compatibility
    if (listingType !== undefined && listingType !== null) {
      const listingTypeMap = {
        "normal": "NORMAL", // Backend actually uses "NORMAL" not "FREE"
        "booster": "BOOSTER"
      };
      apiParams.listingType = listingTypeMap[listingType] || listingType.toUpperCase();
    }
    
    // Map category: frontend uses lowercase
    // Backend response uses EV_CAR, EV_BIKE, EV_MOTORBIKE, BATTERY
    // When sending request, try EV_ prefix format
    if (category !== undefined && category !== null) {
      const categoryMap = {
        "battery": "BATTERY",
        "car": "EV_CAR", // Backend uses "EV_CAR" not "CAR"
        "bike": "EV_BIKE", // Backend uses "EV_BIKE" not "BIKE"
        "motobike": "EV_MOTORBIKE" // Backend uses "EV_MOTORBIKE" not "MOTORBIKE"
      };
      apiParams.category = categoryMap[category] || category.toUpperCase();
    }
    
    return apiParams;
  }

  // Clean params: remove undefined, null, empty string values
  function cleanParams(params) {
    const cleaned = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }

  // Mock data removed

  // Adapters and computed values
  const txVM = useMemo(() => {
    const d = txState.data;
    if (!d) return null;
    
    // Map from backend API spec: TransactionCountsDTO
    const total = d.totalTransactions || 0;
    const successful = d.successfulTransactions || 0;
    const failed = d.failedOrCancelledTransactions || 0;
    const successRate = d.successRate ?? safeRatio(successful, total).value;
    
    // Map transactionTypeBreakdown: POST -> postListing, CONSIGNMENT -> consignment, OTHER -> other
    // Add Vietnamese labels for display
    const transactionTypeBreakdown = d.transactionTypeBreakdown || {};
    const byTypeArr = [
      { type: "postListing", label: "Đăng tin", value: transactionTypeBreakdown.POST || 0 },
      { type: "consignment", label: "Ký gửi", value: transactionTypeBreakdown.CONSIGNMENT || 0 },
      { type: "other", label: "Khác", value: transactionTypeBreakdown.OTHER || 0 },
    ];

    // Note: API spec doesn't include timeseries, so we'll skip it
    // If backend adds timeseries later, uncomment below:
    // const ts = (d.timeseries || []).map((x) => ({
    //   date: x.date,
    //   total: x.total || 0,
    //   successful: x.successful || 0,
    //   failed: x.failedOrCancelled || 0,
    // }));
    // const tsLong = [];
    // ts.forEach((x) => {
    //   tsLong.push({ date: x.date, value: x.total, series: "Tổng" });
    //   tsLong.push({ date: x.date, value: x.successful, series: "Thành công" });
    //   tsLong.push({ date: x.date, value: x.failed, series: "Thất bại/Huỷ" });
    // });

    return {
      total,
      successful,
      failed,
      successRate,
      tsLong: [], // Empty array - API doesn't provide timeseries
      byTypeArr,
      rawTimeseries: [],
    };
  }, [txState.data]);

  const revVM = useMemo(() => {
    const d = revState.data;
    if (!d) return null;
    
    // Map from backend API spec: RevenueSummaryDTO
    // Currency is always VND - no filter needed
    const currency = d.currency || "VND";
    const total = d.totalRevenue || 0;
    
    // Map revenueBySource: POST -> postListing, CONSIGNMENT -> consignment, OTHER -> other
    // Add Vietnamese labels for display
    const revenueBySource = d.revenueBySource || {};
    const bySource = {
      postListing: revenueBySource.POST || 0,
      consignment: revenueBySource.CONSIGNMENT || 0,
      other: revenueBySource.OTHER || 0,
    };

    const avgPerDay = d.averagePerDay || 0;
    const avgPerUser = d.averagePerPayingUser || 0;
    const avgPerTx = d.averageTransactionValue || 0;
    const consignmentRatio = d.consignmentListingRevenueRate ?? safeRatio(bySource.consignment || 0, total).value;

    // Note: API spec doesn't include timeseries, so we'll skip it
    // If backend adds timeseries later, uncomment below:
    // const ts = (d.timeseries || []).flatMap((x) => {
    //   const items = [];
    //   const src = x.bySource || x.revenueBySource || {};
    //   if (src.consignment != null || src.CONSIGNMENT != null)
    //     items.push({
    //       date: x.date,
    //       value: src.consignment || src.CONSIGNMENT || 0,
    //       source: "Ký gửi",
    //     });
    //   if (src.postListing != null || src.POST != null)
    //     items.push({
    //       date: x.date,
    //       value: src.postListing || src.POST || 0,
    //       source: "Đăng tin",
    //     });
    //   if (src.other != null || src.OTHER != null)
    //     items.push({ 
    //       date: x.date, 
    //       value: src.other || src.OTHER || 0, 
    //       source: "Khác" 
    //     });
    //   return items;
    // });

    const donut = [
      { type: "Ký gửi", value: bySource.consignment || 0 },
      { type: "Đăng tin", value: bySource.postListing || 0 },
      { type: "Khác", value: bySource.other || 0 },
    ];

    return {
      currency,
      total,
      avgPerDay,
      avgPerUser,
      avgPerTx,
      consignmentRatio,
      stackedTs: [], // Empty array - API doesn't provide timeseries
      donut,
    };
  }, [revState.data]);

  const marketVM = useMemo(() => {
    const d = marketState.data;
    if (!d) return null;
    
    // Map from backend API actual response (not spec)
    // postTypeBreakdown: NORMAL -> normal, BOOSTER -> booster (backend uses "NORMAL" not "FREE")
    const pt = d.postTypeBreakdown || {};
    const postType = [
      { type: "normal", label: "Thường", value: pt.NORMAL || pt.FREE || 0 },
      { type: "booster", label: "Nổi bật", value: pt.BOOSTER || 0 },
    ];

    // categoryBreakdown: Backend uses EV_CAR, EV_BIKE, EV_MOTORBIKE, BATTERY (not CAR, BIKE, MOTORBIKE)
    const categoryBreakdown = d.categoryBreakdown || {};
    const categoryLabels = {
      battery: "Pin",
      car: "Ô tô",
      bike: "Xe đạp",
      motobike: "Xe máy",
    };
    // Map backend keys to frontend keys
    const counts = {
      battery: categoryBreakdown.BATTERY || 0,
      car: categoryBreakdown.EV_CAR || categoryBreakdown.CAR || 0,
      bike: categoryBreakdown.EV_BIKE || categoryBreakdown.BIKE || 0,
      motobike: categoryBreakdown.EV_MOTORBIKE || categoryBreakdown.MOTORBIKE || 0,
    };
    
    // avgListingPriceByCategory: Same mapping as categoryBreakdown
    const avgListingPriceByCategory = d.avgListingPriceByCategory || {};
    const avgPrice = {
      battery: parseFloat(avgListingPriceByCategory.BATTERY || 0),
      car: parseFloat(avgListingPriceByCategory.EV_CAR || avgListingPriceByCategory.CAR || 0),
      bike: parseFloat(avgListingPriceByCategory.EV_BIKE || avgListingPriceByCategory.BIKE || 0),
      motobike: parseFloat(avgListingPriceByCategory.EV_MOTORBIKE || avgListingPriceByCategory.MOTORBIKE || 0),
    };
    
    const countsArr = Object.entries(counts).map(([k, v]) => ({
      name: categoryLabels[k] || k,
      value: v,
      series: "Số lượng",
    }));
    const avgArr = Object.entries(avgPrice).map(([k, v]) => ({
      name: categoryLabels[k] || k,
      value: v,
      series: "Giá TB",
    }));

    // topBrands and topModels: List<NameCount> -> { name, count }
    // Backend provides separate topBrands and topModels lists
    // We'll map them by index (assuming they correspond) and use avgListingPriceByCategory for price
    const topBrands = d.topBrands || [];
    const topModels = d.topModels || [];
    // Note: avgListingPriceByCategory is already declared above (line 496)
    
    // Log để kiểm tra cấu trúc dữ liệu
    console.log("=== PROCESSING MARKET DATA ===");
    console.log("topBrands:", topBrands);
    console.log("topModels:", topModels);
    console.log("avgListingPriceByCategory:", avgListingPriceByCategory);
    console.log("categoryBreakdown:", d.categoryBreakdown);
    
    // Determine which category to use for price
    // If there's only one category with data, use that
    const categoryKeys = Object.keys(d.categoryBreakdown || {});
    const categoryWithData = categoryKeys.find(key => (d.categoryBreakdown[key] || 0) > 0);
    
    // Get average price for the category (or use first available)
    let defaultAvgPrice = 0;
    if (categoryWithData && avgListingPriceByCategory[categoryWithData]) {
      defaultAvgPrice = parseFloat(avgListingPriceByCategory[categoryWithData]) || 0;
    } else if (Object.keys(avgListingPriceByCategory).length > 0) {
      // Fallback: use first available category price
      const firstCategory = Object.keys(avgListingPriceByCategory)[0];
      defaultAvgPrice = parseFloat(avgListingPriceByCategory[firstCategory]) || 0;
    }
    
    console.log("Using avgPrice from category:", categoryWithData, "=", defaultAvgPrice);
    
    // Create brandsRows by mapping topBrands with topModels
    // Assumption: topBrands[i] corresponds to topModels[i] (same index)
    const maxLength = Math.max(topBrands.length, topModels.length);
    const brandsRows = [];
    
    for (let i = 0; i < maxLength; i++) {
      const brand = topBrands[i] || { name: "Không xác định", count: 0 };
      const model = topModels[i] || { name: "Không xác định", count: 0 };
      
      // Try to get model-specific price, fallback to category average
      const avgPrice = model.avgPrice || model.averagePrice || model.avgListingPrice || defaultAvgPrice;
      
      brandsRows.push({
        brand: brand.name || "Không xác định",
        model: model.name || "Không xác định",
        count: model.count || brand.count || 0,
        avgPrice: avgPrice,
      });
    }
    
    console.log("Final brandsRows:", brandsRows);

    // If backend provides nested structure later, use:
    // const brandsRows = (d.brands || []).flatMap((b) =>
    //   (b.models || []).map((m) => ({
    //     brand: b.brand || b.name,
    //     model: m.model || m.name,
    //     count: m.count || 0,
    //     avgPrice: m.avgPrice || 0,
    //   }))
    // );

    const priceBuckets = (d.priceBuckets || []).map((p) => ({
      category: p.category,
      bucket: p.bucket,
      value: p.count,
    }));

    return { postType, countsArr, avgArr, brandsRows, priceBuckets };
  }, [marketState.data]);

  // Handlers
  function onFilterChange(_, allValues) {
    const range = allValues.range || [];
    const [from, to] =
      range.length === 2 ? range : [dayjs().subtract(29, "d"), dayjs()];
    setFilters((f) => ({
      ...f,
      from: toLocalDate(from.startOf("day")),
      to: toLocalDate(to.endOf("day")),
      branchId: allValues.branchId,
      listingType: allValues.listingType,
      category: allValues.category,
      timezone: timezoneDefault,
    }));
  }

  function retryTx() {
    setTxState((s) => ({ ...s, data: null }));
    setFilters((f) => ({ ...f }));
  }
  function retryRev() {
    setRevState((s) => ({ ...s, data: null }));
    setFilters((f) => ({ ...f }));
  }
  function retryMarket() {
    setMarketState((s) => ({ ...s, data: null }));
    setFilters((f) => ({ ...f }));
  }

  // CSV helpers
  function downloadCSV(filename, rows) {
    const csv = rows
      .map((r) => r.map((cell) => formatCSVCell(cell)).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
  function formatCSVCell(cell) {
    if (cell == null) return "";
    const s = String(cell).replaceAll('"', '""');
    if (s.includes(",") || s.includes("\n") || s.includes('"')) return `"${s}"`;
    return s;
  }

  function exportTxTimeseries() {
    if (!txVM) return;
    const rows = [
      ["date", "total", "successful", "failedOrCancelled"],
      ...txVM.rawTimeseries.map((x) => [
        x.date,
        x.total,
        x.successful,
        x.failed,
      ]),
    ];
    downloadCSV("transactions_timeseries.csv", rows);
  }
  function exportRev() {
    if (!revVM || !revState.data) return;
    const donut = revVM.donut.map((d) => [d.type, d.value]);
    const ts = (revState.data.timeseries || []).map((x) => {
      const src = x.bySource || {};
      return [
        x.date,
        src.consignment || 0,
        src.postListing || 0,
        src.featured || 0,
        src.other || 0,
        x.total || 0,
      ];
    });
    downloadCSV("revenue_by_source.csv", [["type", "value"], ...donut]);
    downloadCSV("revenue_timeseries.csv", [
      ["date", "consignment", "postListing", "featured", "other", "total"],
      ...ts,
    ]);
  }
  function exportMarket() {
    if (!marketVM || !marketState.data) return;
    const brands = marketVM.brandsRows.map((r) => [
      r.brand,
      r.model,
      r.count,
      r.avgPrice ?? 0,
    ]);
    const categoryCounts = marketVM.countsArr
      .filter((r) => r.series === "count")
      .map((r) => [r.name, r.value]);
    downloadCSV("market_brands.csv", [
      ["brand", "model", "count", "avgPrice"],
      ...brands,
    ]);
    downloadCSV("market_category_counts.csv", [
      ["category", "count"],
      ...categoryCounts,
    ]);
  }

  // UI
  return (
    <div style={{ padding: "24px", background: token.colorBgLayout }}>
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <FilterBar
          form={form}
          onValuesChange={onFilterChange}
        />

      <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <TransactionsWidget state={txState} vm={txVM} onRetry={retryTx} onExport={exportTxTimeseries} formatPercent={formatPercent} />
          </Col>

          <Col xs={24} lg={12}>
            <RevenueWidget state={revState} vm={revVM} onRetry={retryRev} onExport={exportRev} formatCurrency={formatCurrency} formatPercent={formatPercent} />
          </Col>
        </Row>

        <MarketWidget state={marketState} vm={marketVM} onRetry={retryMarket} onExport={exportMarket} formatCurrency={formatCurrency} currency="VND" />
      </Space>
    </div>
  );
};

function EmptyWidget({ text }) {
  return (
    <Flex
      align="center"
      justify="center"
      style={{ height: 220, color: "#999" }}
    >
      {text}
    </Flex>
  );
}

export default ManagerDashboard;
