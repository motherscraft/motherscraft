import { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from './StoreContext';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Star, FileText,
  BarChart3, Shield, Clock, Settings, LogOut, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, Search, Bell, Moon, Sun, Menu, X, Plus, Edit3,
  Trash2, Eye, EyeOff, Check, AlertTriangle, ArrowUp, ArrowDown, Download,
  Filter, MoreVertical, Upload, Image, GripVertical, Copy, RefreshCw,
  TrendingUp, TrendingDown, DollarSign, Activity, UserCheck, UserX,
  Mail, Phone, MapPin, Calendar, Hash, Layers, Box, Truck, CreditCard,
  FileDown, MessageSquare, Reply, ThumbsUp, ThumbsDown, Globe, Lock,
  Zap, Percent, Gift, ExternalLink, ChevronFirst, ChevronLast, Minus,
  AlertCircle, Info, IndianRupee, Store, Palette, Type
} from 'lucide-react';
import './admin.css';

// ════════════════════════════════════════════════════════════════
// ROLE-BASED ACCESS CONTROL
// ════════════════════════════════════════════════════════════════

const ROLE_ACCESS = {
  super_admin: ['dashboard','products','catalogue','orders','customers','discounts','reviews','content','analytics','admin_management','activity_logs','settings'],
  manager: ['dashboard','products','catalogue','orders','customers','discounts','reviews','content','analytics'],
  staff: ['dashboard','products','catalogue','orders','reviews'],
  support: ['dashboard','orders','customers','reviews'],
};

const ROLE_LABELS = { super_admin: 'Super Admin', manager: 'Manager', staff: 'Staff', support: 'Support' };
const ROLE_COLORS = { super_admin: 'admin-role-super', manager: 'admin-role-manager', staff: 'admin-role-staff', support: 'admin-role-support' };

function hasAccess(role, page) {
  return ROLE_ACCESS[role]?.includes(page) ?? false;
}

// ════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════

function formatCurrency(n) { return `₹${Number(n || 0).toLocaleString('en-IN')}`; }
function formatDate(d) { if (!d) return '—'; try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return d; } }
function truncate(s, n = 40) { return s && s.length > n ? s.slice(0, n) + '…' : s; }
function statusColor(s) {
  const map = { pending: 'admin-pill-warning', processing: 'admin-pill-info', shipped: 'admin-pill-info', delivered: 'admin-pill-success', cancelled: 'admin-pill-danger', refunded: 'admin-pill-danger', published: 'admin-pill-success', draft: 'admin-pill-grey', approved: 'admin-pill-success', rejected: 'admin-pill-danger', active: 'admin-pill-success', blocked: 'admin-pill-danger', expired: 'admin-pill-grey' };
  return map[s] || 'admin-pill-grey';
}

