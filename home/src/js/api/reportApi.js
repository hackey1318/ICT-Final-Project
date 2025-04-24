import apiClient from "../public/axiosConfig";

export const createReport = async (reportData) => {
    try {
      const response = await apiClient.post('/report/reportUser', reportData);
  
      if (response.data && response.data.result === true) {
        return response.data; 
      } else {
        throw new Error(response.data?.message || '신고 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error creating report:', error);
      const message = error.response?.data?.message 
                     || error.message           
                     || '신고 처리 중 오류가 발생했습니다.'; 
      throw new Error(message);
    }
  };
  