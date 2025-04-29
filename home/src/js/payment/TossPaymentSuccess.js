import apiClient from "./apiClient"; // apiClient 가져오기
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
      try {
        // 결제 확인 요청
        const response = await apiClient.post("/payment/confirm", requestData);

        if (response.status !== 200) {
          // 결제 실패 비즈니스 로직을 구현하세요.
          navigate(`/fail?message=${response.data.message}&code=${response.data.code}`);
          // PEDNING인 주문 FAILED로 변경
          await apiClient.post(
            "/order/fail",
            { orderNumber: response.data.orderId }
          );
          return;
        }

        console.log(response.data);

        // 결제 성공 비즈니스 로직을 구현하세요.

        // PENDING인 장바구니 상품들 PAID로 변경
        const paidGoodsResponse = await apiClient.post(
          "/cart/paidGoods",
          { orderNumber: response.data.orderId }
        );

        if (paidGoodsResponse.status !== 200) {
          alert("paidGoodsResponse Error");
          console.log(paidGoodsResponse);
          return;
        }

        // 상품 수량 업데이트
        const updateItemQuantityResponse = await apiClient.post(
          "/md-shop/updateItemQuantity",
          { orderNumber: response.data.orderId }
        );

        if (updateItemQuantityResponse.status !== 200) {
          alert("updateItemQuantityResponse Error");
          console.log(updateItemQuantityResponse);
          return;
        }

        // 결과창으로 이동시키는 부분
        window.location.href = `/payment/result?orderNumber=${response.data.orderId}&totalPrice=${response.data.totalAmount}&paymentKey=${response.data.paymentKey}`;
      } catch (error) {
        console.error("결제 확인 요청 실패:", error);
        navigate(`/fail?message=${error.message}&code=${error.code}`);
      }
    }

    confirm();
  }, []);

  return null; // 성공 페이지는 로딩만 하고 UI는 필요없으므로 null을 반환합니다.
}

export default SuccessPage;
