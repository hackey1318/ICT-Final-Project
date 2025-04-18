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

      
      console.log(json);
      console.log(json.orderId);

      // 결제 성공 비즈니스 로직을 구현하세요.
      // 결과창으로 이동시키는 부분
      window.location.href = `/payment/result?orderNumber=${json.orderId}&totalPrice=${json.totalAmount}&paymentKey=${json.paymentKey}`;
    }
    confirm();
  }, []);
}

export default SuccessPage;