import React from "react";
import styles from "./index.module.scss";
import { Card, Modal } from "antd";
import SearchActions from "./SearchActions";
import ContractTable from "./ContractTable";
import useStaffContract from "./useStaffContract";
import useContractEditModal from "./ContractEditModal/useContractEditModal";
import ContractEditModal from "./ContractEditModal";

const StaffContract = () => {
  const logic = useStaffContract();

  // ✅ truyền hàm reload danh sách vào hook edit modal
  const edit = useContractEditModal({
    onUpdated: logic.fetchContracts, // <-- gọi lại khi update thành công
  });

  return (
    <Card className={styles.container} variant="outlined">
      <h2 className={styles.title}>Quản lý hợp đồng</h2>

      <SearchActions {...logic} />

      <ContractTable
        {...logic}
        onViewDetail={logic.openContract}
        onEdit={(row) => edit.openModal(row)}
      />

      <ContractEditModal
        open={edit.open}
        submitting={edit.submitting}
        initialValues={edit.initialValues}
        readOnly={!!edit.initialValues?.readOnly}
        onCancel={edit.closeModal}
        onSubmit={edit.handleSubmit}
        fileList={edit.fileList}
        setFileList={edit.setFileList}
        beforeUpload={edit.beforeUpload}
        onPreviewCurrent={() => {
          const url = edit.initialValues?.currentFileUrl;
          if (!url) return;
          logic.openContract({ fileUrl: url });
        }}
      />

      <Modal
        title={<div style={{ textAlign: "center", width: "100%" }}>Xem hợp đồng</div>}
        open={logic.contract.open}
        onCancel={logic.closeContract}
        footer={null}
        width="80vw"
        centered
        className={styles.centerModal}
        styles={{
          body: {
            padding: 0,
            height: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        {logic.contract.url && (
          <div className={styles.pdfWrap}>
            <iframe
              src={logic.contract.url}
              title="contract-pdf"
              style={{ width: "100%", height: "100%", border: 0 }}
            />
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default StaffContract;
