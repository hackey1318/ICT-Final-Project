package com.ict.finalProject.mdShop.repository.domain;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.mdShop.controller.request.MdshopRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "goods")
@EntityListeners(AuditingEntityListener.class)
public class Goods {

    @Id
    @Column(name = "no")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer movieNo;

    @Column(nullable = true)
    private Integer seriesNo;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private int price;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = true)//true 안넣어도 되는데...
    private String options;

    @Enumerated(value = EnumType.STRING)
    private StatusInfo status;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public void update(MdshopRequest request) {
        this.name = request.getName();
        this.movieNo = request.getMovieNo();
        this.type = request.getType();
        this.price = request.getPrice();
        this.options = request.getOptions();
        this.description = request.getDescription();
    }
}
