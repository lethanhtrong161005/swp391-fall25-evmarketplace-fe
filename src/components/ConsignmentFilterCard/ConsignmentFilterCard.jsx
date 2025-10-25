import React from "react";
import { Card } from "antd";
import "./ConsignmentFilterCard.scss";

const ConsignmentFilterCard = ({
  title = "Bộ lọc",   
  options = [],       
  selectedValue,      
  onChange,         
}) => {
  return (
    <Card className="consignment-filter-wrapper" title={title} bordered={false}>
      <div className="consignment-filter-cards">
        {options.map((opt) => (
          <div
            key={opt.value}
            className={`filter-card-item ${
              selectedValue === opt.value ? "active" : ""
            }`}
            onClick={() => onChange(opt.value)}
          >
            {opt.icon && <div className="filter-icon">{opt.icon}</div>}
            <div className="filter-label">{opt.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ConsignmentFilterCard;
