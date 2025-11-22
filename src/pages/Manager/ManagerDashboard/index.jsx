import React, { useEffect, useRef, useState, useCallback } from "react";
import { Card, theme, Form, DatePicker } from "antd";
import dayjs from "dayjs";
import { get } from "@/utils/apiCaller";
import { useResponsive } from "@/utils/responsive";
import { useLocation } from "react-router-dom";

// Import page components
import TransactionReport from "./pages/TransactionReport";
import RevenueReport from "./pages/RevenueReport";
import MarketReport from "./pages/MarketReport";

const { RangePicker } = DatePicker;

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

function formatCurrency(value, currency = "VND", options = {}) {
  if (!Number.isFinite(value)) return "0";
  try {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
      currencyDisplay: currency === "VND" ? "code" : "symbol",
      maximumFractionDigits: options.maximumFractionDigits ?? 0,
      minimumFractionDigits: options.minimumFractionDigits ?? 0,
    });
    const formatted = formatter.format(value);
    // Replace non-breaking space with regular to avoid layout glitches
    return formatted.replace(/\u00A0/g, " ");
  } catch {
    return `${new Intl.NumberFormat("vi-VN").format(value)} ${
      currency ?? ""
    }`.trim();
  }
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return "0%";
  return `${(value * 100).toFixed(2)}%`;
}

// Format date for LocalDate (YYYY-MM-DD)
function toLocalDate(d) {
  return dayjs(d).format("YYYY-MM-DD");
}

function useDebouncedValue(value, delay = 400) {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return deb;
}

const timezoneDefault = "Asia/Ho_Chi_Minh";

