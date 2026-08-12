import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface Ficha {
    id: number
    userId: string;
    charName: string;
    ethnicity: string;
    age: string;
    year: string;
    lore: string;
    type: string;
    personality: string;
    status: 'pending' | 'approved' | 'declined';
}

function Perfil() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    const [ficha, setFicha] = useState<Ficha | null>(null);
    const [fetchingFicha, setFetchingFicha] = useState<boolean>(true);

    const [currentTime] = useState<Date>(new Date());
    const currentHour: number = currentTime.getHours();
    const greetingsMessage: string = 
        currentHour < 6 ? "Boa madrugada, " : 
        currentHour < 12 ? "Bom dia, " : 
        currentHour < 18 ? "Boa tarde, " : 
        currentHour <= 23 ? "Boa noite, " : "Olá! ";

    useEffect(() => {
        if (!loading && !user) {
            navigate('/entrar', { replace: true });
            return;
        }

        const fetchFichaData = async () => {
            if (!user?.id) return;

            try {
                const response = await fetch(`/api/ficha/${user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFicha(data);
                    console.log(data)
                } else {
                    console.error('Server error:', response.statusText);
                }
            } catch (error) {
                console.error('Network error:', error);
            } finally {
                setFetchingFicha(false);
            }
        };

        if (user) {
            fetchFichaData();
        }
    }, [user, loading, navigate]);

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

    if (loading || fetchingFicha) {
        return <div className="text-center mt-12 text-primary font-bold">Carregando...</div>;
    }

    return (
        <div>
            <div className="flex flex-col items-center justify-between mx-auto pb-24">
                {user ? (
                    <div className="flex flex-col items-center justify-center gap-4 mt-8">
                        <div className="flex flex-row items-center justify-around gap-8">
                            <img
                                src={user.avatarUrl}
                                alt={user.username}
                                className="w-20 h-20 rounded-full border-2 border-primary"
                            />
                            <p className="text-xl md:text-2xl text-primary text-center font-title font-bold">
                                {greetingsMessage} {ficha ? ficha.charName : user.username}
                            </p>
                            <button
                                onClick={logout}
                                className="text-center px-16 py-3 bg-primary text-white font-body font-bold rounded-2xl hover:bg-accent hover:shadow-xl hover:scale-102 transition-all duration-300 ease-out"
                            >
                                Sair
                            </button>
                        </div>

                        <div className="flex flex-col items-center justify-center w-screen min-h-screen py-8 px-4 md:px-48">
                            {ficha ? (
                                <div className="flex flex-col items-center justify-center w-screen min-h-screen py-8 px-4 md:px-48">
                                    <div className="flex flex-row items-center justify-center w-screen">
                                        <div className={`w-4 h-4 ${colorsCircle[ficha.status]} rounded-full flex items-center justify-center shadow-lg shadow-black`} />

                                        <h1 className={`text-3xl md:text-4xl font-title font-bold ${colorText[ficha.status]} backdrop-blur-2xl text-shadow-lg text-shadow-black/50 m-4 py-2 px-4`}>
                                            Status: {ficha.status == 'pending' ? 'Em espera' : ficha.status == 'approved' ? 'Aprovado' : 'Recusado'}
                                        </h1>
                                    </div>

                                    <div className="flex flex-col items-center justify-center text-left w-full h-full bg-stone-100 px-4 py-6 md:px-12 md:py-18 shadow-xl shadow-black bg-[url('/src/assets/images/paperTexture2.jpg')] bg-auto bg-center bg-repeat">
                                        <h1 className="text-3xl md:text-6xl w-full text-left font-title font-bold text-background md:mb-8">
                                            Ficha pessoal de {ficha.charName}
                                        </h1>
                                        <p className="text-md md:text-lg font-body w-full text-left text-black mb-4 md:mb-8">
                                            Nome: {ficha.charName}
                                        </p>
                                        <p className="text-md md:text-lg font-body w-full text-left text-black mb-4 md:mb-8">
                                            Idade: {ficha.age}
                                        </p>
                                        <p className="text-md md:text-lg font-body w-full text-left text-black mb-4 md:mb-8">
                                            Etnia: {ficha.ethnicity}
                                        </p>
                                        <p className="text-md md:text-lg font-body w-full text-left text-black mb-4 md:mb-8">
                                            Ano escolar: {ficha.year}
                                        </p>
                                        <p className="text-md md:text-lg font-body w-full text-left text-black mb-4 md:mb-8">
                                            Historia: {ficha.lore}
                                        </p>
                                        <p className="text-md md:text-lg font-body w-full text-left text-black mb-4 md:mb-8">
                                            Tipo de aluno: {ficha.type}
                                        </p>
                                        <p className="text-md md:text-lg font-body w-full text-left text-black mb-4 md:mb-8">
                                            Personalidade: {ficha.personality}
                                        </p>
                                    </div>
                                    <Link
                                        to="/ficha"
                                        className="text-center px-16 py-3 mt-16 bg-primary text-white font-body font-bold rounded-2xl hover:bg-accent hover:shadow-xl hover:scale-102 transition-all duration-300 ease-out"
                                    >
                                        Editar ficha
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-4 mt-8">
                                    <p className="text-xl md:text-2xl text-primary text-center font-title font-bold">
                                        Você ainda não possui uma ficha, que tal fazer uma?
                                    </p>
                                    <Link
                                        to="/ficha"
                                        className="text-center px-16 py-3 bg-primary text-white font-body font-bold rounded-2xl hover:bg-accent hover:shadow-xl hover:scale-102 transition-all duration-300 ease-out"
                                    >
                                        Criar ficha
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <a
                        href="/auth/discord"
                        className="text-center px-16 py-3 bg-primary text-white font-body font-bold rounded-2xl hover:bg-accent hover:shadow-xl hover:scale-102 transition-all duration-300 ease-out"
                    >
                        Logar com Discord
                    </a>
                )}
            </div>
        </div>
    );
}

export default Perfil;