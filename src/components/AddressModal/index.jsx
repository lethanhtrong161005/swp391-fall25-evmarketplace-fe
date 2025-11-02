import { Modal, Form, Select, Input } from "antd";
import styles from "./index.module.scss";
import { useAddressModal } from "@components/AddressModal/useAddressModal.js";

const AddressModal = ({ open, onCancel, onOk, initialAddress }) => {
  const {
    line,
    setLine,
    province,
    district,
    ward,
    provinces,
    districts,
    wards,
    canSubmit,
    submit,
    onProvinceChange,
    onDistrictChange,
    onWardChange,
    filterOption,
  } = useAddressModal({ open, initialAddress, onOk });

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={submit}
      okText="XONG"
      title="Địa chỉ"
      destroyOnHidden
      wrapClassName={styles.modalWrap}
      className={styles.modal}
      okButtonProps={{ disabled: !canSubmit }}
    >
      <Form layout="vertical" className={styles.form}>
        <Form.Item label="Địa chỉ chi tiết *" required>
          <Input
            className={styles.input}
            placeholder="Số nhà, ngõ/ngách, tên đường, toà nhà…"
            value={line}
            maxLength={120}
            onChange={(e) => setLine(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Tỉnh, thành phố *" required>
          <Select
            className={styles.select}
            classNames={{ popup: styles.dropdown }}
            showSearch
            options={provinces}
            placeholder="Chọn tỉnh/thành"
            value={province?.value}
            onChange={onProvinceChange}
            filterOption={filterOption}
          />
        </Form.Item>

        <div className={styles.rowGrid}>
          <Form.Item label="Quận, huyện, thị xã *" required>
            <Select
              className={styles.select}
              classNames={{ popup: styles.dropdown }}
              showSearch
              options={districts}
              placeholder="Chọn quận/huyện"
              value={district?.value}
              disabled={!province}
              onChange={onDistrictChange}
              filterOption={filterOption}
            />
          </Form.Item>

          <Form.Item label="Phường, xã, thị trấn *" required>
            <Select
              className={styles.select}
              classNames={{ popup: styles.dropdown }}
              showSearch
              options={wards}
              placeholder="Chọn phường/xã"
              value={ward?.value}
              disabled={!district}
              onChange={onWardChange}
              filterOption={filterOption}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default AddressModal;
