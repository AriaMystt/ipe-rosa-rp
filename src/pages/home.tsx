function Home() {
  return (
    <div>
      <div className="flex flex-col items-center justify-between mx-auto pb-24 bg-[url('/src/assets/images/hero.png')] bg-cover bg-center min-w-screen min-h-screen bg-no-repeat">
        <div className="flex flex-col items-center justify-center h-full text-primary text-center font-title font-bold mt-32 text-shadow-md text-shadow-black/40">
          <h1 className="text-8xl">
            Bem-vindo ao Ipê Rosa - RP
          </h1>
          <p className="text-xl font-body text-secondary text-center mt-4">
            Um servidor de roleplay dedicado a criar experiências imersivas e envolventes no universo de Gakuran, Roblox.
          </p>
        </div>
        <div className="flex flex-col items-center justify-end h-full text-secondary text-center font-title font-bold mt-32 max-h-1/6">
          <p className="text-lg font-body text-primary text-center mt-4">
            Mais
          </p>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mx-auto my-24 bg-background">
        <h2 className="text-4xl font-title font-bold text-primary mb-12 text-center">
          Sobre o Ipê Rosa - RP
        </h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
          <div className="text-left max-w-2xl min-h-max mb-8 rounded-2xl p-6 bg-black/40 backdrop-blur shadow-lg shadow-black/60 hover:shadow-xl hover:-translate-y-1 hover:scale-102 transition-all duration-300 ease-out">
            <h1 className="text-2xl font-title font-bold text-primary mb-4">
              Sobre Gakuran
            </h1>
            <p className="mb-4 text-lg font-body text-secondary">
              Gakuran é uma experiência de mundo aberto inspirada em animes de delinquentes e "slice of life", ambientada no Japão em 2007.
              O jogo funciona como um ponto de encontro virtual onde os jogadores dão vida a estudantes de uma escola japonesa clássica.
              Não existem missões obrigatórias ou objetivos prontos: toda a história, as rivalidades e os acontecimentos são criados e decididos inteiramente pelos próprios jogadores através da atuação (Roleplay).
            </p>
            <a href="https://www.roblox.com/games/128736949265057/Gakuran" target="_blank" className="mb-4 text-lg font-body text-blue-400 no-underline hover:underline">
              Jogue Gakuran
            </a>
          </div>
          <div className="text-left max-w-2xl min-h-max mb-8 rounded-2xl p-6 bg-black/40 backdrop-blur shadow-lg shadow-black/60 hover:shadow-xl hover:-translate-y-1 hover:scale-102 transition-all duration-300 ease-out">
            <h1 className="text-2xl font-title font-bold text-primary mb-4">
              Sobre o Servidor
            </h1>
            <p className="mb-4 text-lg font-body text-secondary ">
              • Base do Roleplay: É um RP de escola real, com horários, aulas, e professores.<br/>
              • Foco em Socialização: Você tem total liberdade fora das salas para interagir.<br/>
              • Intervalos Longos: Os intervalos entre as aulas demoram bastante para o pessoal conversar.<br/>
              • Dramas: Você pode criar amizades, rivalidades, romances, e até mesmo tramas de bullying.<br/>
              • Liberdade: Você pode criar seu próprio personagem, com sua própria história, e viver sua própria vida dentro do servidor!<br/>
            </p>
          </div>
        </div>
        
        <a href="/lore" className="px-6 py-3 bg-primary text-white font-body font-bold rounded-2xl hover:bg-accent hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out mt-8">
          Saiba mais sobre a lore
        </a>
      </div>

      <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />

      <div className="flex flex-col items-center justify-center mx-auto my-24 bg-background">
        <h2 className="text-4xl font-title font-bold text-primary mb-8">
          Participar do Ipê Rosa - RP
        </h2>
        <a href="/participar" className="px-6 py-3 bg-primary text-white font-body font-bold rounded-2xl hover:bg-accent hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out mt-8">
          Clique aqui para participar
        </a>
      </div>
    </div>
  );
};

export default Home;