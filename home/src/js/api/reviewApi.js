import apiClient from '../public/axiosConfig';

export const getReviews = movieNo => apiClient.get(`/movie/${movieNo}/reviews`);
export const postReview = data => apiClient.post('/movie/reviewWrite', data);
export const updateReview = data => apiClient.put('/movie/reviewUpdate', data);
export const deleteReview = no => apiClient.delete(`/movie/reviewDel/${no}`);