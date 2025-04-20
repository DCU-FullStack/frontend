export async function apiRequest(method: string, endpoint: string, data?: any) {
  const baseUrl = process.env.VITE_API_BASE_URL || "http://localhost:3000";
  const url = `${baseUrl}${endpoint}`;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.statusText}`);
  }
  
  return response;
} 