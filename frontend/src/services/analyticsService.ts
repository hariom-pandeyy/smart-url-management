import api from "./api";

export const getLinkAnalytics = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await api.get(`/url/${id}/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};