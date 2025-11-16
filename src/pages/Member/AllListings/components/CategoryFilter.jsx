import React from "react";
import { Button, Space, Popover, InputNumber } from "antd";
import {
  FilterOutlined,
  DownOutlined,
  CarOutlined,
  ThunderboltOutlined,
  HomeOutlined,
  BgColorsOutlined,
} from "@ant-design/icons";
import styles from "../styles/CategoryFilter.module.scss";

const CATEGORY_ICONS = {
  all: <HomeOutlined />,
  EV_CAR: <CarOutlined />,
  E_MOTORBIKE: <ThunderboltOutlined />,
  E_BIKE: <ThunderboltOutlined />,
  BATTERY: <BgColorsOutlined />,
};

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  showFilters,
  onShowFiltersChange,
  onPriceReset,
  onPriceApply,
  defaultMaxPrice,
}) {
  return (
    <div className={styles.categoryFilter}>
      <Space size="small">
        <Popover
          open={showFilters}
          onOpenChange={onShowFiltersChange}
          trigger="click"
          placement="bottomLeft"
          overlayClassName="price-filter-popover"
          content={
            <div className={styles.priceFilterDropdown}>
              <div className={styles.priceFilter}>
                <div className={styles.priceFilterTitle}>Khoảng giá</div>

                <div className={styles.priceInputs}>
                  <InputNumber
                    placeholder="Giá tối thiểu"
                    value={priceRange[0]}
                    onChange={(value) =>
                      onPriceRangeChange([value || null, priceRange[1]])
                    }
                    formatter={(value) =>
                      value
                        ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : ""
                    }
                    parser={(value) => value.replace(/\D/g, "")}
                    min={0}
                    max={priceRange[1] || defaultMaxPrice}
                    controls={false}
                    addonAfter="đ"
                    className={styles.priceInput}
                  />

                  <span className={styles.priceSeparator}>-</span>

                  <InputNumber
                    placeholder="Giá tối đa"
                    value={priceRange[1]}
                    onChange={(value) =>
                      onPriceRangeChange([priceRange[0], value || null])
                    }
                    formatter={(value) =>
                      value
                        ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : ""
                    }
                    parser={(value) => value.replace(/\D/g, "")}
                    min={priceRange[0] || 0}
                    max={defaultMaxPrice}
                    controls={false}
                    addonAfter="đ"
                    className={styles.priceInput}
                  />
                </div>

                <div className={styles.filterActions}>
                  <Button
                    onClick={onPriceReset}
                    block
                    className={styles.resetBtn}
                  >
                    Xóa lọc
                  </Button>
                  <Button
                    type="primary"
                    onClick={onPriceApply}
                    block
                    className={styles.applyBtn}
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>
            </div>
          }
        >
          <Button
            icon={<FilterOutlined />}
            type={showFilters ? "primary" : "text"}
            className={styles.filterBtn}
          >
            Giá <DownOutlined />
          </Button>
        </Popover>

        {categories.map((cat) => (
          <Button
            key={cat.id}
            type={selectedCategory === cat.id ? "primary" : "default"}
            onClick={() => onCategoryChange(cat.id)}
            className={styles.categoryBtn}
            icon={CATEGORY_ICONS[cat.id]}
          >
            {cat.label}
          </Button>
        ))}
      </Space>
    </div>
  );
}
