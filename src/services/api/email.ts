import { api } from "../apiClient";

export const emailService = {
    getEmail: async () => {
        try {
            const response = await api.get("/email");
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy email:", error);
            throw error;
        }
    },

    updateEmail: async (emailData) => {
        try {
            const response = await api.post("/email", emailData, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật email:", error);
            throw error;
        }
    },

    deleteEmail: async (id) => {
        try {
            const response = await api.delete(`/email/${id}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa mail:", error);
            throw error;
        }
    },
}

export default emailService;
