import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './admin.css'
import MothersCraft from './App.jsx'
import AdminPanel from './AdminPanel.jsx'
import { StoreProvider, useStore } from './StoreContext.jsx'

function AppShell() {
  const { currentAdmin, activeTab, setActiveTab } = useStore();

  return (
    <div>
      {/* Tab Switcher — only show when admin is logged in */}
      {currentAdmin && (
        <div className="app-shell-tabs">
          <button
            className={`app-shell-tab ${activeTab === 'storefront' ? 'active' : 'inactive'}`}
            onClick={() => setActiveTab('storefront')}
          >
            🛍 Storefront
          </button>
          <button
            className={`app-shell-tab ${activeTab === 'admin' ? 'active' : 'inactive'}`}
            onClick={() => setActiveTab('admin')}
          >
            ⚙ Admin Panel
          </button>
        </div>
      )}

      {/* Render active view */}
      <div style={{ display: activeTab === 'storefront' ? 'block' : 'none' }}>
        <MothersCraft />
      </div>
      <div style={{ display: activeTab === 'admin' ? 'block' : 'none' }}>
        <AdminPanel />
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  </StrictMode>,
)
