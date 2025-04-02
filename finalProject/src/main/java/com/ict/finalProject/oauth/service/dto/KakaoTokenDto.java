package com.ict.finalProject.testCode;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KakaoTokenDto {

    @NotNull(message = "accessToken may not be null")
    @JsonProperty("access_token")
    private String accessToken;
}
