import api from "@utils/apiCaller";

export const getAgreementByRequestId = async (requestId) => {
  const res = await api.get(`/api/agreements/request/${requestId}`);
  return res.data;
};

export const extendAgreement = async (id, duration) => {
  const res = await api.put(`/api/agreements/extend/${id}`, null, {
    params: { duration },
  });
  return res.data;
};

export const cancelAgreement = async (id) => {
  const res = await api.put(`/api/agreements/cancel/${id}`, {});
  return res.data;
};

export const viewContractFile = async (fileUrl) => {
  const res = await api.get(fileUrl, { responseType: "blob" });
  return res.data;
};

//Manager
export const getManagerAgreement = async () => {
  const res = await api.get(`/api/manager/agreements/all`);
  return res.data;
};

export const searchManagerAgreementsByPhone = async (phone) => {
  const res = await api.get(`/api/manager/agreements/search`, {
    params: { phone },
  });
  return res.data;
};

export const getSettlementByAgreementId = async (agreementId) => {
  const { data } = await api.get(`/api/consignment_settlement/${agreementId}`);
  return data;
};

export const setSettlementPayout = async (settlementId, file) => {
  const form = new FormData();
  if (file) form.append("images", file);

  const { data: res } = await api.put(
    `/api/consignment_settlement/${settlementId}`,
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res;
};
