import apiClient from '../public/axiosConfig';

export const getReviews    = movieNo =>apiClient.get(`/movies/${movieNo}/reviews`);
export const postReview    = (movieNo, data) =>apiClient.post(`/movies/${movieNo}/reviews`, data);
export const updateReview = (movieNo, reviewNo, data) =>
    apiClient.put(`/movies/${movieNo}/reviews/${reviewNo}`, data);
export const deleteReview  = (movieNo, no) =>apiClient.delete(`/movies/${movieNo}/reviews/${no}`);