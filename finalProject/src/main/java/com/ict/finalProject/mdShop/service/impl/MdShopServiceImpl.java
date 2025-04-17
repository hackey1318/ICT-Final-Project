package com.ict.finalProject.mdShop.service.impl;

import com.ict.finalProject.domain.constant.StatusInfo;
import com.ict.finalProject.mdShop.repository.domain.Goods;
import com.ict.finalProject.mdShop.repository.MdShopRepository;
import com.ict.finalProject.mdShop.repository.domain.Goods_Stocks;
import com.ict.finalProject.mdShop.service.MdShopService;
import com.ict.finalProject.mdShop.service.dto.MdShopDto;
import com.ict.finalProject.mdShop.service.dto.MdShopInsertDto;
import com.ict.finalProject.mdShop.service.dto.MovieNameDto;
import com.ict.finalProject.movie.repository.MoviesRepository;
import com.ict.finalProject.movie.repository.domain.Movies;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MdShopServiceImpl implements MdShopService {
    private final MdShopRepository mdShopRepository;
    private final MoviesRepository moviesRepository;


    @Override
    public Page<MdShopDto> getMdList(String name, Pageable pageable) {
        List<StatusInfo> allowed = List.of(StatusInfo.ACTIVE, StatusInfo.PENDING);
        Page<Goods> goodsPage;

        if (name != null && !name.isEmpty()) {
            goodsPage = mdShopRepository.findByStatusInAndNameContaining(allowed, name, pageable);
        } else {
            goodsPage = mdShopRepository.findByStatusIn(allowed, pageable);
        }

        return goodsPage
                .map(goods -> {
                    String movieName = moviesRepository.findById(goods.getMovieNo())
                            .map(Movies::getName)
                            .orElse("영화명 없음");
                    MdShopDto dto = new MdShopDto(goods);
                    dto.setMovieName(movieName);
                    return dto;
                });
    }

    @Override
    public void insertMd(MdShopInsertDto dto) {
        Goods entity = new Goods();
        entity.setName(dto.getName());
        entity.setMovieNo(dto.getMovieNo());
        entity.setType(dto.getType());
        entity.setPrice(dto.getPrice());
        entity.setOptions(dto.getOptions());
        entity.setStatus(StatusInfo.ACTIVE);

        mdShopRepository.save(entity);
    }

    @Override
    public List<MovieNameDto> getMovieNameListByMovieSearch(String movieSearch) {
        List<Movies> moviesList = moviesRepository.findAllByNameContaining(movieSearch);
        return moviesList.stream()
                .map(MovieNameDto::new)
                .collect(Collectors.toList());
    }

    //임시로 만들었습니다.(불필요시 삭제예정)
    @Override
    public List<MovieNameDto> getMovieNameList() {
        List<Movies> moviesList = moviesRepository.findAll();

        return moviesList.stream()
                .map(MovieNameDto::new)
                .collect(Collectors.toList());

    }

    @Override
    public Optional<Goods> getMd(int id) {
        return mdShopRepository.findById(id);
    }

    @Override
    public int getMdQuantity(int id) {
        Goods_Stocks quantity = new Goods_Stocks();
        quantity = mdShopRepository.findQuantityById(id);
        return quantity.getQuantity();
    }
}
