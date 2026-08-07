import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

interface Ficha {
    id: number
    userId: string;
    charName: string;
    ethnicity: string;
    connections: string;
    age: string;
    year: string;
    lore: string;
    type: string;
    personality: string;
    status: 'pending' | 'approved' | 'declined';
}

type RouteParams = {
  id: string;
};

interface DiscordUser {
    username: string;
    globalName?: string;
}

function Perfil() {
    const navigate = useNavigate();
    const { id } = useParams<RouteParams>();

    const [ficha, setFicha] = useState<Ficha | null>(null);
    const [fetchingFicha, setFetchingFicha] = useState<boolean>(true);
    const [discordUser, setDiscordUser] = useState<DiscordUser | null>(null);

    const { register, handleSubmit, formState: { isValid } } = useForm({
        mode: 'onChange',
        values: ficha || undefined,
        defaultValues: {
            year: "1"
        }
    });

    useEffect(() => {
        const fetchFichaData = async () => {
            if (!id) return;

            try {
                const response = await fetch(`/api/ficha/${id}`);
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

        const fetchDiscordUser = async () => {
            if (!id) return;

            try {
                const res = await fetch(`/api/discord-user/${id}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setDiscordUser(data);
            } catch (error) {
                console.error('Network error:', error);
                setDiscordUser(null); // Keep as null instead of setting to false
            }
        };

        if (id) {
            fetchFichaData();
            fetchDiscordUser();
        }
    }, [id]);

    const onSubmit = async (data: any) => {
        if (!id || !isValid) return;

        try {
            const response = await fetch(`/api/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
                navigate('/admin', { replace: true });
            } else {
                console.error('Server error:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    const approveFicha = async (targetId: any, type: string) => {
        if (!targetId) return;
        try {
            const response = await fetch(`/api/fichas/${targetId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: `${type == 'approve' ? 'approved' : type == 'decline' ? 'declined' : 'pending'}` }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
                navigate('/admin', { replace: true });
            } else {
                console.error('Server error:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    }

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

    if (fetchingFicha) {
        return <div className="text-center mt-12 text-primary font-bold">Carregando...</div>;
    }

    return (
         <div className="flex flex-col items-center justify-center w-full min-h-screen py-8 px-4 md:px-48">
            <a href="/admin" className="text-secondary text-md md:text-lg font-title hover:text-accent transition-colors text-left min-w-full">
                ← Voltar/Cancelar
            </a>

            <h1 className="text-3xl md:text-6xl font-title font-bold text-primary">
                Ficha de {discordUser?.globalName || "..."} (@{discordUser?.username || "..."})
            </h1>
            <form id="ficha" onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center w-full min-h-screen py-8 px-4 md:px-48">
                <div className="flex flex-col items-center justify-center w-full px-4 py-6 md:px-6 md:py-8 bg-black/50 backdrop-blur-xl rounded-xl shadow-lg shadow-black/60 my-4">
                    <h1 className='text-2xl font-title text-primary font-bold'>
                        Nome do personagem
                    </h1>
                    <textarea {...register("charName", {required: true})} id="charName" rows={1} placeholder="Bob Uzumaki" className='bg-white rounded-2xl font-body text-center font-medium my-4 p-2 w-full' />
                </div>

                <div className="flex flex-col items-center justify-center w-full px-4 py-6 md:px-6 md:py-8 bg-black/50 backdrop-blur-xl rounded-xl shadow-lg shadow-black/60 my-4">
                    <h1 className='text-2xl font-title text-primary font-bold'>
                        Idade do personagem
                    </h1>
                    <textarea {...register("age", {required: true})} id="age" rows={1} placeholder="18" className='bg-white rounded-2xl font-body text-center font-medium my-4 p-2 w-full' />
                </div>

                <div className="flex flex-col items-center justify-center w-full px-4 py-6 md:px-6 md:py-8 bg-black/50 backdrop-blur-xl rounded-xl shadow-lg shadow-black/60 my-4">
                    <h1 className='text-2xl font-title text-primary font-bold'>
                        Etinia
                    </h1>
                    <textarea {...register("ethnicity", {required: true})} id="ethnicity" rows={1} placeholder="Japones" className='bg-white rounded-2xl font-body text-center font-medium my-4 p-2 w-full' />
                </div>

                <div className="flex flex-col items-center justify-center w-full px-4 py-6 md:px-6 md:py-8 bg-black/50 backdrop-blur-xl rounded-xl shadow-lg shadow-black/60 my-4">
                    <h1 className='text-2xl font-title text-primary font-bold'>
                        Ano escolar
                    </h1>
                    <select {...register("year", {required: true})} id="year" className='bg-white rounded-2xl font-body text-center font-medium my-4 p-2 w-full'>
                        <option value="1">1º</option>
                        <option value="2">2º</option>
                        <option value="3">3º</option>
                    </select>
                </div>

                <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />

                <div className="flex flex-col items-center justify-center w-full px-4 py-6 md:px-6 md:py-8 bg-black/50 backdrop-blur-xl rounded-xl shadow-lg shadow-black/60 my-4">
                    <h1 className='text-2xl font-title text-primary font-bold'>
                        Relacionamento
                    </h1>
                    <textarea {...register("connections", {required: true})} id="connections" rows={1} placeholder="Sim, Robert Uzumaki" className='bg-white rounded-2xl font-body text-center font-medium my-4 px-8 py-2 w-full' />
                </div>

                <div className="flex flex-col items-center justify-center w-full px-4 py-6 md:px-6 md:py-8 bg-black/50 backdrop-blur-xl rounded-xl shadow-lg shadow-black/60 my-4">
                    <h1 className='text-2xl font-title text-primary font-bold'>
                        História
                    </h1>
                    <textarea {...register("lore", {required: true})} id="lore" rows={8} placeholder="Bob Uzumaki é..." className='block bg-white rounded-2xl font-body text-left font-medium my-4 p-2 min-w-full' />
                </div>

                <div className="flex flex-col items-center justify-center w-full px-4 py-6 md:px-6 md:py-8 bg-black/50 backdrop-blur-xl rounded-xl shadow-lg shadow-black/60 my-4">
                    <h1 className='text-2xl font-title text-primary font-bold'>
                        Função na escola
                    </h1>
                    <textarea {...register("type", {required: true})} id="type" rows={8} placeholder="Bob Uzumaki é Encrenqueiro..." className='bg-white rounded-2xl font-body text-left font-medium my-4 p-2 min-w-full' />
                </div>

                <div className="flex flex-col items-center justify-center w-full px-4 py-6 md:px-6 md:py-8 bg-black/50 backdrop-blur-xl rounded-xl shadow-lg shadow-black/60 my-4">
                    <h1 className='text-2xl font-title text-primary font-bold'>
                        Personalidade
                    </h1>
                    <textarea {...register("personality", {required: true})} id="personality" rows={8} placeholder="Bob Uzumaki é bastante sociavel..." className='bg-white rounded-2xl font-body text-left font-medium my-4 p-2 min-w-full' />
                </div>
            </form>

            <button 
                type="submit" 
                form="ficha" 
                disabled={!id || !isValid} 
                className="disabled:bg-gray-400 disabled:text-black text-center px-16 py-3 bg-primary text-white font-body font-bold rounded-2xl enabled:hover:bg-accent enabled:hover:shadow-xl enabled:hover:scale-102 transition-all duration-300 ease-out m-auto">
                {id ? (
                    isValid ? "Atualizar Ficha" : "Preencha todos os campos antes de enviar"
                ) : "Entre para enviar ficha"}
            </button>

            <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />
            
            <div className="flex flex-row items-center justify-center w-screen">
                <div className={`w-2 h-2 ${colorsCircle[ficha?.status ?? 'pending']} rounded-full flex items-center justify-center shadow-lg shadow-black`} />

                <h1 className={`text-xl md:text-2xl font-title font-bold ${colorText[ficha?.status ?? 'pending']} backdrop-blur-2xl text-shadow-lg text-shadow-black/50 m-4`}>
                    Status: {ficha?.status == 'pending' ? 'Em espera' : ficha?.status == 'approved' ? 'Aprovado' : 'Recusado'}
                </h1>
            </div>

            <div className="flex flex-row items-center justify-center w-full gap-8">
                <button
                    onClick={()=>approveFicha(id, 'approve')}
                    disabled={!id || !isValid} 
                    className="disabled:bg-gray-400 disabled:text-black text-center px-16 py-3 bg-green-600 text-white font-body font-bold rounded-2xl enabled:hover:bg-green-900 enabled:hover:shadow-xl enabled:hover:scale-102 transition-all duration-300 ease-out">
                        Aprovar Ficha
                </button>

                <button 
                    onClick={()=>approveFicha(id, 'decline')}
                    disabled={!id || !isValid} 
                    className="disabled:bg-gray-400 disabled:text-black text-center px-16 py-3 bg-red-600 text-white font-body font-bold rounded-2xl enabled:hover:bg-red-900 enabled:hover:shadow-xl enabled:hover:scale-102 transition-all duration-300 ease-out">
                        Recusar Ficha
                </button>

                <button 
                    onClick={()=>approveFicha(id, 'pending')}
                    disabled={!id || !isValid} 
                    className="disabled:bg-gray-400 disabled:text-black text-center px-16 py-3 bg-yellow-600 text-white font-body font-bold rounded-2xl enabled:hover:bg-yellow-900 enabled:hover:shadow-xl enabled:hover:scale-102 transition-all duration-300 ease-out">
                        Definir Ficha em Espera
                </button>
            </div>
        </div>
    );
}

export default Perfil;