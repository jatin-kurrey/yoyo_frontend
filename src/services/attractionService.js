import { apiRequest, buildQuery } from "./api";

export const attractionService = {
  // Public
  listPublic(params = {}) {
    return apiRequest(`/attractions${buildQuery(params)}`);
  },

  // Admin
  adminList(params = {}) {
    return apiRequest(`/admin/attractions${buildQuery(params)}`, { auth: true });
  },

  create(data) {
    return apiRequest("/admin/attractions", {
      method: "POST",
      auth: true,
      body: data,
    });
  },

  update(id, data) {
    return apiRequest(`/admin/attractions/${id}`, {
      method: "PATCH",
      auth: true,
      body: data,
    });
  },

  delete(id) {
    return apiRequest(`/admin/attractions/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },
};
