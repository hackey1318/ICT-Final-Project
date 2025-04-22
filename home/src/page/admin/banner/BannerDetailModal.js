import React from "react";

export default function BannerDetailModal ({ banner, onClose }) {
    if (!banner) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-[400px]">
                <h3 className="text-lg font-bold mb-4">배너 상세</h3>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="font-medium">제목:</span>
                        <span>{banner.title}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">타입:</span>
                        <span>{banner.type}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">링크 URL:</span>
                        <span>{banner.linkUrl}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">시작일:</span>
                        <span>{banner.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">종료일:</span>
                        <span>{banner.endDate}</span>
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 border rounded">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};