// SVG Sparkline
function Sparkline({ data, color = '#7A9E7E', width = 80, height = 28 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`).join(' ');
  return (<svg width={width} height={height} className="admin-sparkline"><polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} /></svg>);
}

// Mini Donut Chart
function DonutChart({ data, size = 160 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((d, i) => {
          const pct = total > 0 ? d.value / total : 0;
          const offset = cumulative;
          cumulative += pct;
          return (<circle key={i} cx={size/2} cy={size/2} r={radius} fill="none" stroke={d.color} strokeWidth="18" strokeDasharray={`${pct * circumference} ${circumference}`} strokeDashoffset={-offset * circumference} strokeLinecap="butt" transform={`rotate(-90 ${size/2} ${size/2})`} />);
        })}
        <text x={size/2} y={size/2 - 4} textAnchor="middle" fill="var(--admin-text)" fontWeight="700" fontSize="18">{total}</text>
        <text x={size/2} y={size/2 + 14} textAnchor="middle" fill="var(--admin-text-muted)" fontSize="10">TOTAL</text>
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--admin-text-secondary)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
            {d.label} ({d.value})
          </div>
        ))}
      </div>
    </div>
  );
}

// Bar Chart (horizontal)
function HBarChart({ data, maxVal }) {
  const mx = maxVal || Math.max(...data.map(d => d.value)) || 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 110, fontSize: 12, color: 'var(--admin-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={d.label}>{truncate(d.label, 16)}</span>
          <div style={{ flex: 1, height: 22, background: 'var(--admin-surface-2)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ width: `${(d.value / mx) * 100}%`, height: '100%', background: d.color || '#D4A96A', borderRadius: 6, transition: 'width 0.5s ease', minWidth: d.value > 0 ? 4 : 0 }} />
          </div>
          <span style={{ width: 50, fontSize: 12, fontWeight: 600, color: 'var(--admin-text)', textAlign: 'right' }}>{formatCurrency(d.value)}</span>
        </div>
      ))}
    </div>
  );
}

// Line Chart (SVG)
function LineChart({ data, labels, width = 500, height = 200, color = '#D4A96A' }) {
  if (!data || data.length < 2) return <div style={{ color: 'var(--admin-text-muted)', fontSize: 13, padding: 20 }}>Not enough data</div>;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padX = 40, padY = 20, chartW = width - padX - 10, chartH = height - padY * 2;
  const points = data.map((v, i) => ({ x: padX + (i / (data.length - 1)) * chartW, y: padY + chartH - ((v - min) / range) * chartH }));
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaD = pathD + ` L${points[points.length-1].x},${padY+chartH} L${points[0].x},${padY+chartH} Z`;
  const gridLines = 4;
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const y = padY + (i / gridLines) * chartH;
        const val = max - (i / gridLines) * range;
        return (<g key={i}><line x1={padX} y1={y} x2={padX + chartW} y2={y} stroke="var(--admin-chart-grid)" strokeWidth="1" strokeDasharray="4,4" /><text x={padX - 6} y={y + 4} textAnchor="end" fontSize="9" fill="var(--admin-text-muted)">{formatCurrency(Math.round(val))}</text></g>);
      })}
      <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.2" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={areaD} fill="url(#areaGrad)" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (<circle key={i} cx={p.x} cy={p.y} r="3" fill={color} stroke="var(--admin-surface)" strokeWidth="2" />))}
      {labels && labels.map((l, i) => {
        const x = padX + (i / (labels.length - 1)) * chartW;
        return <text key={i} x={x} y={height - 2} textAnchor="middle" fontSize="9" fill="var(--admin-text-muted)">{l}</text>;
      })}
    </svg>
  );
}

// Pagination Component
function Pagination({ page, total, perPage, onPageChange }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16 }}>
      <span style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>Showing {((page - 1) * perPage) + 1}–{Math.min(page * perPage, total)} of {total}</span>
      <div className="admin-pagination">
        <button className="admin-page-btn" disabled={page <= 1} onClick={() => onPageChange(1)}><ChevronFirst size={14} /></button>
        <button className="admin-page-btn" disabled={page <= 1} onClick={() => onPageChange(page - 1)}><ChevronLeft size={14} /></button>
        {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
          let pg;
          if (totalPages <= 5) pg = i + 1;
          else if (page <= 3) pg = i + 1;
          else if (page >= totalPages - 2) pg = totalPages - 4 + i;
          else pg = page - 2 + i;
          return <button key={pg} className={`admin-page-btn ${pg === page ? 'active' : ''}`} onClick={() => onPageChange(pg)}>{pg}</button>;
        })}
        <button className="admin-page-btn" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}><ChevronRight size={14} /></button>
        <button className="admin-page-btn" disabled={page >= totalPages} onClick={() => onPageChange(totalPages)}><ChevronLast size={14} /></button>
      </div>
    </div>
  );
}

// Toggle Switch
function Toggle({ on, onChange, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className={`admin-toggle ${on ? 'on' : 'off'}`} onClick={onChange}><div className="toggle-knob" /></div>
      {label && <span style={{ fontSize: 13, color: 'var(--admin-text-secondary)' }}>{label}</span>}
    </div>
  );
}

// Confirm Modal
function ConfirmModal({ title, message, onConfirm, onCancel, danger }) {
  return (
    <div className="admin-modal-backdrop" onClick={onCancel}>
      <div className="admin-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: danger ? 'rgba(220,53,69,0.1)' : 'rgba(212,169,106,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            {danger ? <AlertTriangle size={24} color="#DC3545" /> : <AlertCircle size={24} color="#D4A96A" />}
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--admin-text)' }}>{title}</h3>
          <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', lineHeight: 1.5 }}>{message}</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
            <button className="admin-btn admin-btn-secondary" onClick={onCancel}>Cancel</button>
            <button className={`admin-btn ${danger ? 'admin-btn-danger' : 'admin-btn-gold'}`} onClick={onConfirm}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════════
// MAIN ADMIN PANEL COMPONENT
// ════════════════════════════════════════════════════════════════

export default function AdminPanel() {
  const store = useStore();
  const { products, orders, customers, coupons, reviews, adminUsers, activityLogs, settings, categories, currentAdmin, notifications } = store;

  // ── Internal State ──
  const [adminPage, setAdminPage] = useState('dashboard');
  const [adminSubPage, setAdminSubPage] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [confirmModal, setConfirmModal] = useState(null);
  const [toast, setToast] = useState(null);

  // Login state
  const [loginEmail, setLoginEmail] = useState('admin@motherscraft.in');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Product form state
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormTab, setProductFormTab] = useState('basic');
  const [productForm, setProductForm] = useState({});
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [productPage, setProductPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Order state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderPage, setOrderPage] = useState(1);

  // Customer state
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerPage, setCustomerPage] = useState(1);

  // Coupon state
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponForm, setCouponForm] = useState({});

  // Review state
  const [reviewFilter, setReviewFilter] = useState('all');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Admin user state
  const [editingAdminUser, setEditingAdminUser] = useState(null);
  const [adminUserForm, setAdminUserForm] = useState({});

  // Activity log filter
  const [logFilter, setLogFilter] = useState('all');

  // Settings tab
  const [settingsTab, setSettingsTab] = useState('general');
  const [settingsForm, setSettingsForm] = useState({});

  // Toast
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Navigate helper
  const nav = (page, sub = '') => {
    setAdminPage(page);
    setAdminSubPage(sub);
    setMobileMenuOpen(false);
    setEditingProduct(null);
    setSelectedOrder(null);
    setSelectedCustomer(null);
    setEditingCoupon(null);
    setEditingAdminUser(null);
  };

  // ════════════════════════════════════════════════════════════════
  // LOGIN SCREEN
  // ════════════════════════════════════════════════════════════════

  if (!currentAdmin) {
    const handleLogin = (e) => {
      e.preventDefault();
      const result = store.login(loginEmail, loginPassword);
      if (result.success) { setLoginError(''); }
      else { setLoginError(result.error); }
    };

    return (
      <div className="admin-login-bg">
        {/* Floating particles */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: 3 + Math.random() * 4,
              height: 3 + Math.random() * 4,
              background: 'rgba(212,169,106,0.3)',
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }} />
          ))}
        </div>
        <style>{`@keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; } 50% { transform: translateY(-30px) rotate(180deg); opacity: 0.8; } }`}</style>

        <div className="admin-login-card">
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #6B3A2A, #C07850)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 4px 16px rgba(107,58,42,0.3)' }}>
              <Store size={28} color="#F5E6CC" />
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#1E1209', margin: 0 }}>Mothers Craft</h1>
            <p style={{ fontSize: 12, color: '#7A5A48', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Panel</p>
          </div>

          <form onSubmit={handleLogin}>
            {loginError && (
              <div style={{ background: 'rgba(220,53,69,0.08)', border: '1px solid rgba(220,53,69,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#DC3545' }}>
                <AlertCircle size={16} /> {loginError}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#7A5A48', display: 'block', marginBottom: 6 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#A89080' }} />
                <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: 8, border: '1px solid #E8D0B0', fontSize: 13.5, fontFamily: "'Inter', sans-serif", outline: 'none', background: '#FDF8F0', color: '#1E1209' }} placeholder="admin@motherscraft.in" required />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#7A5A48', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#A89080' }} />
                <input type={showPassword ? 'text' : 'password'} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} style={{ width: '100%', padding: '10px 40px 10px 36px', borderRadius: 8, border: '1px solid #E8D0B0', fontSize: 13.5, fontFamily: "'Inter', sans-serif", outline: 'none', background: '#FDF8F0', color: '#1E1209' }} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#A89080', display: 'flex', padding: 4 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: 8, background: 'linear-gradient(135deg, #D4A96A, #C07850)', color: '#1E1209', border: 'none', fontSize: 14, fontWeight: 700, fontFamily: "'Inter', sans-serif", cursor: 'pointer', letterSpacing: '0.04em', transition: 'all 0.2s ease' }}>
              Sign In to Dashboard
            </button>
          </form>

          {/* Demo Credentials */}
          <div style={{ marginTop: 24, borderTop: '1px solid #E8D0B0', paddingTop: 16 }}>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A89080', fontWeight: 600, marginBottom: 10, textAlign: 'center' }}>Demo Credentials</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[
                { role: 'Super Admin', email: 'admin@motherscraft.in', pass: 'admin123' },
                { role: 'Manager', email: 'manager@motherscraft.in', pass: 'manager123' },
                { role: 'Staff', email: 'staff@motherscraft.in', pass: 'staff123' },
                { role: 'Support', email: 'support@motherscraft.in', pass: 'support123' },
              ].map(c => (
                <button key={c.role} onClick={() => { setLoginEmail(c.email); setLoginPassword(c.pass); }} style={{ padding: '8px', borderRadius: 6, border: '1px solid #E8D0B0', background: loginEmail === c.email ? 'rgba(212,169,106,0.1)' : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#6B3A2A' }}>{c.role}</div>
                  <div style={{ fontSize: 10, color: '#A89080', marginTop: 2 }}>{c.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // NAVIGATION ITEMS
  // ════════════════════════════════════════════════════════════════

  const navItems = [
    { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { section: 'STORE' },
    { key: 'products', icon: Package, label: 'Products', badge: products.filter(p => p.status === 'pending').length || null },
    { key: 'catalogue', icon: Layers, label: 'Catalogue' },
    { key: 'orders', icon: ShoppingCart, label: 'Orders', badge: orders.filter(o => o.status === 'pending').length || null },
    { key: 'customers', icon: Users, label: 'Customers' },
    { key: 'discounts', icon: Tag, label: 'Discounts' },
    { key: 'reviews', icon: Star, label: 'Reviews', badge: reviews.filter(r => r.status === 'pending').length || null },
    { section: 'CONTENT' },
    { key: 'content', icon: FileText, label: 'Website Content' },
    { key: 'analytics', icon: BarChart3, label: 'Analytics' },
    { section: 'ADMIN' },
    { key: 'admin_management', icon: Shield, label: 'Staff & Admins' },
    { key: 'activity_logs', icon: Clock, label: 'Activity Logs' },
    { key: 'settings', icon: Settings, label: 'Settings' },
  ].filter(item => {
    if (item.section) return true;
    return hasAccess(currentAdmin.role, item.key);
  });

  // ════════════════════════════════════════════════════════════════
  // DASHBOARD PAGE
  // ════════════════════════════════════════════════════════════════

  const renderDashboard = () => {
    const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const totalProducts = products.filter(p => p.status === 'published').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold && p.status === 'published');
    const outOfStockProducts = products.filter(p => p.stock === 0 && p.status === 'published');
    const recentOrders = [...orders].sort((a, b) => b.id - a.id).slice(0, 8);
    const pendingReviews = reviews.filter(r => r.status === 'pending');

    // Sales by month simulation
    const salesData = [4200, 5800, 7100, 6400, 8200, 9500, 11200, 10800, 12400, 11900, 13200, totalRevenue > 0 ? totalRevenue / 2 : 7800];
    const salesLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Category distribution
    const catData = {};
    products.filter(p => p.status === 'published').forEach(p => { catData[p.category] = (catData[p.category] || 0) + 1; });
    const catColors = ['#6B3A2A', '#C07850', '#D4A96A', '#7A9E7E', '#C48B9F'];
    const donutData = Object.entries(catData).map(([label, value], i) => ({ label, value, color: catColors[i % catColors.length] }));

    // Top sellers
    const topSellers = [...products].filter(p => p.status === 'published').sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 5).map(p => ({ label: p.name, value: p.salePrice * p.reviewsCount, color: '#D4A96A' }));

    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginTop: 4 }}>Welcome back, {currentAdmin.name}. Here's what's happening today.</p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: IndianRupee, color: '#D4A96A', spark: [42, 58, 71, 64, 82, 95, 112], trend: '+18.2%', trendUp: true },
            { label: 'Total Orders', value: totalOrders, icon: ShoppingCart, color: '#C07850', spark: [8, 12, 15, 11, 18, 22, 25], trend: '+12.5%', trendUp: true },
            { label: 'Customers', value: totalCustomers, icon: Users, color: '#7A9E7E', spark: [3, 5, 6, 7, 8, 9, 10], trend: '+8.1%', trendUp: true },
            { label: 'Active Products', value: totalProducts, icon: Package, color: '#C48B9F', spark: [15, 16, 17, 18, 19, 20, totalProducts], trend: `${pendingOrders} pending`, trendUp: false },
          ].map((s, i) => (
            <div key={i} className="admin-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{s.label}</p>
                  <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--admin-text)', margin: '6px 0 0' }}>{s.value}</h2>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={20} color={s.color} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                <Sparkline data={s.spark} color={s.color} />
                <span style={{ fontSize: 11, fontWeight: 600, color: s.trendUp ? '#7A9E7E' : 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: 2 }}>
                  {s.trendUp && <TrendingUp size={12} />} {s.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, marginBottom: 24 }}>
          {/* Sales Overview */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Sales Overview</h3>
              <span style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>Last 12 months</span>
            </div>
            <div className="admin-card-body"><LineChart data={salesData} labels={salesLabels} /></div>
          </div>

          {/* Category Distribution */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Products by Category</h3>
            </div>
            <div className="admin-card-body" style={{ display: 'flex', justifyContent: 'center' }}>
              <DonutChart data={donutData} />
            </div>
          </div>
        </div>

        {/* Top Sellers + Alerts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, marginBottom: 24 }}>
          {/* Top Sellers */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Top 5 Bestsellers</h3>
            </div>
            <div className="admin-card-body"><HBarChart data={topSellers} /></div>
          </div>

          {/* Alerts */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Alerts & Notifications</h3>
            </div>
            <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {lowStockProducts.length > 0 && lowStockProducts.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(212,169,106,0.06)', border: '1px solid rgba(212,169,106,0.15)' }}>
                  <AlertTriangle size={14} color="#D4A96A" />
                  <span style={{ fontSize: 12, flex: 1, color: 'var(--admin-text-secondary)' }}>{truncate(p.name, 28)} — only <b>{p.stock}</b> left</span>
                  <span className="admin-pill admin-pill-warning">Low Stock</span>
                </div>
              ))}
              {outOfStockProducts.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(220,53,69,0.04)', border: '1px solid rgba(220,53,69,0.12)' }}>
                  <AlertCircle size={14} color="#DC3545" />
                  <span style={{ fontSize: 12, flex: 1, color: 'var(--admin-text-secondary)' }}>{truncate(p.name, 28)} — <b>Out of Stock!</b></span>
                  <span className="admin-pill admin-pill-danger">OOS</span>
                </div>
              ))}
              {pendingReviews.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(196,139,159,0.06)', border: '1px solid rgba(196,139,159,0.15)' }}>
                  <MessageSquare size={14} color="#C48B9F" />
                  <span style={{ fontSize: 12, flex: 1, color: 'var(--admin-text-secondary)' }}>{pendingReviews.length} review(s) awaiting moderation</span>
                  <button className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => nav('reviews')}>Review</button>
                </div>
              )}
              {lowStockProducts.length === 0 && outOfStockProducts.length === 0 && pendingReviews.length === 0 && (
                <div className="admin-empty-state" style={{ padding: 24 }}>
                  <Check size={24} color="#7A9E7E" />
                  <p style={{ marginTop: 8, fontSize: 13 }}>All clear! No alerts right now.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Recent Orders</h3>
            <button className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => nav('orders')}>View All</button>
          </div>
          <div className="admin-card-body" style={{ padding: 0, overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id} style={{ cursor: 'pointer' }} onClick={() => { nav('orders'); setTimeout(() => setSelectedOrder(o), 50); }}>
                    <td style={{ fontWeight: 600 }}>#{o.id}</td>
                    <td>{o.customer.name}</td>
                    <td>{o.items.length} item(s)</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(o.total)}</td>
                    <td><span className={`admin-pill ${statusColor(o.status)}`}>{o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span></td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: 12 }}>{formatDate(o.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════
  // PRODUCT MANAGEMENT
  // ════════════════════════════════════════════════════════════════

  const renderProducts = () => {
    // Product form (Add/Edit)
    if (editingProduct !== null) {
      const isNew = editingProduct === 'new';
      const form = productForm;
      const updateForm = (key, val) => setProductForm(prev => ({ ...prev, [key]: val }));

      const handleSave = () => {
        if (!form.name || !form.category || !form.salePrice) { showToast('Please fill required fields', 'error'); return; }
        if (isNew) {
          store.addProduct({ ...form, stock: Number(form.stock) || 0, salePrice: Number(form.salePrice) || 0, originalPrice: Number(form.originalPrice) || 0, costPrice: Number(form.costPrice) || 0, lowStockThreshold: Number(form.lowStockThreshold) || 10, weight: Number(form.weight) || 0, rating: 0, reviewsCount: 0, uploadedBy: currentAdmin.role === 'staff' ? currentAdmin.name : 'admin', status: currentAdmin.role === 'staff' ? 'pending' : (form.status || 'published') });
          showToast('Product created successfully!');
        } else {
          store.updateProduct(editingProduct, { ...form, stock: Number(form.stock) || 0, salePrice: Number(form.salePrice) || 0, originalPrice: Number(form.originalPrice) || 0, costPrice: Number(form.costPrice) || 0, lowStockThreshold: Number(form.lowStockThreshold) || 10, weight: Number(form.weight) || 0 });
          showToast('Product updated successfully!');
        }
        setEditingProduct(null);
      };

      return (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <button className="admin-btn admin-btn-secondary" onClick={() => setEditingProduct(null)}><ChevronLeft size={16} /> Back</button>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>{isNew ? 'Add New Product' : 'Edit Product'}</h2>
          </div>

          {/* Tabs */}
          <div className="admin-tabs">
            {['basic', 'pricing', 'images', 'shipping', 'seo'].map(t => (
              <button key={t} className={`admin-tab ${productFormTab === t ? 'active' : ''}`} onClick={() => setProductFormTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
            ))}
          </div>

          <div className="admin-card" style={{ marginBottom: 20 }}>
            <div className="admin-card-body">
              {productFormTab === 'basic' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                  <div>
                    <label className="admin-label">Product Name *</label>
                    <input className="admin-input" value={form.name || ''} onChange={e => updateForm('name', e.target.value)} placeholder="e.g. Handmade Macramé Wall Hanging" />
                  </div>
                  <div>
                    <label className="admin-label">SKU</label>
                    <input className="admin-input" value={form.sku || ''} onChange={e => updateForm('sku', e.target.value)} placeholder="e.g. MC-WD-0001" />
                  </div>
                  <div>
                    <label className="admin-label">Category *</label>
                    <select className="admin-select" value={form.category || ''} onChange={e => updateForm('category', e.target.value)}>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="admin-label">Sub-Category</label>
                    <select className="admin-select" value={form.subCategory || ''} onChange={e => updateForm('subCategory', e.target.value)}>
                      <option value="">Select sub-category</option>
                      {(categories.find(c => c.name === form.category)?.subcategories || []).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="admin-label">Description</label>
                    <textarea className="admin-textarea" rows={4} value={form.description || ''} onChange={e => updateForm('description', e.target.value)} placeholder="Describe your product..." />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="admin-label">Materials</label>
                    <textarea className="admin-textarea" rows={2} value={form.materials || ''} onChange={e => updateForm('materials', e.target.value)} placeholder="Materials used..." />
                  </div>
                  <div>
                    <label className="admin-label">Tags (comma-separated)</label>
                    <input className="admin-input" value={(form.tags || []).join(', ')} onChange={e => updateForm('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} placeholder="handmade, eco-friendly, boho" />
                  </div>
                  <div>
                    <label className="admin-label">Status</label>
                    <select className="admin-select" value={form.status || 'published'} onChange={e => updateForm('status', e.target.value)} disabled={currentAdmin.role === 'staff'}>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="pending">Pending Approval</option>
                    </select>
                    {currentAdmin.role === 'staff' && <p style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 4 }}>Staff uploads are automatically set to "Pending Approval"</p>}
                  </div>
                  <div>
                    <label className="admin-label">Badge</label>
                    <select className="admin-select" value={form.badgeType || ''} onChange={e => { updateForm('badgeType', e.target.value); updateForm('badge', e.target.value === 'bestseller' ? 'BESTSELLER' : e.target.value === 'new' ? 'NEW' : e.target.value === 'save' ? form.discount || '' : ''); }}>
                      <option value="">None</option>
                      <option value="bestseller">Bestseller</option>
                      <option value="new">New</option>
                      <option value="save">Save %</option>
                    </select>
                  </div>
                  <div>
                    <label className="admin-label"><input type="checkbox" checked={form.featured || false} onChange={e => updateForm('featured', e.target.checked)} style={{ marginRight: 6 }} />Featured Product</label>
                  </div>
                </div>
              )}

              {productFormTab === 'pricing' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                  <div>
                    <label className="admin-label">Original Price (₹) *</label>
                    <input type="number" className="admin-input" value={form.originalPrice || ''} onChange={e => updateForm('originalPrice', e.target.value)} />
                  </div>
                  <div>
                    <label className="admin-label">Sale Price (₹) *</label>
                    <input type="number" className="admin-input" value={form.salePrice || ''} onChange={e => updateForm('salePrice', e.target.value)} />
                  </div>
                  <div>
                    <label className="admin-label">Cost Price (₹)</label>
                    <input type="number" className="admin-input" value={form.costPrice || ''} onChange={e => updateForm('costPrice', e.target.value)} />
                  </div>
                  <div>
                    <label className="admin-label">Discount Label</label>
                    <input className="admin-input" value={form.discount || ''} onChange={e => updateForm('discount', e.target.value)} placeholder="e.g. SAVE 40%" />
                  </div>
                  <div>
                    <label className="admin-label">Stock Quantity</label>
                    <input type="number" className="admin-input" value={form.stock ?? ''} onChange={e => updateForm('stock', e.target.value)} />
                  </div>
                  <div>
                    <label className="admin-label">Low Stock Threshold</label>
                    <input type="number" className="admin-input" value={form.lowStockThreshold || 10} onChange={e => updateForm('lowStockThreshold', e.target.value)} />
                  </div>
                  {(form.originalPrice && form.salePrice && Number(form.originalPrice) > Number(form.salePrice)) && (
                    <div style={{ gridColumn: '1 / -1', padding: 12, background: 'rgba(122,158,126,0.08)', borderRadius: 8, border: '1px solid rgba(122,158,126,0.15)' }}>
                      <span style={{ fontSize: 12, color: '#7A9E7E', fontWeight: 600 }}>
                        Profit margin: {formatCurrency(Number(form.salePrice) - Number(form.costPrice || 0))} per unit ({form.costPrice ? Math.round(((Number(form.salePrice) - Number(form.costPrice)) / Number(form.salePrice)) * 100) : '—'}% margin)
                      </span>
                    </div>
                  )}
                </div>
              )}

              {productFormTab === 'images' && (
                <div>
                  <h3 className="admin-label" style={{ marginBottom: '16px', fontSize: '14px' }}>Product Media Gallery (Up to 8 Images + 1 Video)</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {/* Primary Image Slot */}
                    <div>
                      <label className="admin-label">Primary Cover Image (Slot 1) *</label>
                      {form.image1 ? (
                        <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--admin-border)' }}>
                          <img src={form.image1} alt="Primary" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button 
                            type="button" 
                            onClick={() => updateForm('image1', '')}
                            style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              backgroundColor: 'rgba(220, 53, 69, 0.9)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                              transition: 'background 0.2s'
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <label htmlFor="primary-image-input" className="admin-upload-zone" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px', gap: '8px' }}>
                          <Upload size={32} color="var(--admin-text-secondary)" />
                          <span style={{ fontSize: '13px', fontWeight: '600' }}>Upload Cover Image</span>
                          <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>Required cover display</span>
                          <input 
                            id="primary-image-input" 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => updateForm('image1', ev.target.result);
                                reader.readAsDataURL(file);
                              }
                            }}
                            style={{ display: 'none' }} 
                          />
                        </label>
                      )}
                      <div style={{ marginTop: '12px' }}>
                        <input 
                          className="admin-input" 
                          value={form.image1 || ''} 
                          onChange={e => updateForm('image1', e.target.value)} 
                          placeholder="Or paste primary image URL..." 
                          style={{ fontSize: '12px', padding: '8px 12px' }}
                        />
                      </div>
                    </div>

                    {/* Product Video Slot */}
                    <div>
                      <label className="admin-label">Product Video (Optional)</label>
                      {form.video ? (
                        <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--admin-border)', backgroundColor: '#000' }}>
                          <video src={form.video} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          <button 
                            type="button" 
                            onClick={() => updateForm('video', '')}
                            style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              backgroundColor: 'rgba(220, 53, 69, 0.9)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                              zIndex: 10
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <label htmlFor="video-upload-input" className="admin-upload-zone" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px', gap: '8px' }}>
                          <Upload size={32} color="var(--admin-text-secondary)" />
                          <span style={{ fontSize: '13px', fontWeight: '600' }}>Upload Video File</span>
                          <span style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>MP4, WEBM up to 20MB</span>
                          <input 
                            id="video-upload-input" 
                            type="file" 
                            accept="video/*" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 20 * 1024 * 1024) {
                                  showToast('Video size exceeds 20MB limit', 'error');
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onload = (ev) => updateForm('video', ev.target.result);
                                reader.readAsDataURL(file);
                              }
                            }}
                            style={{ display: 'none' }} 
                          />
                        </label>
                      )}
                      <div style={{ marginTop: '12px' }}>
                        <input 
                          className="admin-input" 
                          value={form.video || ''} 
                          onChange={e => updateForm('video', e.target.value)} 
                          placeholder="Or paste video URL..." 
                          style={{ fontSize: '12px', padding: '8px 12px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional 7 Images Grid */}
                  <div style={{ marginTop: '30px' }}>
                    <label className="admin-label" style={{ marginBottom: '12px' }}>Additional Images (Slots 2 to 8)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                      {[2, 3, 4, 5, 6, 7, 8].map((num) => {
                        const fieldName = `image${num}`;
                        const val = form[fieldName];
                        return (
                          <div key={num} style={{ display: 'flex', flexDirection: 'column' }}>
                            {val ? (
                              <div style={{ position: 'relative', width: '100%', height: '120px', borderRadius: '8px', overflow: 'hidden', border: '1.5px solid var(--admin-border)' }}>
                                <img src={val} alt={`Slot ${num}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button 
                                  type="button" 
                                  onClick={() => updateForm(fieldName, '')}
                                  style={{
                                    position: 'absolute',
                                    top: '6px',
                                    right: '6px',
                                    backgroundColor: 'rgba(220, 53, 69, 0.9)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
                                  }}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ) : (
                              <label htmlFor={`image-input-${num}`} className="admin-upload-zone" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '120px', gap: '4px', padding: '12px' }}>
                                <Upload size={18} color="var(--admin-text-secondary)" />
                                <span style={{ fontSize: '11px', fontWeight: '600' }}>Slot {num}</span>
                                <input 
                                  id={`image-input-${num}`} 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (ev) => updateForm(fieldName, ev.target.result);
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  style={{ display: 'none' }} 
                                />
                              </label>
                            )}
                            <input 
                              className="admin-input" 
                              value={val || ''} 
                              onChange={e => updateForm(fieldName, e.target.value)} 
                              placeholder={`URL for slot ${num}...`} 
                              style={{ fontSize: '11px', padding: '6px 10px', marginTop: '6px' }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {productFormTab === 'shipping' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                  <div>
                    <label className="admin-label">Weight (grams)</label>
                    <input type="number" className="admin-input" value={form.weight || ''} onChange={e => updateForm('weight', e.target.value)} />
                  </div>
                  <div>
                    <label className="admin-label">Shipping Info</label>
                    <textarea className="admin-textarea" rows={3} value={form.shipping || ''} onChange={e => updateForm('shipping', e.target.value)} placeholder="Shipping details..." />
                  </div>
                  <div>
                    <label className="admin-label">Sizes (comma-separated)</label>
                    <input className="admin-input" value={(form.sizes || []).join(', ')} onChange={e => updateForm('sizes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="Small, Medium, Large" />
                  </div>
                  <div>
                    <label className="admin-label">Color Names (comma-separated)</label>
                    <input className="admin-input" value={(form.colorNames || []).join(', ')} onChange={e => updateForm('colorNames', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="Natural Ivory, Terracotta" />
                  </div>
                </div>
              )}

              {productFormTab === 'seo' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, maxWidth: 600 }}>
                  <div>
                    <label className="admin-label">SEO Title</label>
                    <input className="admin-input" value={form.seoTitle || form.name || ''} onChange={e => updateForm('seoTitle', e.target.value)} />
                    <p style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 4 }}>{(form.seoTitle || form.name || '').length}/60 characters</p>
                  </div>
                  <div>
                    <label className="admin-label">SEO Description</label>
                    <textarea className="admin-textarea" rows={3} value={form.seoDesc || form.description || ''} onChange={e => updateForm('seoDesc', e.target.value)} />
                    <p style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 4 }}>{(form.seoDesc || form.description || '').length}/160 characters</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="admin-btn admin-btn-secondary" onClick={() => setEditingProduct(null)}>Cancel</button>
            <button className="admin-btn admin-btn-gold" onClick={handleSave}><Check size={16} /> {isNew ? 'Create Product' : 'Save Changes'}</button>
          </div>
        </div>
      );
    }

    // Product List
    const filtered = products.filter(p => {
      if (productFilter === 'published' && p.status !== 'published') return false;
      if (productFilter === 'draft' && p.status !== 'draft') return false;
      if (productFilter === 'pending' && p.status !== 'pending') return false;
      if (productFilter === 'low_stock' && (p.stock > p.lowStockThreshold || p.stock === 0)) return false;
      if (productFilter === 'out_of_stock' && p.stock !== 0) return false;
      if (productSearch && !p.name.toLowerCase().includes(productSearch.toLowerCase()) && !p.sku?.toLowerCase().includes(productSearch.toLowerCase())) return false;
      return true;
    });
    const perPage = 10;
    const paged = filtered.slice((productPage - 1) * perPage, productPage * perPage);

    const handleSelectAll = (checked) => {
      if (checked) {
        setSelectedProducts(paged.map(p => p.id));
      } else {
        setSelectedProducts([]);
      }
    };

    const handleSelectOne = (id, checked) => {
      if (checked) {
        setSelectedProducts(prev => [...prev, id]);
      } else {
        setSelectedProducts(prev => prev.filter(pId => pId !== id));
      }
    };

    const handleBulkPublish = () => {
      selectedProducts.forEach(id => {
        store.updateProduct(id, { status: 'published' });
      });
      setSelectedProducts([]);
      showToast(`${selectedProducts.length} products published`);
    };

    const handleBulkDraft = () => {
      selectedProducts.forEach(id => {
        store.updateProduct(id, { status: 'draft' });
      });
      setSelectedProducts([]);
      showToast(`${selectedProducts.length} products marked as draft`);
    };

    const handleBulkDelete = () => {
      setConfirmModal({
        title: 'Bulk Delete Products',
        message: `Delete the ${selectedProducts.length} selected products? This action cannot be undone.`,
        danger: true,
        onConfirm: () => {
          selectedProducts.forEach(id => {
            store.deleteProduct(id);
          });
          setSelectedProducts([]);
          setConfirmModal(null);
          showToast('Selected products deleted');
        }
      });
    };

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Products</h1>
          {(currentAdmin.role !== 'support') && (
            <button className="admin-btn admin-btn-gold" onClick={() => { setEditingProduct('new'); setProductForm({ status: currentAdmin.role === 'staff' ? 'pending' : 'published', lowStockThreshold: 10, tags: [], sizes: [], colorNames: [], colors: [] }); setProductFormTab('basic'); }}><Plus size={16} /> Add Product</button>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 250px', maxWidth: 320 }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            <input className="admin-input" style={{ paddingLeft: 32 }} placeholder="Search products..." value={productSearch} onChange={e => { setProductSearch(e.target.value); setProductPage(1); }} />
          </div>
          <select className="admin-select" style={{ width: 'auto', minWidth: 160 }} value={productFilter} onChange={e => { setProductFilter(e.target.value); setProductPage(1); }}>
            <option value="all">All Products ({products.length})</option>
            <option value="published">Published ({products.filter(p => p.status === 'published').length})</option>
            <option value="draft">Draft ({products.filter(p => p.status === 'draft').length})</option>
            <option value="pending">Pending ({products.filter(p => p.status === 'pending').length})</option>
            <option value="low_stock">Low Stock ({products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length})</option>
            <option value="out_of_stock">Out of Stock ({products.filter(p => p.stock === 0).length})</option>
          </select>

          {selectedProducts.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-text-secondary)' }}>
                {selectedProducts.length} selected
              </span>
              <button className="admin-btn admin-btn-sm admin-btn-secondary" onClick={handleBulkPublish}>Publish</button>
              <button className="admin-btn admin-btn-sm admin-btn-secondary" onClick={handleBulkDraft}>Draft</button>
              {(currentAdmin.role === 'super_admin' || currentAdmin.role === 'manager') && (
                <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={handleBulkDelete}>Delete</button>
              )}
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="admin-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 40, textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={paged.length > 0 && paged.every(p => selectedProducts.includes(p.id))} 
                      onChange={e => handleSelectAll(e.target.checked)} 
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                  <th style={{ width: 50 }}></th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 && <tr><td colSpan={9}><div className="admin-empty-state">No products found</div></td></tr>}
                {paged.map(p => (
                  <tr key={p.id} style={{ background: selectedProducts.includes(p.id) ? 'rgba(192,120,80,0.04)' : 'none' }}>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedProducts.includes(p.id)} 
                        onChange={e => handleSelectOne(p.id, e.target.checked)} 
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td><img src={p.image1} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--admin-border)' }} /></td>
                    <td><div style={{ fontWeight: 600, fontSize: 13 }}>{truncate(p.name, 32)}</div>{p.featured && <span style={{ fontSize: 10, color: '#D4A96A' }}>★ Featured</span>}</td>
                    <td style={{ fontSize: 12, color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>{p.sku || '—'}</td>
                    <td style={{ fontSize: 12 }}>{p.category}</td>
                    <td><div style={{ fontWeight: 600 }}>{formatCurrency(p.salePrice)}</div><div style={{ fontSize: 11, color: 'var(--admin-text-muted)', textDecoration: 'line-through' }}>{formatCurrency(p.originalPrice)}</div></td>
                    <td><span style={{ fontWeight: 600, color: p.stock === 0 ? '#DC3545' : p.stock <= (p.lowStockThreshold || 10) ? '#D4A96A' : '#7A9E7E' }}>{p.stock}</span></td>
                    <td><span className={`admin-pill ${statusColor(p.status)}`}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {p.status === 'pending' && (currentAdmin.role === 'super_admin' || currentAdmin.role === 'manager') && (
                          <button className="admin-btn-icon" title="Approve" onClick={() => { store.approveProduct(p.id); showToast('Product approved!'); }}><Check size={15} color="#7A9E7E" /></button>
                        )}
                        <button className="admin-btn-icon" title="Edit" onClick={() => { setEditingProduct(p.id); setProductForm({ ...p }); setProductFormTab('basic'); }}><Edit3 size={15} /></button>
                        {(currentAdmin.role === 'super_admin' || currentAdmin.role === 'manager') && (
                          <button className="admin-btn-icon" title="Delete" onClick={() => setConfirmModal({ title: 'Delete Product', message: `Delete "${p.name}"? This cannot be undone.`, danger: true, onConfirm: () => { store.deleteProduct(p.id); setConfirmModal(null); showToast('Product deleted'); } })}><Trash2 size={15} color="#DC3545" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '0 16px 16px' }}><Pagination page={productPage} total={filtered.length} perPage={perPage} onPageChange={setProductPage} /></div>
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════
  // CATALOGUE / CATEGORY MANAGEMENT
  // ════════════════════════════════════════════════════════════════

  const renderCatalogue = () => {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newSubcategoryName, setNewSubcategoryName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [editingCatId, setEditingCatId] = useState(null);
    const [editingCatName, setEditingCatName] = useState('');

    const handleAddCategory = () => {
      if (!newCategoryName.trim()) return;
      store.addCategory({ name: newCategoryName.trim(), subcategories: [] });
      setNewCategoryName('');
      showToast('Category added successfully!');
    };

    const handleAddSubcategory = (catId) => {
      if (!newSubcategoryName.trim()) return;
      const cat = store.categories.find(c => c.id === catId);
      if (cat) {
        const updatedSubs = [...cat.subcategories, newSubcategoryName.trim()];
        store.updateCategory(catId, { subcategories: updatedSubs });
        setNewSubcategoryName('');
        showToast('Subcategory added!');
      }
    };

    const handleDeleteSubcategory = (catId, subName) => {
      const cat = store.categories.find(c => c.id === catId);
      if (cat) {
        const updatedSubs = cat.subcategories.filter(s => s !== subName);
        store.updateCategory(catId, { subcategories: updatedSubs });
        showToast('Subcategory removed');
      }
    };

    const handleSaveCategoryEdit = (catId) => {
      if (!editingCatName.trim()) return;
      store.updateCategory(catId, { name: editingCatName.trim() });
      setEditingCatId(null);
      showToast('Category renamed');
    };

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Catalogue & Categories</h2>
            <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', marginTop: 4 }}>Manage product categories and sub-categories</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Categories List */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>All Categories</h3>
            </div>
            <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Add Category Form */}
              <div style={{ display: 'flex', gap: 12 }}>
                <input 
                  className="admin-input" 
                  value={newCategoryName} 
                  onChange={e => setNewCategoryName(e.target.value)} 
                  placeholder="New category name..." 
                />
                <button className="admin-btn admin-btn-primary" onClick={handleAddCategory} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={16} /> Add Category
                </button>
              </div>

              {/* Categories Table */}
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Subcategories</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {store.categories.map(cat => (
                    <tr 
                      key={cat.id} 
                      style={{ cursor: 'pointer', background: selectedCategoryId === cat.id ? 'rgba(192,120,80,0.06)' : 'none' }}
                      onClick={() => setSelectedCategoryId(cat.id)}
                    >
                      <td>{cat.id}</td>
                      <td>
                        {editingCatId === cat.id ? (
                          <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
                            <input 
                              className="admin-input admin-input-sm" 
                              value={editingCatName} 
                              onChange={e => setEditingCatName(e.target.value)} 
                              style={{ padding: '4px 8px' }}
                            />
                            <button className="admin-btn-icon" onClick={() => handleSaveCategoryEdit(cat.id)}><Check size={14} /></button>
                          </div>
                        ) : (
                          <span style={{ fontWeight: 600 }}>{cat.name}</span>
                        )}
                      </td>
                      <td>{cat.subcategories?.length || 0} items</td>
                      <td style={{ textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <button className="admin-btn-icon" title="Edit" onClick={() => { setEditingCatId(cat.id); setEditingCatName(cat.name); }}><Edit3 size={14} /></button>
                          <button 
                            className="admin-btn-icon" 
                            title="Delete" 
                            onClick={() => setConfirmModal({ 
                              title: 'Delete Category', 
                              message: `Delete category "${cat.name}"? This will delete all subcategories.`, 
                              danger: true, 
                              onConfirm: () => { store.deleteCategory(cat.id); setConfirmModal(null); setSelectedCategoryId(null); showToast('Category deleted'); } 
                            })}
                          >
                            <Trash2 size={14} color="#DC3545" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subcategories Panel */}
          <div className="admin-card">
            <div className="admin-card-header">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>
                {selectedCategoryId 
                  ? `Subcategories of "${store.categories.find(c => c.id === selectedCategoryId)?.name}"` 
                  : 'Select a category to view subcategories'
                }
              </h3>
            </div>
            <div className="admin-card-body">
              {selectedCategoryId ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Add Subcategory */}
                  <div style={{ display: 'flex', gap: 12 }}>
                    <input 
                      className="admin-input" 
                      value={newSubcategoryName} 
                      onChange={e => setNewSubcategoryName(e.target.value)} 
                      placeholder="New subcategory name..." 
                    />
                    <button className="admin-btn admin-btn-primary" onClick={() => handleAddSubcategory(selectedCategoryId)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Plus size={16} /> Add Subcategory
                    </button>
                  </div>

                  {/* Subcategories list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(store.categories.find(c => c.id === selectedCategoryId)?.subcategories || []).map(sub => (
                      <div 
                        key={sub} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          padding: '10px 14px', 
                          borderRadius: 8, 
                          background: 'var(--admin-bg)', 
                          border: '1px solid var(--admin-border)' 
                        }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--admin-text)' }}>{sub}</span>
                        <button 
                          className="admin-btn-icon" 
                          onClick={() => handleDeleteSubcategory(selectedCategoryId, sub)}
                          style={{ color: 'var(--admin-danger)' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {(store.categories.find(c => c.id === selectedCategoryId)?.subcategories || []).length === 0 && (
                      <div className="admin-empty-state" style={{ padding: 32 }}>
                        <p style={{ color: 'var(--admin-text-muted)', fontSize: 13 }}>No subcategories found. Add one above.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="admin-empty-state" style={{ padding: 60 }}>
                  <Layers size={32} color="var(--admin-text-muted)" style={{ marginBottom: 12 }} />
                  <p style={{ color: 'var(--admin-text-secondary)', fontSize: 13 }}>Choose a category from the left table to edit its subcategories.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════
  // ORDER MANAGEMENT
  // ════════════════════════════════════════════════════════════════

  const renderOrders = () => {
    // Order Detail View
    if (selectedOrder) {
      const o = selectedOrder;
      const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
      const currentStep = statusSteps.indexOf(o.status);

      return (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <button className="admin-btn admin-btn-secondary" onClick={() => setSelectedOrder(null)}><ChevronLeft size={16} /> Back</button>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Order #{o.id}</h2>
            <span className={`admin-pill ${statusColor(o.status)}`}>{o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 20 }}>
            {/* Order Timeline */}
            <div className="admin-card">
              <div className="admin-card-header"><h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Order Status</h3></div>
              <div className="admin-card-body">
                {o.status !== 'cancelled' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {statusSteps.map((step, i) => (
                      <div key={step} className="admin-timeline-step">
                        <div className={`admin-timeline-dot ${i < currentStep ? 'completed' : i === currentStep ? 'current' : 'pending'}`}>
                          {i < currentStep ? <Check size={12} /> : i === currentStep ? <Zap size={12} /> : <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--admin-border)' }} />}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: i <= currentStep ? 'var(--admin-text)' : 'var(--admin-text-muted)' }}>{step.charAt(0).toUpperCase() + step.slice(1)}</div>
                          {i <= currentStep && <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>{formatDate(i === 0 ? o.createdAt : o.updatedAt)}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 16 }}>
                    <X size={32} color="#DC3545" style={{ margin: '0 auto 8px' }} />
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#DC3545' }}>Order Cancelled</p>
                    <p style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{o.notes}</p>
                  </div>
                )}

                {/* Status Update Buttons */}
                {o.status !== 'cancelled' && o.status !== 'delivered' && (currentAdmin.role !== 'support') && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                    {o.status === 'pending' && <button className="admin-btn admin-btn-gold admin-btn-sm" onClick={() => { store.updateOrderStatus(o.id, 'processing'); setSelectedOrder({ ...o, status: 'processing' }); showToast('Order marked as Processing'); }}>Mark Processing</button>}
                    {o.status === 'processing' && <button className="admin-btn admin-btn-gold admin-btn-sm" onClick={() => { store.updateOrderStatus(o.id, 'shipped'); setSelectedOrder({ ...o, status: 'shipped' }); showToast('Order marked as Shipped'); }}>Mark Shipped</button>}
                    {o.status === 'shipped' && <button className="admin-btn admin-btn-success admin-btn-sm" onClick={() => { store.updateOrderStatus(o.id, 'delivered'); setSelectedOrder({ ...o, status: 'delivered' }); showToast('Order delivered!'); }}>Mark Delivered</button>}
                    {(currentAdmin.role === 'super_admin' || currentAdmin.role === 'manager') && (
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => { store.updateOrderStatus(o.id, 'cancelled'); setSelectedOrder({ ...o, status: 'cancelled' }); showToast('Order cancelled'); }}>Cancel Order</button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Customer Info */}
            <div className="admin-card">
              <div className="admin-card-header"><h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Customer</h3></div>
              <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6B3A2A, #C07850)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5E6CC', fontSize: 14, fontWeight: 700 }}>{o.customer.name.split(' ').map(w => w[0]).join('')}</div>
                  <div><div style={{ fontWeight: 600, fontSize: 14 }}>{o.customer.name}</div></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--admin-text-secondary)' }}><Mail size={14} /> {o.customer.email}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--admin-text-secondary)' }}><Phone size={14} /> {o.customer.phone}</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--admin-text-secondary)' }}><MapPin size={14} style={{ flexShrink: 0, marginTop: 2 }} /> {o.customer.address}</div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="admin-card" style={{ marginBottom: 16 }}>
            <div className="admin-card-header"><h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Items</h3></div>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead><tr><th></th><th>Product</th><th>Variant</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
                <tbody>
                  {o.items.map((item, i) => (
                    <tr key={i}>
                      <td><img src={item.image} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} /></td>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{item.variant}</td>
                      <td>{item.qty}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, borderTop: '1px solid var(--admin-border)' }}>
              <div style={{ display: 'flex', gap: 40, fontSize: 13 }}><span style={{ color: 'var(--admin-text-muted)' }}>Subtotal:</span><span>{formatCurrency(o.subtotal)}</span></div>
              <div style={{ display: 'flex', gap: 40, fontSize: 13 }}><span style={{ color: 'var(--admin-text-muted)' }}>Shipping:</span><span>{o.shipping === 0 ? 'Free' : formatCurrency(o.shipping)}</span></div>
              {o.discount > 0 && <div style={{ display: 'flex', gap: 40, fontSize: 13 }}><span style={{ color: '#7A9E7E' }}>Discount:</span><span style={{ color: '#7A9E7E' }}>-{formatCurrency(o.discount)}</span></div>}
              <div style={{ display: 'flex', gap: 40, fontSize: 13 }}><span style={{ color: 'var(--admin-text-muted)' }}>Tax (GST):</span><span>{formatCurrency(o.tax)}</span></div>
              <div style={{ display: 'flex', gap: 40, fontSize: 15, fontWeight: 700, borderTop: '1px solid var(--admin-border)', paddingTop: 8, marginTop: 4 }}><span>Total:</span><span>{formatCurrency(o.total)}</span></div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="admin-card">
            <div className="admin-card-header"><h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Payment</h3></div>
            <div className="admin-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                <div><span style={{ fontSize: 11, color: 'var(--admin-text-muted)', display: 'block' }}>Method</span><span style={{ fontSize: 13, fontWeight: 600 }}>{o.payment.method}</span></div>
                <div><span style={{ fontSize: 11, color: 'var(--admin-text-muted)', display: 'block' }}>Status</span><span className={`admin-pill ${o.payment.status === 'Paid' ? 'admin-pill-success' : o.payment.status === 'Refunded' ? 'admin-pill-danger' : 'admin-pill-warning'}`}>{o.payment.status}</span></div>
                {o.payment.transactionId && <div><span style={{ fontSize: 11, color: 'var(--admin-text-muted)', display: 'block' }}>Transaction ID</span><span style={{ fontSize: 12, fontFamily: 'monospace' }}>{o.payment.transactionId}</span></div>}
                {o.notes && <div style={{ gridColumn: '1 / -1' }}><span style={{ fontSize: 11, color: 'var(--admin-text-muted)', display: 'block' }}>Notes</span><span style={{ fontSize: 13 }}>{o.notes}</span></div>}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Order List
    const filtered = orders.filter(o => {
      if (orderFilter !== 'all' && o.status !== orderFilter) return false;
      if (orderSearch && !`${o.id}`.includes(orderSearch) && !o.customer.name.toLowerCase().includes(orderSearch.toLowerCase())) return false;
      return true;
    });
    const sorted = [...filtered].sort((a, b) => b.id - a.id);
    const perPage = 10;
    const paged = sorted.slice((orderPage - 1) * perPage, orderPage * perPage);

    return (
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: 'var(--admin-text)', margin: '0 0 20px' }}>Orders</h1>

        {/* Status Tabs */}
        <div className="admin-tabs">
          {[{ key: 'all', label: 'All' }, { key: 'pending', label: 'Pending' }, { key: 'processing', label: 'Processing' }, { key: 'shipped', label: 'Shipped' }, { key: 'delivered', label: 'Delivered' }, { key: 'cancelled', label: 'Cancelled' }].map(t => (
            <button key={t.key} className={`admin-tab ${orderFilter === t.key ? 'active' : ''}`} onClick={() => { setOrderFilter(t.key); setOrderPage(1); }}>
              {t.label}
              {t.key !== 'all' && <span className="admin-tab-badge">{orders.filter(o => t.key === 'all' || o.status === t.key).length}</span>}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ position: 'relative', maxWidth: 320 }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            <input className="admin-input" style={{ paddingLeft: 32 }} placeholder="Search by Order ID or Customer..." value={orderSearch} onChange={e => { setOrderSearch(e.target.value); setOrderPage(1); }} />
          </div>
        </div>

        <div className="admin-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {paged.length === 0 && <tr><td colSpan={8}><div className="admin-empty-state">No orders found</div></td></tr>}
                {paged.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 600 }}>#{o.id}</td>
                    <td>{o.customer.name}</td>
                    <td>{o.items.length} item(s)</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(o.total)}</td>
                    <td><span className={`admin-pill ${o.payment.status === 'Paid' ? 'admin-pill-success' : o.payment.status === 'Refunded' ? 'admin-pill-danger' : 'admin-pill-warning'}`}>{o.payment.status}</span></td>
                    <td><span className={`admin-pill ${statusColor(o.status)}`}>{o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{formatDate(o.createdAt)}</td>
                    <td><button className="admin-btn-icon" title="View Details" onClick={() => setSelectedOrder(o)}><Eye size={15} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '0 16px 16px' }}><Pagination page={orderPage} total={filtered.length} perPage={perPage} onPageChange={setOrderPage} /></div>
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════
  // CUSTOMER MANAGEMENT
  // ════════════════════════════════════════════════════════════════

  const renderCustomers = () => {
    if (selectedCustomer) {
      const c = selectedCustomer;
      const custOrders = orders.filter(o => o.customer.email === c.email);
      return (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <button className="admin-btn admin-btn-secondary" onClick={() => setSelectedCustomer(null)}><ChevronLeft size={16} /> Back</button>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Customer Details</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 20 }}>
            <div className="admin-card">
              <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #6B3A2A, #C07850)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5E6CC', fontSize: 22, fontWeight: 700 }}>{c.avatar}</div>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{c.name}</h3>
                  <span className={`admin-pill ${statusColor(c.status)}`} style={{ marginTop: 6 }}>{c.status}</span>
                </div>
                <div style={{ width: '100%', borderTop: '1px solid var(--admin-border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--admin-text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={14} /> {c.email}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Phone size={14} /> {c.phone}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={14} /> Joined {formatDate(c.joined)}</div>
                </div>
                {currentAdmin.role === 'super_admin' && (
                  <button className={`admin-btn admin-btn-sm ${c.status === 'active' ? 'admin-btn-danger' : 'admin-btn-success'}`} onClick={() => { store.toggleCustomerBlock(c.id); setSelectedCustomer({ ...c, status: c.status === 'active' ? 'blocked' : 'active' }); showToast(c.status === 'active' ? 'Customer blocked' : 'Customer unblocked'); }}>
                    {c.status === 'active' ? <><UserX size={14} /> Block</> : <><UserCheck size={14} /> Unblock</>}
                  </button>
                )}
              </div>
            </div>
            <div className="admin-card">
              <div className="admin-card-header"><h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Summary</h3></div>
              <div className="admin-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ textAlign: 'center', padding: 16, background: 'var(--admin-surface-2)', borderRadius: 8 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--admin-text)' }}>{c.totalOrders}</div>
                    <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 4 }}>Total Orders</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: 16, background: 'var(--admin-surface-2)', borderRadius: 8 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#D4A96A' }}>{formatCurrency(c.totalSpent)}</div>
                    <div style={{ fontSize: 11, color: 'var(--admin-text-muted)', marginTop: 4 }}>Total Spent</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header"><h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Order History</h3></div>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead><tr><th>Order</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {custOrders.length === 0 && <tr><td colSpan={5}><div className="admin-empty-state">No orders</div></td></tr>}
                  {custOrders.map(o => (
                    <tr key={o.id} style={{ cursor: 'pointer' }} onClick={() => { nav('orders'); setTimeout(() => setSelectedOrder(o), 50); }}>
                      <td style={{ fontWeight: 600 }}>#{o.id}</td>
                      <td>{o.items.length}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(o.total)}</td>
                      <td><span className={`admin-pill ${statusColor(o.status)}`}>{o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span></td>
                      <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{formatDate(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    const filtered = customers.filter(c => !customerSearch || c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.email.toLowerCase().includes(customerSearch.toLowerCase()));
    const perPage = 10;
    const paged = filtered.slice((customerPage - 1) * perPage, customerPage * perPage);

    return (
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: 'var(--admin-text)', margin: '0 0 20px' }}>Customers</h1>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            <input className="admin-input" style={{ paddingLeft: 32 }} placeholder="Search customers..." value={customerSearch} onChange={e => { setCustomerSearch(e.target.value); setCustomerPage(1); }} />
          </div>
        </div>
        <div className="admin-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th></th><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total Spent</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {paged.map(c => (
                  <tr key={c.id}>
                    <td><div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6B3A2A, #C07850)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5E6CC', fontSize: 11, fontWeight: 700 }}>{c.avatar}</div></td>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td style={{ fontSize: 12, color: 'var(--admin-text-secondary)' }}>{c.email}</td>
                    <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{c.phone}</td>
                    <td>{c.totalOrders}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(c.totalSpent)}</td>
                    <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{formatDate(c.joined)}</td>
                    <td><span className={`admin-pill ${statusColor(c.status)}`}>{c.status}</span></td>
                    <td><button className="admin-btn-icon" title="View" onClick={() => setSelectedCustomer(c)}><Eye size={15} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '0 16px 16px' }}><Pagination page={customerPage} total={filtered.length} perPage={perPage} onPageChange={setCustomerPage} /></div>
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════
  // DISCOUNTS & COUPONS
  // ════════════════════════════════════════════════════════════════

  const renderDiscounts = () => {
    if (editingCoupon !== null) {
      const isNew = editingCoupon === 'new';
      const form = couponForm;
      const updateForm = (k, v) => setCouponForm(prev => ({ ...prev, [k]: v }));
      const handleSave = () => {
        if (!form.code || !form.value) { showToast('Please fill required fields', 'error'); return; }
        if (isNew) { store.addCoupon({ ...form, value: Number(form.value), minOrder: Number(form.minOrder) || 0, usageLimit: Number(form.usageLimit) || 100 }); showToast('Coupon created!'); }
        else { store.updateCoupon(editingCoupon, { ...form, value: Number(form.value), minOrder: Number(form.minOrder) || 0, usageLimit: Number(form.usageLimit) || 100 }); showToast('Coupon updated!'); }
        setEditingCoupon(null);
      };
      return (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <button className="admin-btn admin-btn-secondary" onClick={() => setEditingCoupon(null)}><ChevronLeft size={16} /> Back</button>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>{isNew ? 'New Coupon' : 'Edit Coupon'}</h2>
          </div>
          <div className="admin-card"><div className="admin-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
              <div><label className="admin-label">Coupon Code *</label><input className="admin-input" value={form.code || ''} onChange={e => updateForm('code', e.target.value.toUpperCase())} placeholder="e.g. CRAFT10" style={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em' }} /></div>
              <div><label className="admin-label">Type *</label><select className="admin-select" value={form.type || 'percentage'} onChange={e => updateForm('type', e.target.value)}><option value="percentage">Percentage (%)</option><option value="flat">Flat Amount (₹)</option></select></div>
              <div><label className="admin-label">Value *</label><input type="number" className="admin-input" value={form.value || ''} onChange={e => updateForm('value', e.target.value)} placeholder={form.type === 'percentage' ? 'e.g. 10' : 'e.g. 100'} /></div>
              <div><label className="admin-label">Minimum Order (₹)</label><input type="number" className="admin-input" value={form.minOrder || ''} onChange={e => updateForm('minOrder', e.target.value)} /></div>
              <div><label className="admin-label">Usage Limit</label><input type="number" className="admin-input" value={form.usageLimit || ''} onChange={e => updateForm('usageLimit', e.target.value)} /></div>
              <div><label className="admin-label">Applicable To</label><select className="admin-select" value={form.applicableTo || 'all'} onChange={e => updateForm('applicableTo', e.target.value)}><option value="all">All Products</option>{categories.map(c => <option key={c.id} value={`category:${c.name}`}>{c.name}</option>)}</select></div>
              <div><label className="admin-label">Start Date</label><input type="date" className="admin-input" value={form.startDate || ''} onChange={e => updateForm('startDate', e.target.value)} /></div>
              <div><label className="admin-label">End Date</label><input type="date" className="admin-input" value={form.endDate || ''} onChange={e => updateForm('endDate', e.target.value)} /></div>
              <div><label className="admin-label">Status</label><Toggle on={form.active !== false} onChange={() => updateForm('active', !form.active)} label={form.active !== false ? 'Active' : 'Inactive'} /></div>
            </div>
          </div></div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="admin-btn admin-btn-secondary" onClick={() => setEditingCoupon(null)}>Cancel</button>
            <button className="admin-btn admin-btn-gold" onClick={handleSave}><Check size={16} /> {isNew ? 'Create Coupon' : 'Save'}</button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Discounts & Coupons</h1>
          <button className="admin-btn admin-btn-gold" onClick={() => { setEditingCoupon('new'); setCouponForm({ type: 'percentage', active: true, applicableTo: 'all' }); }}><Plus size={16} /> New Coupon</button>
        </div>
        <div className="admin-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Usage</th><th>Valid Until</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {coupons.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700, letterSpacing: '0.06em', fontFamily: 'monospace' }}>{c.code}</td>
                    <td>{c.type === 'percentage' ? 'Percentage' : 'Flat'}</td>
                    <td style={{ fontWeight: 600 }}>{c.type === 'percentage' ? `${c.value}%` : formatCurrency(c.value)}</td>
                    <td>{formatCurrency(c.minOrder)}</td>
                    <td>{c.usedCount}/{c.usageLimit}</td>
                    <td style={{ fontSize: 12 }}>{formatDate(c.endDate)}</td>
                    <td><span className={`admin-pill ${c.active ? 'admin-pill-success' : 'admin-pill-grey'}`}>{c.active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="admin-btn-icon" onClick={() => { setEditingCoupon(c.id); setCouponForm({ ...c }); }}><Edit3 size={15} /></button>
                        <button className="admin-btn-icon" onClick={() => { store.updateCoupon(c.id, { active: !c.active }); showToast(c.active ? 'Coupon deactivated' : 'Coupon activated'); }}>{c.active ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                        <button className="admin-btn-icon" onClick={() => setConfirmModal({ title: 'Delete Coupon', message: `Delete coupon "${c.code}"?`, danger: true, onConfirm: () => { store.deleteCoupon(c.id); setConfirmModal(null); showToast('Coupon deleted'); } })}><Trash2 size={15} color="#DC3545" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════
  // REVIEWS & RATINGS
  // ════════════════════════════════════════════════════════════════

  const renderReviews = () => {
    const filtered = reviews.filter(r => reviewFilter === 'all' || r.status === reviewFilter);

    return (
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: 'var(--admin-text)', margin: '0 0 20px' }}>Reviews & Ratings</h1>
        <div className="admin-tabs">
          {[{ key: 'all', label: 'All' }, { key: 'pending', label: 'Pending' }, { key: 'approved', label: 'Approved' }, { key: 'rejected', label: 'Rejected' }].map(t => (
            <button key={t.key} className={`admin-tab ${reviewFilter === t.key ? 'active' : ''}`} onClick={() => setReviewFilter(t.key)}>
              {t.label} <span className="admin-tab-badge">{reviews.filter(r => t.key === 'all' || r.status === t.key).length}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.length === 0 && <div className="admin-empty-state admin-card">No reviews found</div>}
          {filtered.map(r => (
            <div key={r.id} className="admin-card">
              <div className="admin-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6B3A2A, #C07850)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5E6CC', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{r.customerName.split(' ').map(w => w[0]).join('')}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{r.customerName}</div>
                      <div style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>on <b>{r.productName}</b> · {formatDate(r.date)}</div>
                      <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={i < r.rating ? '#D4A96A' : 'none'} color={i < r.rating ? '#D4A96A' : 'var(--admin-border)'} />)}</div>
                      <p style={{ fontSize: 13, color: 'var(--admin-text)', marginTop: 8, lineHeight: 1.5 }}>{r.text}</p>
                      {r.adminReply && (
                        <div style={{ marginTop: 10, padding: '10px 14px', background: 'var(--admin-surface-2)', borderRadius: 8, borderLeft: '3px solid #D4A96A' }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#D4A96A' }}>Admin Reply:</span>
                          <p style={{ fontSize: 12, color: 'var(--admin-text-secondary)', margin: '4px 0 0' }}>{r.adminReply}</p>
                        </div>
                      )}
                      {replyingTo === r.id && (
                        <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                          <input className="admin-input" value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write a reply..." style={{ flex: 1 }} />
                          <button className="admin-btn admin-btn-gold admin-btn-sm" onClick={() => { store.replyToReview(r.id, replyText); setReplyingTo(null); setReplyText(''); showToast('Reply posted'); }}>Send</button>
                          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => { setReplyingTo(null); setReplyText(''); }}>Cancel</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <span className={`admin-pill ${statusColor(r.status)}`}>{r.status}</span>
                    {r.status === 'pending' && (
                      <>
                        <button className="admin-btn-icon" title="Approve" onClick={() => { store.approveReview(r.id); showToast('Review approved'); }}><ThumbsUp size={15} color="#7A9E7E" /></button>
                        <button className="admin-btn-icon" title="Reject" onClick={() => { store.rejectReview(r.id); showToast('Review rejected'); }}><ThumbsDown size={15} color="#DC3545" /></button>
                      </>
                    )}
                    <button className="admin-btn-icon" title="Reply" onClick={() => { setReplyingTo(r.id); setReplyText(r.adminReply || ''); }}><Reply size={15} /></button>
                    {(currentAdmin.role === 'super_admin' || currentAdmin.role === 'manager') && (
                      <button className="admin-btn-icon" title="Delete" onClick={() => setConfirmModal({ title: 'Delete Review', message: 'Delete this review permanently?', danger: true, onConfirm: () => { store.deleteReview(r.id); setConfirmModal(null); showToast('Review deleted'); } })}><Trash2 size={15} color="#DC3545" /></button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════
  // WEBSITE CONTENT
  // ════════════════════════════════════════════════════════════════

  const renderContent = () => {
    const [contentTab, setContentTab] = useState('banners');

    return (
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: 'var(--admin-text)', margin: '0 0 20px' }}>Website Content</h1>
        <div className="admin-tabs">
          {['banners', 'sections', 'policies', 'blog'].map(t => (
            <button key={t} className={`admin-tab ${contentTab === t ? 'active' : ''}`} onClick={() => setContentTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>

        {contentTab === 'banners' && (
          <div className="admin-card"><div className="admin-card-body">
            <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', marginBottom: 16 }}>Manage hero banners and promotional banners displayed on the storefront.</p>
            {[{ title: 'Hero Banner — New Arrivals', status: 'active', position: 1 }, { title: 'Festival Special — Diwali Collection', status: 'active', position: 2 }, { title: 'Sale — Up to 50% Off DIY Kits', status: 'inactive', position: 3 }].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 8, border: '1px solid var(--admin-border)', marginBottom: 8, background: 'var(--admin-surface-2)' }}>
                <GripVertical size={16} className="admin-drag-handle" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{b.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>Position: {b.position}</div>
                </div>
                <span className={`admin-pill ${b.status === 'active' ? 'admin-pill-success' : 'admin-pill-grey'}`}>{b.status}</span>
                <button className="admin-btn-icon"><Edit3 size={15} /></button>
              </div>
            ))}
          </div></div>
        )}

        {contentTab === 'sections' && (
          <div className="admin-card"><div className="admin-card-body">
            <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', marginBottom: 16 }}>Toggle visibility of homepage sections.</p>
            {['Announcement Bar', 'Hero Slider', 'Featured Categories', 'Flash Deals', 'Bestsellers', 'New Arrivals', 'Trust Badges', 'Instagram Gallery', 'Blog', 'Newsletter'].map((section, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--admin-border)' }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{section}</span>
                <Toggle on={true} onChange={() => showToast(`${section} visibility toggled`)} />
              </div>
            ))}
          </div></div>
        )}

        {contentTab === 'policies' && (
          <div className="admin-card"><div className="admin-card-body">
            <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', marginBottom: 16 }}>Edit legal and policy pages.</p>
            {['Privacy Policy', 'Terms & Conditions', 'Return & Refund Policy', 'Shipping Policy'].map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--admin-border)' }}>
                <div><div style={{ fontWeight: 600, fontSize: 13 }}>{p}</div><div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>Last updated: Jun 2026</div></div>
                <button className="admin-btn admin-btn-sm admin-btn-secondary"><Edit3 size={14} /> Edit</button>
              </div>
            ))}
          </div></div>
        )}

        {contentTab === 'blog' && (
          <div className="admin-card"><div className="admin-card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', margin: 0 }}>Manage blog posts.</p>
              <button className="admin-btn admin-btn-gold admin-btn-sm"><Plus size={14} /> New Post</button>
            </div>
            {['10 Macramé Patterns for Beginners', 'Natural Dyes from Your Kitchen', 'Setting Up Your First Craft Studio'].map((post, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--admin-border)' }}>
                <div><div style={{ fontWeight: 600, fontSize: 13 }}>{post}</div><div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>Published · 2 min read</div></div>
                <div style={{ display: 'flex', gap: 4 }}><button className="admin-btn-icon"><Edit3 size={15} /></button><button className="admin-btn-icon"><Trash2 size={15} color="#DC3545" /></button></div>
              </div>
            ))}
          </div></div>
        )}
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════
  // ANALYTICS & REPORTS
  // ════════════════════════════════════════════════════════════════

  const renderAnalytics = () => {
    const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
    const totalCost = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.items.reduce((is, item) => { const prod = products.find(p => p.id === item.productId); return is + (prod?.costPrice || 0) * item.qty; }, 0), 0);
    const totalProfit = totalRevenue - totalCost;
    const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.filter(o => o.status !== 'cancelled').length) : 0;

    const monthlyRevenue = [4200, 5800, 7100, 6400, 8200, 9500, 11200, 10800, 12400, 11900, 13200, totalRevenue > 0 ? Math.round(totalRevenue / 2) : 7800];
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: 'var(--admin-text)', margin: '0 0 20px' }}>Analytics & Reports</h1>

        {/* Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div className="admin-stat-card">
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase', margin: 0 }}>Revenue</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0' }}>{formatCurrency(totalRevenue)}</h2>
          </div>
          {(currentAdmin.role === 'super_admin') && (
            <div className="admin-stat-card">
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase', margin: 0 }}>Profit</p>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#7A9E7E', margin: '4px 0 0' }}>{formatCurrency(totalProfit)}</h2>
            </div>
          )}
          <div className="admin-stat-card">
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase', margin: 0 }}>Avg. Order Value</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0' }}>{formatCurrency(avgOrderValue)}</h2>
          </div>
          <div className="admin-stat-card">
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase', margin: 0 }}>Conversion Rate</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0' }}>3.8%</h2>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header"><h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Monthly Revenue</h3></div>
          <div className="admin-card-body"><LineChart data={monthlyRevenue} labels={monthLabels} width={600} height={220} color="#D4A96A" /></div>
        </div>

        {/* Top Products */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
          <div className="admin-card">
            <div className="admin-card-header"><h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Top Products by Reviews</h3></div>
            <div className="admin-card-body">
              {[...products].sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 5).map((p, i) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 4 ? '1px solid var(--admin-border)' : 'none' }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#D4A96A', color: '#1E1209', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                  <img src={p.image1} alt="" style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{truncate(p.name, 25)}</div></div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#D4A96A' }}>{p.reviewsCount} reviews</span>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header"><h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Order Status Distribution</h3></div>
            <div className="admin-card-body" style={{ display: 'flex', justifyContent: 'center' }}>
              <DonutChart data={[
                { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: '#7A9E7E' },
                { label: 'Shipped', value: orders.filter(o => o.status === 'shipped').length, color: '#D4A96A' },
                { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: '#6B3A2A' },
                { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: '#C07850' },
                { label: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, color: '#DC3545' },
              ]} size={160} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════
  // ADMIN & STAFF MANAGEMENT
  // ════════════════════════════════════════════════════════════════

  const renderAdminManagement = () => {
    if (editingAdminUser !== null) {
      const isNew = editingAdminUser === 'new';
      const form = adminUserForm;
      const updateForm = (k, v) => setAdminUserForm(prev => ({ ...prev, [k]: v }));
      const handleSave = () => {
        if (!form.name || !form.email || !form.password) { showToast('Please fill required fields', 'error'); return; }
        if (isNew) { store.addAdminUser(form); showToast('Admin user created!'); }
        else { store.updateAdminUser(editingAdminUser, form); showToast('Admin user updated!'); }
        setEditingAdminUser(null);
      };
      return (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <button className="admin-btn admin-btn-secondary" onClick={() => setEditingAdminUser(null)}><ChevronLeft size={16} /> Back</button>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>{isNew ? 'Add Staff Member' : 'Edit Staff Member'}</h2>
          </div>
          <div className="admin-card"><div className="admin-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
              <div><label className="admin-label">Full Name *</label><input className="admin-input" value={form.name || ''} onChange={e => updateForm('name', e.target.value)} /></div>
              <div><label className="admin-label">Email *</label><input type="email" className="admin-input" value={form.email || ''} onChange={e => updateForm('email', e.target.value)} /></div>
              <div><label className="admin-label">Password *</label><input type="text" className="admin-input" value={form.password || ''} onChange={e => updateForm('password', e.target.value)} /></div>
              <div><label className="admin-label">Phone</label><input className="admin-input" value={form.phone || ''} onChange={e => updateForm('phone', e.target.value)} /></div>
              <div><label className="admin-label">Role *</label><select className="admin-select" value={form.role || 'staff'} onChange={e => updateForm('role', e.target.value)}><option value="super_admin">Super Admin</option><option value="manager">Manager</option><option value="staff">Staff</option><option value="support">Support</option></select></div>
              <div><label className="admin-label">Status</label><select className="admin-select" value={form.status || 'active'} onChange={e => updateForm('status', e.target.value)}><option value="active">Active</option><option value="suspended">Suspended</option></select></div>
            </div>
          </div></div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="admin-btn admin-btn-secondary" onClick={() => setEditingAdminUser(null)}>Cancel</button>
            <button className="admin-btn admin-btn-gold" onClick={handleSave}><Check size={16} /> {isNew ? 'Create' : 'Save'}</button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Staff & Admin Management</h1>
          <button className="admin-btn admin-btn-gold" onClick={() => { setEditingAdminUser('new'); setAdminUserForm({ role: 'staff', status: 'active' }); }}><Plus size={16} /> Add Staff</button>
        </div>

        {/* Permission Matrix */}
        <div className="admin-card" style={{ marginBottom: 20 }}>
          <div className="admin-card-header"><h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Permission Matrix</h3></div>
          <div className="admin-card-body" style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Module</th><th>Super Admin</th><th>Manager</th><th>Staff</th><th>Support</th></tr></thead>
              <tbody>
                {['dashboard','products','orders','customers','discounts','reviews','content','analytics','admin_management','activity_logs','settings'].map(mod => (
                  <tr key={mod}><td style={{ fontWeight: 600, textTransform: 'capitalize' }}>{mod.replace('_', ' ')}</td>
                    {['super_admin','manager','staff','support'].map(role => (
                      <td key={role} style={{ textAlign: 'center' }}>{ROLE_ACCESS[role].includes(mod) ? <Check size={16} color="#7A9E7E" /> : <X size={16} color="var(--admin-text-muted)" style={{ opacity: 0.3 }} />}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Table */}
        <div className="admin-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th></th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
              <tbody>
                {adminUsers.map(u => (
                  <tr key={u.id}>
                    <td><div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6B3A2A, #C07850)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5E6CC', fontSize: 11, fontWeight: 700 }}>{u.avatar}</div></td>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ fontSize: 12, color: 'var(--admin-text-secondary)' }}>{u.email}</td>
                    <td><span className={`admin-pill ${ROLE_COLORS[u.role]}`}>{ROLE_LABELS[u.role]}</span></td>
                    <td><span className={`admin-pill ${u.status === 'active' ? 'admin-pill-success' : 'admin-pill-danger'}`}>{u.status}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--admin-text-muted)' }}>{u.lastLogin}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="admin-btn-icon" onClick={() => { setEditingAdminUser(u.id); setAdminUserForm({ ...u }); }}><Edit3 size={15} /></button>
                        {u.id !== currentAdmin.id && <button className="admin-btn-icon" onClick={() => setConfirmModal({ title: 'Delete User', message: `Delete "${u.name}"? This cannot be undone.`, danger: true, onConfirm: () => { store.deleteAdminUser(u.id); setConfirmModal(null); showToast('User deleted'); } })}><Trash2 size={15} color="#DC3545" /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════
  // ACTIVITY LOGS
  // ════════════════════════════════════════════════════════════════

  const renderActivityLogs = () => {
    const actionLabels = { product_create: 'Product Created', product_update: 'Product Updated', product_delete: 'Product Deleted', product_upload: 'Product Uploaded', product_approve: 'Product Approved', order_update: 'Order Updated', stock_update: 'Stock Updated', coupon_create: 'Coupon Created', coupon_delete: 'Coupon Deleted', review_approve: 'Review Approved', review_reject: 'Review Rejected', review_reply: 'Review Reply', review_delete: 'Review Deleted', admin_create: 'Admin Created', admin_update: 'Admin Updated', admin_delete: 'Admin Deleted', customer_update: 'Customer Updated', refund: 'Refund Processed', settings_update: 'Settings Updated' };
    const filtered = activityLogs.filter(l => logFilter === 'all' || l.action.startsWith(logFilter));

    return (
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: 'var(--admin-text)', margin: '0 0 20px' }}>Activity Logs</h1>
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <select className="admin-select" style={{ width: 'auto', minWidth: 200 }} value={logFilter} onChange={e => setLogFilter(e.target.value)}>
            <option value="all">All Activities</option>
            <option value="product">Product Changes</option>
            <option value="order">Order Changes</option>
            <option value="stock">Stock Changes</option>
            <option value="coupon">Coupon Changes</option>
            <option value="review">Review Actions</option>
            <option value="admin">Admin Changes</option>
            <option value="settings">Settings Changes</option>
          </select>
        </div>

        <div className="admin-card">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead><tr><th>Timestamp</th><th>Admin</th><th>Role</th><th>Action</th><th>Details</th><th>IP</th></tr></thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan={6}><div className="admin-empty-state">No logs found</div></td></tr>}
                {filtered.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>{l.timestamp}</td>
                    <td style={{ fontWeight: 600 }}>{l.adminName}</td>
                    <td><span className={`admin-pill ${ROLE_COLORS[l.role]}`}>{ROLE_LABELS[l.role]}</span></td>
                    <td><span className="admin-pill admin-pill-info">{actionLabels[l.action] || l.action}</span></td>
                    <td style={{ fontSize: 12, maxWidth: 300 }}>{l.details}</td>
                    <td style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--admin-text-muted)' }}>{l.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════
  // SETTINGS
  // ════════════════════════════════════════════════════════════════

  const renderSettings = () => {
    const [localSettings, setLocalSettings] = useState({ ...settings });
    const updateLocal = (key, val) => setLocalSettings(prev => ({ ...prev, [key]: val }));
    const handleSave = () => { store.updateSettings(localSettings); showToast('Settings saved!'); };

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Settings</h1>
          <button className="admin-btn admin-btn-gold" onClick={handleSave}><Check size={16} /> Save All</button>
        </div>

        <div className="admin-tabs">
          {['general', 'payment', 'shipping', 'tax', 'seo', 'maintenance'].map(t => (
            <button key={t} className={`admin-tab ${settingsTab === t ? 'active' : ''}`} onClick={() => setSettingsTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>

        <div className="admin-card">
          <div className="admin-card-body">
            {settingsTab === 'general' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                <div><label className="admin-label">Store Name</label><input className="admin-input" value={localSettings.storeName} onChange={e => updateLocal('storeName', e.target.value)} /></div>
                <div><label className="admin-label">Tagline</label><input className="admin-input" value={localSettings.tagline} onChange={e => updateLocal('tagline', e.target.value)} /></div>
                <div><label className="admin-label">Contact Email</label><input className="admin-input" value={localSettings.contactEmail} onChange={e => updateLocal('contactEmail', e.target.value)} /></div>
                <div><label className="admin-label">Contact Phone</label><input className="admin-input" value={localSettings.contactPhone} onChange={e => updateLocal('contactPhone', e.target.value)} /></div>
                <div style={{ gridColumn: '1 / -1' }}><label className="admin-label">Address</label><textarea className="admin-textarea" rows={2} value={localSettings.address} onChange={e => updateLocal('address', e.target.value)} /></div>
                <div><label className="admin-label">Currency</label><select className="admin-select" value={localSettings.currency} onChange={e => updateLocal('currency', e.target.value)}><option value="INR">INR (₹)</option><option value="USD">USD ($)</option></select></div>
                <div><label className="admin-label">Timezone</label><input className="admin-input" value={localSettings.timezone} disabled /></div>
              </div>
            )}

            {settingsTab === 'payment' && (
              <div>
                <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', marginBottom: 16 }}>Enable or disable payment methods.</p>
                {Object.entries(localSettings.paymentMethods).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--admin-border)' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase' }}>{key === 'netBanking' ? 'Net Banking' : key === 'cod' ? 'Cash on Delivery' : key}</span>
                    <Toggle on={val} onChange={() => updateLocal('paymentMethods', { ...localSettings.paymentMethods, [key]: !val })} />
                  </div>
                ))}
              </div>
            )}

            {settingsTab === 'shipping' && (
              <div>
                <p style={{ fontSize: 13, color: 'var(--admin-text-secondary)', marginBottom: 16 }}>Configure shipping zones and rates.</p>
                <div><label className="admin-label">Free Shipping Threshold (₹)</label><input type="number" className="admin-input" style={{ maxWidth: 200 }} value={localSettings.freeShippingThreshold} onChange={e => updateLocal('freeShippingThreshold', Number(e.target.value))} /></div>
                <div style={{ marginTop: 20 }}>
                  <table className="admin-table">
                    <thead><tr><th>Zone</th><th>Rate (₹)</th><th>Free Above (₹)</th></tr></thead>
                    <tbody>
                      {localSettings.shippingZones.map(z => (
                        <tr key={z.id}><td style={{ fontWeight: 600 }}>{z.name}</td><td>{formatCurrency(z.rate)}</td><td>{formatCurrency(z.freeAbove)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {settingsTab === 'tax' && (
              <div style={{ maxWidth: 400 }}>
                <div><label className="admin-label">GST Percentage (%)</label><input type="number" className="admin-input" value={localSettings.gstPercent} onChange={e => updateLocal('gstPercent', Number(e.target.value))} /></div>
                <div style={{ marginTop: 16 }}>
                  <Toggle on={localSettings.taxInclusive} onChange={() => updateLocal('taxInclusive', !localSettings.taxInclusive)} label={localSettings.taxInclusive ? 'Tax inclusive in prices' : 'Tax added at checkout'} />
                </div>
              </div>
            )}

            {settingsTab === 'seo' && (
              <div style={{ display: 'grid', gap: 20, maxWidth: 500 }}>
                <div><label className="admin-label">Meta Title</label><input className="admin-input" value={localSettings.seo.metaTitle} onChange={e => updateLocal('seo', { ...localSettings.seo, metaTitle: e.target.value })} /></div>
                <div><label className="admin-label">Meta Description</label><textarea className="admin-textarea" rows={3} value={localSettings.seo.metaDescription} onChange={e => updateLocal('seo', { ...localSettings.seo, metaDescription: e.target.value })} /></div>
                <div><label className="admin-label">Google Analytics ID</label><input className="admin-input" value={localSettings.seo.googleAnalyticsId} onChange={e => updateLocal('seo', { ...localSettings.seo, googleAnalyticsId: e.target.value })} placeholder="UA-XXXXXXXXX-X" /></div>
              </div>
            )}

            {settingsTab === 'maintenance' && (
              <div style={{ maxWidth: 500 }}>
                <div style={{ padding: 20, background: localSettings.maintenanceMode ? 'rgba(220,53,69,0.06)' : 'var(--admin-surface-2)', borderRadius: 12, border: `1px solid ${localSettings.maintenanceMode ? 'rgba(220,53,69,0.2)' : 'var(--admin-border)'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div><h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--admin-text)', margin: 0 }}>Maintenance Mode</h3><p style={{ fontSize: 12, color: 'var(--admin-text-muted)', margin: '4px 0 0' }}>When enabled, the storefront shows a maintenance page</p></div>
                    <Toggle on={localSettings.maintenanceMode} onChange={() => {
                      if (!localSettings.maintenanceMode) {
                        setConfirmModal({ title: 'Enable Maintenance Mode?', message: 'The storefront will be unavailable to customers. Are you sure?', danger: true, onConfirm: () => { updateLocal('maintenanceMode', true); setConfirmModal(null); } });
                      } else { updateLocal('maintenanceMode', false); }
                    }} />
                  </div>
                  <label className="admin-label">Maintenance Message</label>
                  <textarea className="admin-textarea" rows={2} value={localSettings.maintenanceMessage} onChange={e => updateLocal('maintenanceMessage', e.target.value)} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ════════════════════════════════════════════════════════════════

  const renderPage = () => {
    switch (adminPage) {
      case 'dashboard': return renderDashboard();
      case 'products': return renderProducts();
      case 'catalogue': return renderCatalogue();
      case 'orders': return renderOrders();
      case 'customers': return renderCustomers();
      case 'discounts': return renderDiscounts();
      case 'reviews': return renderReviews();
      case 'content': return renderContent();
      case 'analytics': return renderAnalytics();
      case 'admin_management': return renderAdminManagement();
      case 'activity_logs': return renderActivityLogs();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  return (
    <div className={`admin-panel ${darkMode ? 'admin-dark' : ''}`}>
      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && <div className="admin-sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="admin-sidebar-logo">
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #D4A96A, #C07850)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Store size={18} color="#1E1209" />
          </div>
          {!sidebarCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: '#F5E6CC', whiteSpace: 'nowrap' }}>Mothers Craft</div>
              <div style={{ fontSize: 10, color: 'rgba(245,230,204,0.4)', whiteSpace: 'nowrap' }}>Admin Panel</div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="admin-sidebar-nav">
          {navItems.map((item, i) => {
            if (item.section) {
              if (sidebarCollapsed) return <div key={i} style={{ height: 16 }} />;
              return <div key={i} className="admin-nav-section-label">{item.section}</div>;
            }
            return (
              <button key={item.key} className={`admin-nav-item ${adminPage === item.key ? 'active' : ''}`} onClick={() => nav(item.key)} title={sidebarCollapsed ? item.label : undefined}>
                <item.icon size={20} className="nav-icon" />
                {!sidebarCollapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                {!sidebarCollapsed && item.badge && <span style={{ minWidth: 18, height: 18, borderRadius: 9, background: '#DC3545', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <button className="admin-nav-item" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ borderRadius: 8 }}>
            {sidebarCollapsed ? <ChevronRight size={20} className="nav-icon" /> : <ChevronLeft size={20} className="nav-icon" />}
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* TOPBAR */}
      <header className={`admin-topbar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Mobile hamburger */}
          <button className="admin-btn-icon" style={{ display: 'none' }} onClick={() => setMobileMenuOpen(true)}>
            <Menu size={20} />
          </button>
          <style>{`@media (max-width: 1024px) { .admin-topbar .admin-btn-icon:first-child { display: flex !important; } }`}</style>

          {/* Breadcrumb */}
          <div style={{ fontSize: 13, color: 'var(--admin-text-muted)' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => nav('dashboard')}>Admin</span>
            <span style={{ margin: '0 6px' }}>/</span>
            <span style={{ color: 'var(--admin-text)', fontWeight: 600 }}>{adminPage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Global Search */}
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
            <input className="admin-input" style={{ paddingLeft: 32, width: 200, height: 36, fontSize: 12 }} placeholder="Search..." value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} />
          </div>

          {/* Dark Mode Toggle */}
          <button className="admin-btn-icon" onClick={() => setDarkMode(!darkMode)} title={darkMode ? 'Light Mode' : 'Dark Mode'}>
            {darkMode ? <Sun size={18} color="#D4A96A" /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button className="admin-btn-icon" onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}>
              <Bell size={18} />
              {notifications.length > 0 && <span className="admin-notif-badge">{notifications.length}</span>}
            </button>
            {notifOpen && (
              <div className="admin-dropdown" style={{ width: 320, right: 0 }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--admin-border)', fontWeight: 700, fontSize: 13, color: 'var(--admin-text)' }}>Notifications ({notifications.length})</div>
                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {notifications.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: 12 }}>No notifications</div>}
                  {notifications.map(n => (
                    <div key={n.id} className="admin-dropdown-item" style={{ alignItems: 'flex-start' }}>
                      {n.type === 'warning' ? <AlertTriangle size={14} color="#D4A96A" style={{ marginTop: 2, flexShrink: 0 }} /> : n.type === 'danger' ? <AlertCircle size={14} color="#DC3545" style={{ marginTop: 2, flexShrink: 0 }} /> : <Info size={14} color="#6B3A2A" style={{ marginTop: 2, flexShrink: 0 }} />}
                      <div><div style={{ fontSize: 12, lineHeight: 1.4 }}>{n.text}</div><div style={{ fontSize: 10, color: 'var(--admin-text-muted)', marginTop: 2 }}>{n.time}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Demo Role Switcher */}
          <select className="admin-select" style={{ width: 'auto', fontSize: 11, padding: '5px 28px 5px 8px', height: 32, background: 'var(--admin-surface-2)', borderRadius: 6 }} value={currentAdmin.role} onChange={e => store.switchDemoRole(e.target.value)}>
            <option value="super_admin">Super Admin</option>
            <option value="manager">Manager</option>
            <option value="staff">Staff</option>
            <option value="support">Support</option>
          </select>

          {/* Profile */}
          <div style={{ position: 'relative' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 8, border: '1px solid var(--admin-border)', background: 'var(--admin-surface)', cursor: 'pointer' }} onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #6B3A2A, #C07850)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5E6CC', fontSize: 10, fontWeight: 700 }}>{currentAdmin.avatar}</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-text)', lineHeight: 1 }}>{currentAdmin.name.split(' ')[0]}</div>
                <div style={{ fontSize: 10, color: 'var(--admin-text-muted)' }}>{ROLE_LABELS[currentAdmin.role]}</div>
              </div>
              <ChevronDown size={14} color="var(--admin-text-muted)" />
            </button>
            {profileOpen && (
              <div className="admin-dropdown" style={{ right: 0 }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--admin-border)' }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--admin-text)' }}>{currentAdmin.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>{currentAdmin.email}</div>
                  <span className={`admin-pill ${ROLE_COLORS[currentAdmin.role]}`} style={{ marginTop: 6 }}>{ROLE_LABELS[currentAdmin.role]}</span>
                </div>
                <button className="admin-dropdown-item" style={{ color: '#DC3545' }} onClick={() => { store.logout(); setProfileOpen(false); }}>
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {renderPage()}
      </main>

      {/* CONFIRM MODAL */}
      {confirmModal && <ConfirmModal {...confirmModal} onCancel={() => setConfirmModal(null)} />}

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, padding: '12px 20px', borderRadius: 10,
          background: toast.type === 'error' ? '#DC3545' : '#7A9E7E', color: '#fff',
          fontSize: 13, fontWeight: 600, zIndex: 9999, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: 8, animation: 'adminSlideUp 0.2s ease'
        }}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Close dropdowns on outside click */}
      {(notifOpen || profileOpen) && <div style={{ position: 'fixed', inset: 0, zIndex: 80 }} onClick={() => { setNotifOpen(false); setProfileOpen(false); }} />}
    </div>
  );
}
