import { useEffect, useState } from 'react';

interface DiscordUser {
    id: string;
    username: string;
    avatar: string | null;
    avatarUrl: string;
}

function Participar() {
    const [user, setUser] = useState<DiscordUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/me', { credentials: 'include' })
            .then((res) => res.json())
            .then((data: { user: DiscordUser | null }) => setUser(data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = async () => {
        await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
        setUser(null);
    };

    return (
        <div>
            <div className="flex flex-col items-center justify-between mx-auto pb-24">
                {loading ? (
                    <div className="mt-8">Carregando...</div>
                ) : user ? (
                    <div className="flex flex-col items-center gap-4 mt-8">
                        <img
                            src={user.avatarUrl}
                            alt={user.username}
                            className="w-20 h-20 rounded-full border-2 border-primary"
                        />
                        <p className="font-body font-bold">{user.username}</p>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 bg-primary text-white font-body font-bold rounded-2xl hover:bg-accent hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out"
                        >
                            Sair
                        </button>
                    </div>
                ) : (
                    <a
                        href="/auth/discord"
                        className="px-6 py-3 bg-primary text-white font-body font-bold rounded-2xl hover:bg-accent hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out mt-8"
                    >
                        Logar com Discord
                    </a>
                )}
            </div>
        </div>
    );
};

export default Participar;