package com.ict.finalProject.banner.repository;

import com.ict.finalProject.banner.repository.constant.BannerType;
import com.ict.finalProject.banner.repository.domain.Banners;
import com.ict.finalProject.domain.constant.StatusInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BannersRepository extends JpaRepository<Banners, Integer> {

    @Query("SELECT b FROM Banners AS b WHERE type in (:typeList)")
    Page<Banners> getBannerList(@Param("typeList")List<BannerType> typeList, Pageable pageable);

    @Query("SELECT b FROM Banners AS b WHERE type in (:typeList) AND status = :status")
    List<Banners> getActiveBannerList(@Param("typeList")List<BannerType> typeList, @Param("status") StatusInfo statusInfo);

    Optional<Banners> findByNo(int no);
}
