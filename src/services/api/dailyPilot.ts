import { api } from "../apiClient";

export const pilotPlanService = {
    getAllPlans: async (query = {}) => {
        try {
            const response = await api.get("/daily-pilot", query);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách kế hoạch hoa tiêu:", error);
            throw error;
        }
    },

    getPlanById: async (id) => {
        try {
            const response = await api.get(`/daily-pilot/${id}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết kế hoạch:", error);
            throw error;
        }
    },

    getPlanInfo: async (id) => {
        try {
            const response = await api.get(`/daily-pilot/info/${id}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin kế hoạch (info):", error);
            throw error;
        }
    },

    createPlan: async (planData) => {
        try {
            const response = await api.post("/daily-pilot", planData);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tạo kế hoạch hoa tiêu:", error);
            throw error;
        }
    },

    updatePlan: async (planData) => {
        try {
            const response = await api.put("/daily-pilot", planData);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật kế hoạch hoa tiêu:", error);
            throw error;
        }
    },

    deletePlan: async (id) => {
        try {
            const response = await api.delete(`/daily-pilot/${id}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa kế hoạch hoa tiêu:", error);
            throw error;
        }
    },

    createPilotAssignment: async (assignmentData) => {
        try {
            const response = await api.post("/pilot-assignment", assignmentData);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tạo phân công hoa tiêu:", error);
            throw error;
        }
    },

    getPilotAssignments: async (params: {
        dailyPilotPlanId?: string;
        page?: number;
        limit?: number;
        keyword?: string;
        status?: string;
        sort?: string;
        sortBy?: string;
        userId?: string;
        startDate?: string;
        endDate?: string;
    }) => {
        try {
            const response = await api.get("/pilot-assignment", params);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phân công:", error);
            throw error;
        }
    },

    deletePilotAssignment: async (assignmentId) => {
        try {
            const response = await api.delete(`/pilot-assignment/${assignmentId}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa phân công:", error);
            throw error;
        }
    },

    getForPilotAssignments: async (params = {}) => {
        const token = localStorage.getItem("clinic_auth_token");
        const response = await api.get("/pilot-assignment", params, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    getAssignmentDetail: async (assignmentId) => {
        try {
            const response = await api.get(`/pilot-assignment/${assignmentId}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa phân công:", error);
            throw error;
        }
    },

    getPilotHistory: async (params) => {
        const res = await api.get("/pilot-assignment/history", params);
        return res.data;
    },

    assignTask: async (data) => {
        try {
            const response = await api.post("/pilot-assignment/ass", data);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xác nhận/từ chối nhiệm vụ:", error);
            throw error;
        }
    },

    updateAssignmentStatus: async (data) => {
        const response = await api.post('/pilot-assignment/ass', data);
        return response.data;
    }
};

export default pilotPlanService;