const ManagerDashboard = () => {
  const { token } = theme.useToken();
  const { isMobile } = useResponsive();
  const [form] = Form.useForm();
  const abortRef = useRef({});
  const location = useLocation();

  // Determine current page from URL path
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.includes("/transaction")) return "transaction";
    if (path.includes("/revenue")) return "revenue";
    if (path.includes("/market")) return "market";
    return "transaction"; // default
  };

  const currentPage = getCurrentPage();

  const [filters, setFilters] = useState(() => {
    const to = dayjs();
    const from = to.subtract(29, "day");
    return {
      from: toLocalDate(from.startOf("day")),
      to: toLocalDate(to.endOf("day")),
      timezone: timezoneDefault,
    };
  });

  useEffect(() => {
    form.setFieldsValue({
      range: [dayjs(filters.from), dayjs(filters.to)],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedFilters = useDebouncedValue(filters, 450);

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

  const fetchWithCache = useCallback(async (endpoint, params) => {
    const mappedParams = mapToApiParams(params);
    const cleanedParams = cleanParams(mappedParams);
    const key = buildKey(endpoint, cleanedParams);
    const cached = getCache(key);
    if (cached) {
      return cached;
    }
    const data = await get(endpoint, cleanedParams);
    if (data != null) {
      setCache(key, data);
    }
    return data;
  }, []);

  function abortPrev(name) {
    const c = abortRef.current[name];
    if (c) c.abort();
    const controller = new AbortController();
    abortRef.current[name] = controller;
    return controller.signal;
  }

  useEffect(() => {
    abortPrev("tx");
    abortPrev("rev");
    abortPrev("mk");

    setTxState((s) => ({ ...s, loading: true, error: null }));
    setRevState((s) => ({ ...s, loading: true, error: null }));
    setMarketState((s) => ({ ...s, loading: true, error: null }));

    const marketFilters = { ...debouncedFilters, topLimit: 5 };

    Promise.allSettled([
      fetchWithCache("/api/reports/transaction-counts", debouncedFilters),
      fetchWithCache("/api/reports/revenue", debouncedFilters),
      fetchWithCache("/api/reports/market", marketFilters),
    ]).then((results) => {
      const [txRes, revRes, mkRes] = results;

      const getErrorMessage = (reason) => {
        if (!reason) return "Unknown error";
        if (typeof reason === "string") return reason;
        if (reason?.message) return reason.message;
        if (reason?.status) return `Server error: ${reason.status}`;
        try {
          return String(reason);
        } catch {
          return "Unknown error";
        }
      };

      if (txRes.status === "fulfilled") {
        const txData = txRes.value ?? null;
        setTxState({
          loading: false,
          error: null,
          data: txData && typeof txData === "object" ? txData : null,
        });
      } else {
        const errorMsg = getErrorMessage(txRes.reason);
        setTxState({ loading: false, error: errorMsg, data: null });
      }

      if (revRes.status === "fulfilled") {
        const revData = revRes.value ?? null;
        setRevState({
          loading: false,
          error: null,
          data: revData && typeof revData === "object" ? revData : null,
        });
      } else {
        const errorMsg = getErrorMessage(revRes.reason);
        setRevState({ loading: false, error: errorMsg, data: null });
      }

      if (mkRes.status === "fulfilled") {
        const mkData = mkRes.value ?? null;
        setMarketState({
          loading: false,
          error: null,
          data: mkData && typeof mkData === "object" ? mkData : null,
        });
      } else {
        const errorMsg = getErrorMessage(mkRes.reason);
        setMarketState({ loading: false, error: errorMsg, data: null });
      }
    });
  }, [debouncedFilters, fetchWithCache]);

  function mapToApiParams(filters) {
    return { ...filters };
  }

  function cleanParams(params) {
    const cleaned = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }

  function onFilterChange(_, allValues) {
    const range = allValues.range || [];
    const [from, to] =
      range.length === 2 ? range : [dayjs().subtract(29, "d"), dayjs()];
    const newFilters = {
      from: toLocalDate(from.startOf("day")),
      to: toLocalDate(to.endOf("day")),
      timezone: timezoneDefault,
    };
    setFilters((f) => ({ ...f, ...newFilters }));
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

  function exportTxData() {
    if (!txState.data) return;
    const rows = [
      ["Metric", "Value"],
      ["Total Transactions", txState.data.totalTransactions || 0],
      ["Successful Transactions", txState.data.successfulTransactions || 0],
      [
        "Failed/Cancelled Transactions",
        txState.data.failedOrCancelledTransactions || 0,
      ],
      ["Success Rate", txState.data.successRate || 0],
      ["PROMOTION Transactions", txState.data.transactionType?.PROMOTION || 0],
      [
        "ORDER Transactions",
        txState.data.transactionType?.ORDER || 0,
      ],
    ];
    downloadCSV("transaction_report.csv", rows);
  }

  function exportRevData() {
    if (!revState.data) return;
    const rows = [
      ["Metric", "Value"],
      ["Currency", revState.data.currency || "VND"],
      ["Total Revenue", revState.data.totalRevenue || 0],
      ["Average Per Day", revState.data.averagePerDay || 0],
      ["Average Per Paying User", revState.data.averagePerPayingUser || 0],
      ["Average Transaction Value", revState.data.averageTransactionValue || 0],
      [
        "Consignment Revenue Rate",
        revState.data.consignmentListingRevenueRate || 0,
      ],
      ["PROMOTION Revenue", revState.data.revenueBySource?.PROMOTION || 0],
      ["ORDER Revenue", revState.data.revenueBySource?.ORDER || 0],
    ];
    downloadCSV("revenue_report.csv", rows);
  }

  function exportMarketData() {
    if (!marketState.data) return;
    const data = marketState.data;

    const categoryRows = [
      ["Category", "Count", "Avg Price"],
      [
        "BATTERY",
        data.categoryCount?.BATTERY || 0,
        data.avgPriceByCategory?.BATTERY || 0,
      ],
      [
        "E_BIKE",
        data.categoryCount?.E_BIKE || 0,
        data.avgPriceByCategory?.E_BIKE || 0,
      ],
      [
        "EV_CAR",
        data.categoryCount?.EV_CAR || 0,
        data.avgPriceByCategory?.EV_CAR || 0,
      ],
      [
        "E_MOTORBIKE",
        data.categoryCount?.E_MOTORBIKE || 0,
        data.avgPriceByCategory?.E_MOTORBIKE || 0,
      ],
    ];
    downloadCSV("market_category.csv", categoryRows);

    const brandRows = [
      ["Brand", "Count"],
      ...(data.topBrands || []).map((b) => [b.name, b.count]),
    ];
    downloadCSV("market_top_brands.csv", brandRows);

    const modelRows = [
      ["Model", "Count"],
      ...(data.topModels || []).map((m) => [m.name, m.count]),
    ];
    downloadCSV("market_top_models.csv", modelRows);
  }

  const renderPage = () => {
    switch (currentPage) {
      case "transaction":
        return (
          <TransactionReport
            state={txState}
            onRetry={retryTx}
            onExport={exportTxData}
          />
        );
      case "revenue":
        return (
          <RevenueReport
            state={revState}
            onRetry={retryRev}
            onExport={exportRevData}
            formatCurrency={formatCurrency}
            formatPercent={formatPercent}
          />
        );
      case "market":
        return (
          <MarketReport
            state={marketState}
            onRetry={retryMarket}
            onExport={exportMarketData}
            formatCurrency={formatCurrency}
          />
        );
      default:
        return (
          <TransactionReport
            state={txState}
            onRetry={retryTx}
            onExport={exportTxData}
          />
        );
    }
  };

  return (
    <div
      style={{
        padding: isMobile ? 12 : 24,
        background: token.colorBgLayout,
        minHeight: "100vh",
      }}
    >
      {/* Filter Bar */}
      <Card
        variant="outlined"
        style={{ marginBottom: 16 }}
        styles={{ body: { padding: isMobile ? 12 : 16 } }}
      >
        <Form
          form={form}
          layout={isMobile ? "vertical" : "inline"}
          onValuesChange={onFilterChange}
        >
          <Form.Item
            name="range"
            label="Khoảng thời gian"
            rules={[{ required: true }]}
          >
            <RangePicker
              allowClear={false}
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form>
      </Card>

      {/* Page Content */}
      {renderPage()}
    </div>
  );
};

export default ManagerDashboard;
