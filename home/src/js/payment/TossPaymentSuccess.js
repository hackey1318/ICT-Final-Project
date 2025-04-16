import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
const accessToken = sessionStorage.getItem("accessToken");


function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터와 동일한지 반드시 확인하세요.
    // 클라이언트에서 결제 금액을 조작하는 행위를 방지할 수 있습니다.
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
    };

    async function confirm() {
      const response = await fetch("http://localhost:9988/payment/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        // 결제 실패 비즈니스 로직을 구현하세요.
        navigate(`/fail?message=${json.message}&code=${json.code}`);
        return;
      }

      // 결제 성공 비즈니스 로직을 구현하세요.
      // 부모 창을 이동시키는 부분 (팝업 창에서 부모 창을 제어)
      if (window.opener) {
        // window.opener.location.href = `/payment/result?orderId=${requestData.orderId}&amount=${requestData.amount}&paymentKey=${requestData.paymentKey}`; // 부모 창을 /payment/result 이동
        window.opener.location.href = `/payment/result?orderId=${requestData.orderId}&amount=${requestData.amount}`; // 부모 창을 /payment/result 이동

        window.close(); // 현재 팝업 창을 닫기
      }
    }
    confirm();
  }, []);
}

export default SuccessPage;