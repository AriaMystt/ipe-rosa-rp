import { useEffect, useState } from 'react';

export interface DiscordUser {
    id: string;
    username: string;
    avatar: string | null;
    avatarUrl: string;
}

export function useAuth() {
    const [user, setUser] = useState<DiscordUser | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = () => {
        setLoading(true);
        return fetch('/api/me', { credentials: 'include' })
            .then((res) => res.json())
            .then((data: { user: DiscordUser | null }) => setUser(data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        refresh();
    }, []);

    const logout = async () => {
        await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
        setUser(null);
        location.reload()
    };

    return { user, loading, logout, refresh };
}