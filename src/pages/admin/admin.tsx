import { useAuth } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Ficha {
    id: number
    userId: string;
    charName: string;
    age: string;
    year: string;
    status: 'pending' | 'approved' | 'declined';
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

    const colorsCircle = {
        pending:  "bg-yellow-300", 
        approved: "bg-green-300", 
        declined: "bg-red-300", 
    }

    const colorText = {
        pending:  "text-yellow-300", 
        approved: "text-green-300", 
        declined: "text-red-300", 
    }

    if (loading || fetchingFichas) {
        return <div className="text-center mt-12 text-primary font-bold">Carregando...</div>;
    }

    return (
        <div>
            <div className="flex flex-row flex-wrap justify-center items-center gap-6 mx-auto my-24 bg-background px-4">
                {fichas && fichas.length > 0 ? (
                    fichas.map((ficha: Ficha) => (
                        <button onClick={() => goToFicha(ficha.userId)} key={ficha.id} className="flex flex-col items-center justify-between bg-black/50 backdrop-blur-xl rounded-xl shadow-xl shadow-black/40 p-12 my-2 hover:bg-black/70 hover:scale-105 hover:shadow-2xl transition-all duration-300 max-w-sm">
                            <h1 className="text-primary font-bold font-title text-lg">
                                {getDiscordUser(ficha.userId)?.globalName || "..."} (@{getDiscordUser(ficha.userId)?.username || "..."})
                            </h1>
                            <p className="text-secondary font-bold font-title text-md">
                                {ficha.charName}, {ficha.age} anos, {ficha.year}º ano.
                            </p>
                            <div className="flex flex-row items-center justify-center w-full">
                                <div className={`w-2 h-2 ${colorsCircle[ficha.status]} rounded-full flex items-center justify-center shadow-lg shadow-black`} />

                                <h1 className={`text-md font-title font-bold ${colorText[ficha.status]} text-shadow-lg text-shadow-black/50 m-2`}>
                                    Status: {ficha.status == 'pending' ? 'Em espera' : ficha.status == 'approved' ? 'Aprovado' : 'Recusado'}
                                </h1>
                            </div>
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
