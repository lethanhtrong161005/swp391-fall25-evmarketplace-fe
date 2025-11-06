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

const currencyOptions = [
  { label: "VND", value: "VND" },
  { label: "USD", value: "USD" },
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
      from: toISOWithTz(from.startOf("day")),
      to: toISOWithTz(to.endOf("day")),
      branchId: 1,
      listingType: undefined,
      category: undefined,
      currency: "VND",
      timezone: timezoneDefault,
    };
  });

  // Initialize form values
  useEffect(() => {
    form.setFieldsValue({
      range: [dayjs(filters.from), dayjs(filters.to)],
      branchId: filters.branchId,
      listingType: filters.listingType,
      category: filters.category,
      currency: filters.currency,
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

  // Fetch helpers
  async function fetchWithCache(endpoint, params) {
    const key = buildKey(endpoint, params);
    const cached = getCache(key);
    if (cached) return cached;
    // Always call real API; do not pass signal to avoid CORS header issues
    const data = await get(endpoint, params);
    setCache(key, data);
    return data;
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
      fetchWithCache(
        "/api/reports/transaction-counts",
        omitCurrency(debouncedFilters),
        txSignal
      ),
      fetchWithCache("/api/reports/revenue", debouncedFilters, revSignal),
      fetchWithCache(
        "/api/reports/market",
        omitCurrency(debouncedFilters),
        mkSignal
      ),
    ]).then((results) => {
      const [txRes, revRes, mkRes] = results;

      if (txRes.status === "fulfilled") {
        setTxState({ loading: false, error: null, data: txRes.value });
      } else {
        setTxState((s) => ({ ...s, loading: false, error: txRes.reason }));
      }

      if (revRes.status === "fulfilled") {
        setRevState({ loading: false, error: null, data: revRes.value });
      } else {
        setRevState((s) => ({ ...s, loading: false, error: revRes.reason }));
      }

      if (mkRes.status === "fulfilled") {
        setMarketState({ loading: false, error: null, data: mkRes.value });
      } else {
        setMarketState((s) => ({ ...s, loading: false, error: mkRes.reason }));
      }
    });
  }, [debouncedFilters]);

  function omitCurrency(f) {
    const { currency: _currency, ...rest } = f;
    return rest;
  }

  // Mock data removed

  // Adapters and computed values
  const txVM = useMemo(() => {
    const d = txState.data;
    if (!d) return null;
    const totals = d.totals || {
      totalTransactions: 0,
      successfulTransactions: 0,
      failedOrCancelledTransactions: 0,
      byType: {},
    };
    const ts = (d.timeseries || []).map((x) => ({
      date: x.date,
      total: x.total || 0,
      successful: x.successful || 0,
      failed: x.failedOrCancelled || 0,
    }));
    // Prefer sums from timeseries to ensure KPI == series aggregate
    const sumTotal = ts.reduce((a, b) => a + (b.total || 0), 0);
    const sumSuccessful = ts.reduce((a, b) => a + (b.successful || 0), 0);
    const sumFailed = ts.reduce((a, b) => a + (b.failed || 0), 0);
    const total = sumTotal || totals.totalTransactions || 0;
    const successful = sumSuccessful || totals.successfulTransactions || 0;
    const failed = sumFailed || totals.failedOrCancelledTransactions || 0;
    const successRate =
      d?.ratios?.successRate ?? safeRatio(successful, total).value;
    const byType = totals.byType || {};

    const tsLong = [];
    ts.forEach((x) => {
      tsLong.push({ date: x.date, value: x.total, series: "Total" });
      tsLong.push({ date: x.date, value: x.successful, series: "Successful" });
      tsLong.push({ date: x.date, value: x.failed, series: "Failed" });
    });

    const byTypeArr = [
      { type: "postListing", value: byType.postListing || 0 },
      { type: "consignment", value: byType.consignment || 0 },
      { type: "other", value: byType.other || 0 },
    ];

    return {
      total,
      successful,
      failed,
      successRate,
      tsLong,
      byTypeArr,
      rawTimeseries: ts,
    };
  }, [txState.data]);

  const revVM = useMemo(() => {
    const d = revState.data;
    if (!d) return null;
    const currency = d.currency || filters.currency || "VND";
    const total = d.revenue?.totalRevenue || 0;
    const bySource = d.revenue?.bySource || {};
    const denom = d.denominators || {
      numDays: 0,
      usersWithTransactions: 0,
      totalTransactions: 0,
    };

    const avgPerDay =
      d.averages?.perDay ?? (denom.numDays ? total / denom.numDays : 0);
    const avgPerUser =
      d.averages?.perUserWithTransactions ??
      (denom.usersWithTransactions ? total / denom.usersWithTransactions : 0);
    const avgPerTx =
      d.averages?.perTransaction ??
      (denom.totalTransactions ? total / denom.totalTransactions : 0);
    const consignmentRatio =
      d.ratios?.consignmentToTotal ??
      safeRatio(bySource.consignment || 0, total).value;

    const ts = (d.timeseries || []).flatMap((x) => {
      const items = [];
      const src = x.bySource || {};
      items.push({ date: x.date, value: x.total || 0, source: "total" });
      if (src.consignment != null)
        items.push({
          date: x.date,
          value: src.consignment,
          source: "consignment",
        });
      if (src.postListing != null)
        items.push({
          date: x.date,
          value: src.postListing,
          source: "postListing",
        });
      if (src.featured != null)
        items.push({ date: x.date, value: src.featured, source: "featured" });
      if (src.other != null)
        items.push({ date: x.date, value: src.other, source: "other" });
      return items.filter((i) => i.source !== "total"); // stacked area by source only
    });

    const donut = [
      { type: "consignment", value: bySource.consignment || 0 },
      { type: "postListing", value: bySource.postListing || 0 },
      { type: "featured", value: bySource.featured || 0 },
      { type: "other", value: bySource.other || 0 },
    ];

    return {
      currency,
      total,
      avgPerDay,
      avgPerUser,
      avgPerTx,
      consignmentRatio,
      stackedTs: ts,
      donut,
    };
  }, [revState.data, filters.currency]);

  const marketVM = useMemo(() => {
    const d = marketState.data;
    if (!d) return null;
    const pt = d.postTypeBreakdown || {};
    const postType = [
      { type: "normal", value: pt.normal || 0 },
      { type: "booster", value: pt.booster || 0 },
    ];

    const counts = d.category?.counts || {
      battery: 0,
      car: 0,
      bike: 0,
      motobike: 0,
    };
    const avgPrice = d.category?.avgPrice || {
      battery: 0,
      car: 0,
      bike: 0,
      motobike: 0,
    };
    const countsArr = Object.entries(counts).map(([k, v]) => ({
      name: k,
      value: v,
      series: "count",
    }));
    const avgArr = Object.entries(avgPrice).map(([k, v]) => ({
      name: k,
      value: v,
      series: "avgPrice",
    }));

    const brandsRows = (d.brands || []).flatMap((b) =>
      (b.models || []).map((m) => ({
        brand: b.brand,
        model: m.model,
        count: m.count,
        avgPrice: m.avgPrice,
      }))
    );

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
      from: toISOWithTz(from.startOf("day")),
      to: toISOWithTz(to.endOf("day")),
      branchId: allValues.branchId,
      listingType: allValues.listingType,
      category: allValues.category,
      currency: allValues.currency || f.currency,
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
          listingTypeOptions={listingTypeOptions}
          categoryOptions={categoryOptions}
          currencyOptions={currencyOptions}
        />

      <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <TransactionsWidget state={txState} vm={txVM} onRetry={retryTx} onExport={exportTxTimeseries} formatPercent={formatPercent} />
          </Col>

          <Col xs={24} lg={12}>
            <RevenueWidget state={revState} vm={revVM} onRetry={retryRev} onExport={exportRev} formatCurrency={formatCurrency} formatPercent={formatPercent} />
          </Col>
        </Row>

        <MarketWidget state={marketState} vm={marketVM} onRetry={retryMarket} onExport={exportMarket} formatCurrency={formatCurrency} currency={filters.currency} />
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
