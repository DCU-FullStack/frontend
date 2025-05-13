import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

interface LoginResponse {
    token: string;
    user: {
        id: number;
        username: string;
        email: string;
        name: string;
    };
}

interface IncidentData {
    title: string;
    detectionType: string;
    confidence: number;
    location: string;
    timestamp: string;
    camera?: {
        id: number;
        name: string;
        location: string;
    };
}

// JWT 토큰을 가져오는 함수
const getToken = () => {
    return localStorage.getItem('token');
};

// API 요청을 위한 axios 인스턴스 생성
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터 추가
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 추가
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // 토큰이 만료되었거나 유효하지 않은 경우
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await api.post<LoginResponse>('/auth/login', { username, password });
        const { token } = response.data;
        if (token) {
            localStorage.setItem('token', token);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async (userData: any) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchIncidents = async () => {
    try {
        const response = await api.get('/incidents');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createIncident = async (incidentData: IncidentData) => {
    try {
        const response = await api.post('/incidents', incidentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateIncident = async (id: number, incidentData: IncidentData) => {
    try {
        const response = await api.put(`/incidents/${id}`, incidentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteIncident = async (id: number) => {
    try {
        const response = await api.delete(`/incidents/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api; 