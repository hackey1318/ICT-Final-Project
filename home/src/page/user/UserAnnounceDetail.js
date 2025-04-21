import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const BASE_URL = 'http://localhost:9988'; // Spring 서버 주소
const accessToken = sessionStorage.getItem("accessToken");

export default function UserAnnounceDetail() {
    const { id } = useParams();
    const [announce, setAnnounce] = useState(null);

    useEffect(() => {
        const getAnnouncementById = async (id) => {
            const config = accessToken
                ? {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
                : {};
            const res = await axios.get(`${BASE_URL}/announce/${id}`, config);
            setAnnounce(res.data);
        };
        getAnnouncementById(id);
    }, [id]);

    if (!announce) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <h3>{announce.title}</h3>
            <p className="text-muted">{new Date(announce.createdAt).toLocaleString()}</p>
            <hr />
            <p>{announce.content}</p>
            <Link to="/announcements" className="btn btn-secondary mt-3">← 목록으로</Link>
        </div>
    );
}