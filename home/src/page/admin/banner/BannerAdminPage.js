import React, { useEffect, useState } from "react";
import axios from "axios";
import BannerList from "./BannerList";
import BannerFormModal from "./BannerFormModal";
import BannerDetailModal from "./BannerDetailModal";
import apiClient from "../../../js/public/axiosConfig";

const BannerAdminPage = () => {
    const [banners, setBanners] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [type, setType] = useState("ALL");
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [formMode, setFormMode] = useState("create");

    useEffect(() => {
        fetchBanners();
    }, [page, type]);

    const fetchBanners = async () => {
        try {
            const res = await apiClient.get(`/banner/${type}`, {
                params: { page, size, sort: "createdAt,desc" },
            });
            setBanners(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (no) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await apiClient.delete(`/banner/${no}`);
            fetchBanners();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (banner) => {
        setSelectedBanner(banner);
        setFormMode("edit");
        setIsFormOpen(true);
    };

    const handleDetail = (banner) => {
        setSelectedBanner(banner);
        setIsDetailOpen(true);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">배너 관리</h2>

            <div className="mb-4">
                <label className="mr-2 font-medium">배너 타입:</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="border p-1">
                    <option value="ALL">ALL</option>
                    <option value="MOVIE">MOVIE</option>
                    <option value="GOODS">GOODS</option>
                </select>
                <button
                    className="ml-4 bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => {
                        setSelectedBanner(null);
                        setFormMode("create");
                        setIsFormOpen(true);
                    }}
                >
                    배너 등록
                </button>
            </div>

            <BannerList
                banners={banners}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDetail={handleDetail}
            />

            {isFormOpen && (
                <BannerFormModal
                    mode={formMode}
                    banner={selectedBanner}
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={() => {
                        setIsFormOpen(false);
                        fetchBanners();
                    }}
                />
            )}

            {isDetailOpen && (
                <BannerDetailModal
                    banner={selectedBanner}
                    onClose={() => setIsDetailOpen(false)}
                />
            )}
        </div>
    );
};

export default BannerAdminPage;
