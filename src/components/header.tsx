function Header() {
    return (
        <header className="sticky top-0 z-50 p-4 bg-black/40 backdrop-blur"> 
            <div className="container mx-auto flex items-center justify-between">
                <a href="/" className="font-title font-bold text-2xl text-primary no-underline">
                    Ipê Rosa
                </a>
                <nav className="flex gap-4 text-primary text-2xl font-title font-bold">
                    <a href="/sobre" className="hover:text-accent transition-colors">Sobre</a>
                    <a href="/participar" className="hover:text-accent transition-colors">Participar</a>
                </nav>
            </div>
        </header>
    );
}

export default Header;