import { Modal, Spin, Card, Form, Row, Col, Divider } from "antd";
import SectionMedia from "@components/SectionMedia";
import SectionDetailVehicle from "@components/SectionDetailVehicle";
import SectionDetailBattery from "@components/SectionDetailBattery";
import SectionTitleDesc from "@components/SectionTitleDesc";
import AddressField from "@components/AddressField";
import CategoryBrandModel from "@components/CategoryBrandModel";
import YearColorFields from "@components/YearColorFields";
import CreateListingFooter from "@components/CreateListingFooter";
import { useListingCreate } from "@hooks/useListingCreate";
import { useAuth } from "@contexts/AuthContext";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const PAGE_WIDTH = 1200;

export default function AgreementListingModal({ open, onClose }) {
  const { user } = useAuth();
  const userId = user?.id ?? user?.accountId ?? user?.sub ?? null;

  const {
    form,
    msg,
    contextHolder,
    loading,
    tax,
    visibility,
    isBattery,
    submitting,
    handleSubmit,
    handlePreview,
    handleDraft,
    onValuesChange,
    loadLocalDraftById,
  } = useListingCreate({ userId });

  const [params] = useSearchParams();

  useEffect(() => {
    const draftId = params.get("draftId");
    if (draftId) loadLocalDraftById?.(draftId);
  }, [params, loadLocalDraftById]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={PAGE_WIDTH + 100}
      footer={null}
      centered
      destroyOnClose
    >
      {contextHolder}

      {loading ? (
        <div style={{ padding: 40, textAlign: "center" }}>
          <Spin />
        </div>
      ) : (
        <>
          <Card
            variant="bordered"
            style={{ maxWidth: PAGE_WIDTH, margin: "0 auto" }}
          >
            <Form form={form} layout="vertical" onValuesChange={onValuesChange}>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <SectionMedia messageApi={msg} />
                </Col>
                <Col xs={24} md={16}>
                  <CategoryBrandModel form={form} tax={tax} />
                  <YearColorFields isBattery={isBattery} />
                  {isBattery ? (
                    <SectionDetailBattery />
                  ) : (
                    <SectionDetailVehicle />
                  )}
                </Col>
              </Row>

              <Divider />
              <SectionTitleDesc />
              <Divider />

              {/* <Row>
                <Col span={24}>
                  <AddressField />
                </Col>
              </Row> */}
            </Form>
          </Card>
          <CreateListingFooter
            currentMode={visibility}
            onPreview={handlePreview}
            onDraft={handleDraft}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </>
      )}
    </Modal>
  );
}
