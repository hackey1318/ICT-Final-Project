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

  //신고 리스트
  export const getReportList = async (page=0, size) => {
    try {
      const response = await apiClient.get(`/report/getReports?page=${page}&size=${size}`, {
        params: {
          page: page,
          size: size
        }
      });
  
      // 백엔드 응답 형식이 Spring Page<> 객체와 유사하다고 가정
      if (response.data) {
         console.log("Report list fetched:", response.data);
         return response.data; 
      } else {
         throw new Error('신고 목록 데이터를 가져오지 못했습니다.');
      }
    } catch (error) {
      console.error('Error fetching report list:', error);
      const message = error.response?.data?.message || error.message || '신고 목록 조회 중 오류 발생';
      throw new Error(message);
    }
  };
  
  // 신고 상세 정보
  export const getReportByNo = async (no) => {
      try {
          const response = await apiClient.get(`/report/getReportBy/${no}`); 
          if (response.data) {
              return response.data;
          } else {
              throw new Error('신고 상세 정보를 가져오지 못했습니다.');
          }
      } catch (error) {
          console.error(`Error fetching report detail for ID ${no}:`, error);
          const message = error.response?.data?.message || error.message || '신고 상세 정보 조회 중 오류 발생';
          throw new Error(message);
      }
  };
  
  // 신고 상태 변경
  export const updateReportStatus = async (reportNo, status) => {
    try {
      const endpoint = status === 'ACCEPTED' ? 'accept' : 'reject';
      const response = await apiClient.put(`/report/${reportNo}/${endpoint}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating report status for ID ${reportNo}:`, error);
      const message = error.response?.data?.message || error.message || '신고 상태 변경 중 오류 발생';
      throw new Error(message);
    }
  }

  //신고자 목록
  export const getReporterList = async (page=0, size=9) => {
    try {
          const response = await apiClient.get(`/report/getReporters`, {
              params: {
                  page: page,
                  size: size
              }
          });
          return response.data;
      } catch (error) {
          throw new Error(error.response?.data?.message || 'Failed to fetch reporters list');
      }
  }
  
  //신고자 신고목록
  export const getReporterReports = async (reporterNo) => {
    try {
        console.log('Calling getReporterReports for userNo:', reporterNo);
        const response = await apiClient.get(`/report/getReporters/${reporterNo}`);
        console.log('getReporterReports response:', response.data);
        return response.data;
    } catch (error) {
        console.error('getReporterReports error:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch reporter reports');
    }
  };
