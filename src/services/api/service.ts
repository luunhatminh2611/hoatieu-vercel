import { api } from "../apiClient";

export const servicePriceService = {

  getAllServicePrices: async (query = {}) => {
    try {
      const response = await api.get("/service-price", query);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bảng giá dịch vụ:", error);
      throw error;
    }
  },

  createServicePrice: async (serviceData) => {
    try {
      const response = await api.post("/service-price", serviceData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo bảng giá dịch vụ:", error);
      throw error;
    }
  },

  deleteService: async (serviceId) => {
    try {
      const response = await api.delete(`/service-price/${serviceId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa văn bản:", error);
      throw error;
    }
  },


  getFileUrl: (fileName) => {
    if (!fileName) return null;
    return `${import.meta.env.VITE_API_BASE_URL}/file/${fileName}`;
  },
};

export default servicePriceService;
