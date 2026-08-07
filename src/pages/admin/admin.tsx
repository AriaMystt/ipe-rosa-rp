import { useAuth } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Explicit interfaces to avoid 'any' traps
interface Ficha {
    id: number
    userId: string;
    charName: string;
    age: string;
    year: string;
}

interface DiscordUser {
    username: string;
    globalName?: string;
}

function Entrar() {
    const { user, loading } = useAuth();

    const [fichas, setFichas] = useState<Ficha[] | null>(null);
    const [fetchingFichas, setFetchingFichas] = useState<boolean>(true);
    const [discordUsers, setDiscordUsers] = useState<Record<string, DiscordUser | null>>({});

    const navigate = useNavigate();

    const goToFicha = async (id: string) => {
        navigate(`/admin/fichas/${id}`, { replace: true });
    }

    useEffect(() => {
        const fetchFichasData = async () => {
            if (!user?.id) return;
            try {
                const response = await fetch(`/api/fichas/`);
                if (response.ok) {
                    const data = await response.json();
                    setFichas(data);
                } else {
                    console.error('Server error:', response.statusText);
                }
            } catch (error) {
                console.error('Network error:', error);
            } finally {
                setFetchingFichas(false);
            }
        };

        if (user) {
            fetchFichasData();
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        const fetchDiscordUsers = async () => {
            if (!fichas?.length) return;

            const entries = await Promise.all(
                fichas.map(async (ficha) => {
                    try {
                        const res = await fetch(`/api/discord-user/${ficha.userId}`);
                        if (!res.ok) throw new Error('Failed to fetch');
                        const data = await res.json();
                        return [ficha.userId, data as DiscordUser] as const;
                    } catch (error) {
                        console.error('Network error:', error);
                        return [ficha.userId, null] as const;
                    }
                })
            );

            setDiscordUsers(Object.fromEntries(entries));
        };

        fetchDiscordUsers();
    }, [fichas]);

    const getDiscordUser = (userId: string) => {
        return discordUsers[userId] ?? null;
    };

    if (loading || fetchingFichas) {
        return <div className="text-center mt-12 text-primary font-bold">Carregando...</div>;
    }

    return (
        <div>
            <div className="flex flex-col items-center justify-center mx-auto my-24 bg-background">
                {fichas && fichas.length > 0 ? (
                    fichas.map((ficha: Ficha) => (
                        // Added key attribute and conditional optional chaining check
                        <button onClick={() => goToFicha(ficha.userId)} key={ficha.id} className="flex flex-col items-center justify-between bg-black/50 backdrop-blur-xl rounded-xl shadow-xl shadow-black/40 p-12 my-2 hover:bg-black/70 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                            <h1 className="text-primary font-bold font-title text-lg">
                                {getDiscordUser(ficha.userId)?.globalName || "..."} (@{getDiscordUser(ficha.userId)?.username || "..."})
                            </h1>
                            <p className="text-secondary font-bold font-title text-md">
                                {ficha.charName}, {ficha.age} anos, {ficha.year}º ano.
                            </p>
                        </button>
                    ))
                ) : (
                    <div className="flex flex-col items-center gap-4 mt-8">
                        Nenhuma ficha encontrada.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Entrar;
