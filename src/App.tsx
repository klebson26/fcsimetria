import React, { useState, useEffect } from 'react';
import { initStorage, getAuthSession, subscribeStorage, getAparencia } from './services/storageService';

// Public Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FairModeModal } from './components/FairModeModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { QRCodePrintModal } from './components/QRCodePrintModal';

// Public Pages
import { HomeView } from './pages/HomeView';
import { QuizView } from './pages/QuizView';

// Admin Components & Pages
import { AdminSidebar } from './admin/components/AdminSidebar';
import { AdminHeader } from './admin/components/AdminHeader';
import { AdminLogin } from './admin/pages/AdminLogin';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { AdminSecoes } from './admin/pages/AdminSecoes';
import { AdminHome } from './admin/pages/AdminHome';
import { AdminMapa } from './admin/pages/AdminMapa';
import { AdminCidades } from './admin/pages/AdminCidades';
import { AdminPontosTuristicos } from './admin/pages/AdminPontosTuristicos';
import { AdminPaulista } from './admin/pages/AdminPaulista';
import { AdminMercadao } from './admin/pages/AdminMercadao';
import { AdminLiberdade } from './admin/pages/AdminLiberdade';
import { AdminCulinaria } from './admin/pages/AdminCulinaria';
import { AdminArtesanato } from './admin/pages/AdminArtesanato';
import { AdminCultura } from './admin/pages/AdminCultura';
import { AdminHistoria } from './admin/pages/AdminHistoria';
import { AdminCuriosidades } from './admin/pages/AdminCuriosidades';
import { AdminQuiz } from './admin/pages/AdminQuiz';
import { AdminMedia } from './admin/pages/AdminMedia';
import { AdminBanners } from './admin/pages/AdminBanners';
import { AdminMenu } from './admin/pages/AdminMenu';
import { AdminAparencia } from './admin/pages/AdminAparencia';
import { AdminIdentidade } from './admin/pages/AdminIdentidade';
import { AdminModoFeira } from './admin/pages/AdminModoFeira';
import { AdminUsuarios } from './admin/pages/AdminUsuarios';
import { AdminHistorico } from './admin/pages/AdminHistorico';
import { AdminLixeira } from './admin/pages/AdminLixeira';

