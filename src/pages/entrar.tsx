import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Entrar() {
    const { user, loading } = useAuth();
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && user) {
            navigate('/perfil', { replace: true });
        }
    }, [user, loading, navigate]);

    return (
        <div>
            <div className="flex flex-col items-center justify-between mx-auto pb-24">
                {loading ? (
                    <div className="mt-8">Carregando...</div>
                ) : !user ? (
                    <a
                        href="/auth/discord"
                        className="px-6 py-3 bg-primary text-white font-body font-bold rounded-2xl hover:bg-accent hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out mt-8"
                    >
                        Logar com Discord
                    </a>
                ) : (
                    <div className="mt-8"></div>
                )}
            </div>
        </div>
    );
};

export default Entrar;