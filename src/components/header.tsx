import { useAuth } from '../hooks/useAuth';

function Header() {
    const { user, loading } = useAuth();

    return (
        <header className="sticky top-0 z-50 p-4 bg-black/40 backdrop-blur">
            <div className="container mx-auto flex items-center justify-between">
                <a href="/" className="font-title font-bold text-2xl text-primary no-underline">
                    Ipê Rosa
                </a>
                <nav className="flex items-center gap-4 text-primary text-2xl font-title font-bold">
                    <a href="/#sobre" className="hover:text-accent transition-colors">Sobre</a>
                    {loading ? null : user ? (
                        <a href="/entrar" className="flex items-center gap-2 hover:text-accent transition-colors">
                            <img
                                src={user.avatarUrl}
                                alt={user.username}
                                className="w-8 h-8 rounded-full border border-primary"
                            />
                        </a>
                    ) : (
                        <a href="/entrar" className="hover:text-accent transition-colors">Entrar</a>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;