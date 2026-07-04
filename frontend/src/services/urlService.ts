import api from "./api";

export const createShortUrl = async (payload: {
  original_url: string;
  custom_alias?: string;
  password?: string;
  expires_at?: string;
}) => {
  const token = localStorage.getItem("token");

  const response = await api.post("/url/create", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getMyLinks = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get("/url/my-links", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.links;
};

export const deleteLink = async (id: number) => {
  const token = localStorage.getItem("token");

  const response = await api.delete(`/url/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};