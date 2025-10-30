import { useEffect, useState } from "react";
import { Select, Spin, message } from "antd";
import { getAllBranches } from "@/services/branchService";

const BranchAddressField = ({ value, onChange, placeholder = "Chọn chi nhánh", disabled = false }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const res = await getAllBranches();
        if (res?.success) {
          setBranches(res.data || []);
        } else {
          message.error(res?.message || "Không thể tải danh sách chi nhánh");
        }
      } catch (err) {
        console.error("Lỗi khi lấy danh sách chi nhánh:", err);
        message.error("Lỗi khi tải danh sách chi nhánh");
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  return (
    <Select
      showSearch
      allowClear
      disabled={disabled}
      loading={loading}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      options={branches.map((b) => ({
        label: `${b.name} - ${b.address}`,
        value: b.id,
      }))}
      notFoundContent={loading ? <Spin size="small" /> : "Không có chi nhánh"}
    />
  );
};

export default BranchAddressField;
