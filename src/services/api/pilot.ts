import { he } from "date-fns/locale";
import { api } from "../apiClient";

export const userService = {

    getAllUsers: async (params = {}) => {
        try {
            const response = await api.get("/user", params);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách user:", error);
            throw error;
        }
    },

    registerUser: async (userData) => {
        try {
            const response = await api.post(
                "/user",
                userData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tạo user:", error);
            throw error;
        }
    },

    /**
     * Cập nhật user (có thể kèm file)
     */
    updateUser: async (userData) => {
        try {
            const response = await api.put(
                "/user",
                userData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật user:", error);
            throw error;
        }
    },

    banUser: async (userData) => {
        try {
            const response = await api.put("/user/status", userData);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi ban user:", error);
            throw error;
        }
    },

    getUserDetail: async () => {
        const token = localStorage.getItem("clinic_auth_token");
        try {
            const response = await api.get(`/user/my-profile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa văn bản:", error);
            throw error;
        }
    },

    getFileUrl: (fileName) => {
        if (!fileName) return null;
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        // Debug log (xóa sau khi fix)
        console.log("Base URL:", baseUrl);
        console.log("File key:", fileName);

        // Đảm bảo baseUrl tồn tại
        if (!baseUrl) {
            console.error("VITE_API_BASE_URL is not defined");
            return null;
        }

        return `${baseUrl}/file?fileKey=${fileName}`;
    },


    getAllRanks: async () => {
        try {
            const response = await api.get("/rank/true");
            return response.data.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách rank:", error);
            throw error;
        }
    },


    createRank: async (rankData) => {
        try {
            const response = await api.post("/rank", rankData);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tạo rank:", error);
            throw error;
        }
    },

    deleteRank: async (rankId) => {
        try {
            const response = await api.delete(`/rank/${rankId}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa rank:", error);
            throw error;
        }
    },
};

export default userService;