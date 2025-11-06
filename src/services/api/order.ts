import { api } from "../apiClient";

export const orderService = {

  getAllOrders: async (params = {}) => {
    try {
      const response = await api.get("/order", { params });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      throw error;
    }
  },

  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await api.post("/order", orderData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put("/order/status", { orderId, status });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      throw error;
    }
  },
};

export default orderService;