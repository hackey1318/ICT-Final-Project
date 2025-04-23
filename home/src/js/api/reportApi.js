import apiClient from "../public/axiosConfig";

export const createReport = async (reportData) => {
    try {
      // 백엔드 /report/reportUser 가 받을 DTO 형식에 맞춰 데이터 전송
      // 이전 논의된 ReportCreateRequestDto (targetType, targetContentId, category, content) 기준
      const response = await apiClient.post('/report/reportUser', reportData);
  
      // 백엔드 응답이 SuccessOfFailResponse 라고 가정
      if (response.data && response.data.result === true) {
        return response.data; // 성공 시 응답 데이터 반환
      } else {
        // 백엔드에서 실패 메시지를 보냈을 경우
        throw new Error(response.data?.message || '신고 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error creating report:', error);
      // Axios 에러 처리 (서버 응답 에러 또는 네트워크 에러 등)
      const message = error.response?.data?.message // 서버 응답 에러 메시지
                     || error.message            // 일반 에러 메시지
                     || '신고 처리 중 오류가 발생했습니다.'; // 기본 메시지
      throw new Error(message);
    }
  };