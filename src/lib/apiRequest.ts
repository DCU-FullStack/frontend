export const apiRequest = async (method: string, endpoint: string, data?: any) => {
  const baseUrl = 'http://localhost:3000';
  const url = `${baseUrl}${endpoint}`;
  
  // localStorage에서 토큰 가져오기
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed: ${method} ${url}`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response;
  } catch (error: any) {
    console.error(`API request error: ${method} ${url}`, error);
    throw new Error(`API request error: ${error.message}`);
  }
}; 