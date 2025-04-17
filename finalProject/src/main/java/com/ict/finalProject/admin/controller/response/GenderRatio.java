package com.ict.finalProject.admin.controller.response;

import com.ict.finalProject.domain.constant.UserGender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenderRatio {
//    private UserGender userGender;
    private Long male;
    private Long female;
    private Long totalPerson; //총인원수
    private Double maleRatio; //남성비율
    private Double femaleRatio; //여성비율
}
