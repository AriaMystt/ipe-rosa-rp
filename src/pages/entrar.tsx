import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Entrar() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && user) {
            navigate('/perfil', { replace: true });
        }
        if (!loading && !user) {
            navigate('/auth/discord', { replace: true });
        }
    }, [user, loading, navigate]);

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
                            onClick={logout}
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

export default Entrar;