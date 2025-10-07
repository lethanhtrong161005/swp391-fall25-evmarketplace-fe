import { useState } from "react";
import { Form } from "antd";

/**
 * Logic hook cho CreateAccountForm
 * Xử lý form state và submit logic
 */
export function useCreateAccountForm({ onFinish }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      await onFinish(values);
      form.resetFields();
      // Success message handled by parent
    } catch (error) {
      // Error handling is done by parent component
      console.error("Create account error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    handleFinish,
  };
}