export default function App() {
  // Initialize Storage Data on Boot
  useEffect(() => {
    initStorage();
  }, []);

  const [currentView, setCurrentView] = useState<'PUBLIC' | 'QUIZ' | 'ADMIN'>(() => {
    return window.location.hash.startsWith('#admin') ? 'ADMIN' : 'PUBLIC';
  });

  const [adminTab, setAdminTab] = useState('dashboard');
  const [session, setSession] = useState(getAuthSession());
  const [aparencia, setAparencia] = useState(getAparencia());

  const [showFairModeModal, setShowFairModeModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [selectedQrTopic, setSelectedQrTopic] = useState<'geral' | 'paulista' | 'mercadao' | 'liberdade' | 'quiz'>('geral');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  useEffect(() => {
    return subscribeStorage(() => {
      setSession(getAuthSession());
      setAparencia(getAparencia());
    });
  }, []);

  // Hash route listener for /admin URL
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.startsWith('#admin')) {
        setCurrentView('ADMIN');
      } else if (window.location.hash === '#quiz') {
        setCurrentView('QUIZ');
      } else {
        setCurrentView('PUBLIC');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigateToAdmin = () => {
    window.location.hash = 'admin';
    setCurrentView('ADMIN');
  };

  const handleNavigateToPublic = () => {
    window.location.hash = '';
    setCurrentView('PUBLIC');
  };

  const handleNavigateToQuiz = () => {
    window.location.hash = 'quiz';
    setCurrentView('QUIZ');
  };

  // Render Admin View
  if (currentView === 'ADMIN') {
    if (!session) {
      return (
        <AdminLogin
          onSuccess={() => {
            setSession(getAuthSession());
          }}
        />
      );
    }

    return (
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
        <AdminSidebar
          activeTab={adminTab}
          onChangeTab={(tab) => setAdminTab(tab)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader
            onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
            onNavigateToPublicSite={handleNavigateToPublic}
            searchQuery={adminSearchQuery}
            onSearchChange={(q) => setAdminSearchQuery(q)}
          />

          <main className="flex-1 overflow-y-auto">
            <div key={adminTab} className="animate-fade-in">
              {adminTab === 'dashboard' && <AdminDashboard onNavigateToTab={(tab) => setAdminTab(tab)} />}
              {adminTab === 'secoes' && <AdminSecoes />}
              {adminTab === 'home' && <AdminHome />}
              {adminTab === 'mapa' && <AdminMapa />}
              {adminTab === 'cidades' && <AdminCidades />}
              {adminTab === 'pontos' && <AdminPontosTuristicos />}
              {adminTab === 'paulista' && <AdminPaulista />}
              {adminTab === 'mercadao' && <AdminMercadao />}
              {adminTab === 'liberdade' && <AdminLiberdade />}
              {adminTab === 'culinaria' && <AdminCulinaria />}
              {adminTab === 'artesanato' && <AdminArtesanato />}
              {adminTab === 'cultura' && <AdminCultura />}
              {adminTab === 'historia' && <AdminHistoria />}
              {adminTab === 'curiosidades' && <AdminCuriosidades />}
              {adminTab === 'quiz' && <AdminQuiz />}
              {adminTab === 'media' && <AdminMedia />}
              {adminTab === 'banners' && <AdminBanners />}
              {adminTab === 'menu' && <AdminMenu />}
              {adminTab === 'aparencia' && <AdminAparencia />}
              {adminTab === 'identidade' && <AdminIdentidade />}
              {adminTab === 'modo_feira' && <AdminModoFeira onOpenFairMode={() => setShowFairModeModal(true)} />}
              {adminTab === 'usuarios' && <AdminUsuarios />}
              {adminTab === 'historico' && <AdminHistorico />}
              {adminTab === 'lixeira' && <AdminLixeira />}
            </div>
          </main>
        </div>

        {showFairModeModal && <FairModeModal onClose={() => setShowFairModeModal(false)} />}
      </div>
    );
  }

  // Render Public View
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <Header
        onOpenSearch={() => setShowSearchModal(true)}
        onOpenFairMode={() => setShowFairModeModal(true)}
        onOpenQRCodeModal={(topic = 'geral') => {
          setSelectedQrTopic(topic);
          setShowQRCodeModal(true);
        }}
        onNavigateToAdmin={handleNavigateToAdmin}
        onNavigateToQuiz={handleNavigateToQuiz}
        onNavigateToHome={handleNavigateToPublic}
        activeSection={currentView === 'QUIZ' ? 'quiz' : ''}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div key={currentView} className="animate-fade-in">
          {currentView === 'QUIZ' ? (
            <QuizView />
          ) : (
            <HomeView
              onNavigateToQuiz={handleNavigateToQuiz}
              onOpenFairMode={() => setShowFairModeModal(true)}
              onOpenQRCodeModal={(topic = 'geral') => {
                setSelectedQrTopic(topic);
                setShowQRCodeModal(true);
              }}
              onSelectCidade={(cidade) => {}}
            />
          )}
        </div>
      </main>

      <Footer onNavigateToAdmin={handleNavigateToAdmin} />

      <OfflineIndicator />

      {/* Global Modals */}
      {showFairModeModal && <FairModeModal onClose={() => setShowFairModeModal(false)} />}
      {showQRCodeModal && (
        <QRCodePrintModal
          initialTopic={selectedQrTopic}
          onClose={() => setShowQRCodeModal(false)}
        />
      )}
      {showSearchModal && (
        <GlobalSearchModal
          onClose={() => setShowSearchModal(false)}
          onSelectResult={(item, category) => {
            if (category === 'cidade') {
              const el = document.getElementById('cidades');
              el?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      )}
    </div>
  );
}
