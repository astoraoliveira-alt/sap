import { Database, Search, Settings } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export const Header = () => {
    const { t, language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'pt-BR' : 'en');
    }

    return (
        <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-background/60 backdrop-blur-xl z-30 flex items-center px-8 justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary to-blue-600 p-2 rounded-lg shadow-lg shadow-primary/20">
                    <Database className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-white">
                        {t('appTitle')}
                    </h1>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">{t('executiveDashboard')}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                    title={language === 'en' ? "Switch to Portuguese" : "Mudar para Inglês"}
                >
                    <span className="text-lg">{language === 'en' ? '🇺🇸' : '🇧🇷'}</span>
                    <span className="text-xs font-medium text-foreground uppercase">{language === 'en' ? 'EN' : 'PT'}</span>
                </button>
                <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-white">
                    <Search className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-white">
                    <Settings className="h-4 w-4" />
                </button>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/10 ml-2" />
            </div>
        </header>
    );
};
