package com.ict.finalProject.common.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuccessOfFailResponse {

    private boolean result;
    private String message; //오류메세지를 front단에 넘기기위해
}
