// src/pages/Member/ManageFavoriteListing/useFavoriteListings.js
import { useEffect, useMemo, useState } from "react";
// giả định có service favorites
// import { fetchFavorites, toggleFavorite, openChatToSeller } from "@services/favorite.service";

const fakeFetch = async ({ page, pageSize, q }) => {
    // mock tạm; bạn thay bằng API thực tế
    const total = 100;
    const list = Array.from({ length: pageSize }).map((_, i) => {
        const id = (page - 1) * pageSize + i + 1;
        return {
            id,
            title: `Tin #${id} – Yamaha Mio 110`,
            priceFormatted: "6.700.000 đ",
            sellerType: "Cá Nhân",
            location: "Quận Tân Phú",
            timeAgo: "1 tuần trước",
            isPriority: id % 3 === 0,
            mediaCount: 6,
            thumbnailUrl: "https://picsum.photos/seed/" + id + "/280/200",
        };
    });
    await new Promise(r => setTimeout(r, 400));
    return { list, total };
};

export default function useFavoriteListings() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState("");
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

    const params = useMemo(
        () => ({ page: pagination.current, pageSize: pagination.pageSize, q: query }),
        [pagination.current, pagination.pageSize, query]
    );

    const load = async () => {
        setLoading(true);
        try {
            const { list, total } = await fakeFetch(params);
            setItems(list);
            setPagination(p => ({ ...p, total }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.page, params.pageSize, params.q]);

    const onChangeTable = ({ page, pageSize }) =>
        setPagination(p => ({ ...p, current: page, pageSize }));

    const onToggleFavorite = async (item) => {
        // await toggleFavorite(item.id);
        load();
    };

    const onChat = (item) => {
        // openChatToSeller(item.sellerId);
        console.log("chat to seller of", item.id);
    };

    return {
        loading,
        items,
        pagination,
        onChangeTable,
        query,
        setQuery,
        onToggleFavorite,
        onChat,
    };
}
