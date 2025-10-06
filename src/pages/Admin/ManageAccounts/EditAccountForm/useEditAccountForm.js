import { useState, useEffect } from "react";
import { Form, message } from "antd";

export function useEditAccountForm({ account, onFinish }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [originalValues, setOriginalValues] = useState({});

  // Set form values when account changes
  useEffect(() => {
    if (account) {
      const values = {
        fullName: account.fullName || account.profile?.fullName || "",
        email: account.email || account.profile?.email || "",
        phone: account.phoneNumber || account.phone || "",
        role: account.role || "",
        status: account.status || "",
      };

      form.setFieldsValue(values);
      setOriginalValues(values); // Save original values to compare later
    }
  }, [account, form]);

  const handleFinish = async (values) => {
    try {
      setLoading(true);

      // Only include fields that have changed
      const changedFields = {};

      Object.keys(values).forEach((key) => {
        const newValue = values[key];
        const originalValue = originalValues[key];

        // Only include if value actually changed and is not empty
        if (
          newValue !== originalValue &&
          newValue !== "" &&
          newValue !== null &&
          newValue !== undefined
        ) {
          changedFields[key] = newValue;
        }
      });

      // If no fields changed, don't make API call
      if (Object.keys(changedFields).length === 0) {
        message.info("Không có thay đổi nào để cập nhật");
        setLoading(false);
        return;
      }

      // Include account ID for the update
      const updateData = {
        id: account?.id,
        ...changedFields,
      };

      await onFinish(updateData);
      message.success("Cập nhật tài khoản thành công");
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi cập nhật tài khoản"
      );
    } finally {
      setLoading(false);
    }
  };

  // Override form's onFinish to use our handler
  const formProps = {
    ...form,
    submit: () => form.validateFields().then(handleFinish),
  };

  return {
    form: formProps,
    loading,
  };
}
