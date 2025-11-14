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
import { mapMediaToUploadFormat, debugMediaMapping } from "@utils/mediaUtils";

const PAGE_WIDTH = 1200;

export default function AgreementListingCreate({
  open,
  onClose,
  consignmentData = null,
  mode = "agreement", // "agreement" (create) hoặc "agreement-update" (update)
}) {
  const { user } = useAuth();
  const userId = Number(user?.uid) || null;
  const isUpdateMode = mode === "agreement-update";

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
    images,
    setImages,
    videos,
    setVideos,
  } = useListingCreate({
    userId,
    currentListingId: isUpdateMode ? consignmentData?.id || null : null,
  });

  const [params] = useSearchParams();

  useEffect(() => {
    const draftId = params.get("draftId");
    if (draftId) loadLocalDraftById?.(draftId);
  }, [params, loadLocalDraftById]);

  useEffect(() => {
    if (!consignmentData || !form) return;

    const initValues = {
      id: consignmentData.id || null,
      category: consignmentData.categoryId,
      brand: consignmentData.brand,
      brand_id: consignmentData.brandId,
      model: consignmentData.model,
      model_id: consignmentData.modelId,
      year: consignmentData.year,
      color: consignmentData.color || "",
      mileage_km: consignmentData.mileageKm,
      soh_percent: consignmentData.sohPercent,
      battery_capacity_kwh: consignmentData.batteryCapacityKwh,
      price:
        consignmentData.acceptablePrice ||
        consignmentData.ownerExpectedPrice ||
        consignmentData.price ||
        0,
      ownerExpectedPrice: consignmentData.ownerExpectedPrice || 0,
      preferredBranchName: consignmentData.preferredBranchName,
      preferredBranchId: consignmentData.preferredBranchId,
      responsibleStaffId: userId,
      item_type: consignmentData.itemType || "VEHICLE",
      visibility: consignmentData.visibility || "NORMAL",
      status: "PENDING",
      dimension: consignmentData.dimensionsMm || "",
      weight_kg: consignmentData.massKg || 0,
      chemistry: consignmentData.batteryChemistry || "",
      voltage: consignmentData.voltageV || 0,
      title: consignmentData.title || "",
      description: consignmentData.description || "",
      province: consignmentData.province || "",
      district: consignmentData.district || "",
      ward: consignmentData.ward || "",
      address: consignmentData.address || "",
      post_type: consignmentData.postType || "NORMAL",
      consignmentAgreementId:
        consignmentData.agreementId ||
        consignmentData.agreementRequestId ||
        null,
      branchId:
        consignmentData.branchId || consignmentData.preferredBranchId || null,
    };

    const media = consignmentData.media || [];
    debugMediaMapping(media);

    const mappedImages = mapMediaToUploadFormat(media, "IMAGE");
    const mappedVideos = mapMediaToUploadFormat(media, "VIDEO");

    initValues.images = mappedImages;
    initValues.videos = mappedVideos;

    setImages(mappedImages);
    setVideos(mappedVideos);

    form.setFieldsValue(initValues);
  }, [consignmentData, form, userId, setImages, setVideos]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      width={PAGE_WIDTH + 100}
      footer={null}
      centered
      destroyOnHidden
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
              <Form.Item name="consignmentAgreementId" hidden>
                <input type="hidden" />
              </Form.Item>
              <Form.Item name="responsibleStaffId" hidden>
                <input type="hidden" />
              </Form.Item>
              <Form.Item name="branchId" hidden>
                <input type="hidden" />
              </Form.Item>

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
                    <SectionDetailVehicle mode="agreement-update"/>
                  )}
                </Col>
              </Row>

              <Divider />
              <SectionTitleDesc />
              <Divider />

              {!isUpdateMode && (
                <Row>
                  <Col span={24}>
                    <AddressField />
                  </Col>
                </Row>
              )}
            </Form>
          </Card>

          <CreateListingFooter
            mode={mode}
            currentMode={visibility}
            onPreview={handlePreview}
            onDraft={handleDraft}
            onSubmit={(extra) => handleSubmit(mode, extra)}
            submitting={submitting}
          />
        </>
      )}
    </Modal>
  );
}
