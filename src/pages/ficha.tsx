import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

function Ficha() {
    const { user, loading } = useAuth();
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && !user) {
            navigate('/entrar', { replace: true });
        }
    }, [user, loading, navigate]);

    // watch tracks values, isValid checks HTML 'required' fields automatically
    const { register, handleSubmit, formState: { isValid } } = useForm({
        mode: 'onChange' // Triggers validation on every keystroke to toggle the button
    });

    const onSubmit = async (data: any) => {
        if (!user || !isValid) return;

        try {
            const response = await fetch(`/api/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Tells Express JSON data is coming
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
                navigate('/perfil', { replace: true })
            } else {
                console.error('Server error:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen py-8 px-4 md:px-48">
            <h1 className="text-3xl md:text-6xl font-title font-bold text-primary">
                Faça sua ficha
            </h1>
            <div className="w-full">
                <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" /> 
            </div>

            <form id="ficha" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 items-center justify-center w-full min-h-screen px-4 py-2 md:px-12">
                <h2 className="text-xl md:text-4xl font-title font-bold text-secondary text-center">
                    Informações do seu personagem
                </h2>
                <div className="flex flex-col items-center justify-center w-full px-4 py-6 md:px-6 md:py-8 bg-black/50 backdrop-blur-xl rounded-xl shadow-lg shadow-black/60 my-4">
                    <h1 className='text-2xl font-title text-primary font-bold'>
                        Qual o nome do seu personagem?
                    </h1>
                    <textarea {...register("charName", {required: true})} id="charName" rows={1} name="charName" placeholder="Bob Uzumaki" className='bg-white rounded-2xl font-body text-center font-medium my-4 p-2 w-1/4' />
                </div>
                <div className="flex flex-col items-center justify-center w-full px-4 py-6 md:px-6 md:py-8 bg-black/50 backdrop-blur-xl rounded-xl shadow-lg shadow-black/60 my-4">
                    <h1 className='text-2xl font-title text-primary font-bold'>
                        Qual a idade do seu personagem?
                    </h1>
                    <textarea {...register("age", {required: true})} id="age" rows={1} name="age" placeholder="18" className='bg-white rounded-2xl font-body text-center font-medium my-4 p-2 w-1/4' />
                </div>
                <div className="flex flex-col items-center justify-center w-full px-4 py-6 md:px-6 md:py-8 bg-black/50 backdrop-blur-xl rounded-xl shadow-lg shadow-black/60 my-4">
                    <h1 className='text-2xl font-title text-primary font-bold'>
                        Qual a etinia do seu personagem? (Caso altere durante o rp, por favor avise)
                    </h1>
                    <textarea {...register("ethnicity", {required: true})} id="ethnicity" rows={1} name="ethnicity" placeholder="Japones" className='bg-white rounded-2xl font-body text-center font-medium my-4 p-2 w-1/4' />
                </div>
                <div className="flex flex-col items-center justify-center w-full px-4 py-6 md:px-6 md:py-8 bg-black/50 backdrop-blur-xl rounded-xl shadow-lg shadow-black/60 my-4">
                    <h1 className='text-2xl font-title text-primary font-bold'>
                        Qual ano escolar você deseja? (Não será garantido de estar no ano que deseja, seja condizente com sua idade)
                    </h1>
                    <select {...register("year", {required: true})} id="year" name="year" className='bg-white rounded-2xl font-body text-center font-medium my-4 p-2 w-1/4'>
                        <option value="1">1º</option>
                        <option value="2">2º</option>
                        <option value="3">3º</option>
                    </select>

                </div>

                <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />

                <h2 className="text-xl md:text-4xl font-title font-bold text-secondary text-center">
                    Sua lore
                </h2>

                <div className="flex flex-col items-center justify-center w-full px-4 py-6 md:px-6 md:py-8 bg-black/50 backdrop-blur-xl rounded-xl shadow-lg shadow-black/60 my-4">
                    <h1 className='text-2xl font-title text-primary font-bold'>
                        Você possuí algum relacionamento com alguem que participa ou quer participar do rp? Se sim, explique na sua historia sua relação com ele?
                    </h1>
                    <textarea {...register("connections", {required: true})} id="connections" rows={1} name="connections" placeholder="Sim, Robert Uzumaki" className='bg-white rounded-2xl font-body text-center font-medium my-4 px-8 py-2 w-1/4' />
                </div>

                <div className="flex flex-col items-center justify-center w-full px-4 py-6 md:px-6 md:py-8 bg-black/50 backdrop-blur-xl rounded-xl shadow-lg shadow-black/60 my-4">
                    <h1 className='text-2xl font-title text-primary font-bold'>
                       História: Descreva o passado do seu personagem.
                    </h1>
                    <textarea {...register("lore", {required: true})} id="lore" rows={8} name="lore" placeholder="Bob Uzumaki é..." className='block bg-white rounded-2xl font-body text-left font-medium my-4 p-2 min-w-full' />
                </div>
                
                <div className="flex flex-col items-center justify-center w-full px-4 py-6 md:px-6 md:py-8 bg-black/50 backdrop-blur-xl rounded-xl shadow-lg shadow-black/60 my-4">
                    <h1 className='text-2xl font-title text-primary font-bold'>
                       Sua função na escola: De acordo com sua história, que tipo de aluno você é? Por que?
                    </h1>
                    <textarea {...register("type", {required: true})} id="type" rows={8} name="type" placeholder="Bob Uzumaki é Encrenqueiro, mas ainda sim gostaria de entrar em uma banda..." className='bg-white rounded-2xl font-body text-left font-medium my-4 p-2 min-w-full' />
                </div>

                <div className="flex flex-col items-center justify-center w-full px-4 py-6 md:px-6 md:py-8 bg-black/50 backdrop-blur-xl rounded-xl shadow-lg shadow-black/60 my-4">
                    <h1 className='text-2xl font-title text-primary font-bold'>
                       Personalidade: Em um paragrafo diga no minimo 4 qualidade e 4 defeitos do seu personagem, condizente com sua história. Se necessario, porém a quantidade de qualidades e defeitos deve ser igual.
                    </h1>
                    <textarea {...register("personality", {required: true})} id="personality" rows={8} name="personality" placeholder="Bob Uzumaki é bastante sociavel..." className='bg-white rounded-2xl font-body text-left font-medium my-4 p-2 min-w-full' />
                </div>
            </form>

            <button 
                type="submit" 
                form="ficha" 
                disabled={!user || !isValid} 
                className="disabled:bg-gray-400 disabled:text-black text-center px-16 py-3 bg-primary text-white font-body font-bold rounded-2xl enabled:hover:bg-accent enabled:hover:shadow-xl enabled:hover:scale-102 transition-all duration-300 ease-out mt-8">
                {user ? (
                    isValid ? "Enviar Ficha" : "Preencha todos os campos antes de enviar"
                ) : "Entre para enviar ficha"
                }
            </button>
        </div>
    );
};

export default Ficha;