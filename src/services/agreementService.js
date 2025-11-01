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
}