import { useState, useMemo } from 'react';
import { useStore } from './StoreContext';
import {
  Package, MapPin, Heart, User, Star, ChevronLeft, LogOut,
  Plus, Edit3, Trash2, Check, ShoppingBag, Truck, Box,
  ArrowRight, X, Menu, Clock, MessageSquare, Phone, Mail
} from 'lucide-react';

// ════════════════════════════════════════════════════════════════
// HELPER
// ════════════════════════════════════════════════════════════════

function formatCurrency(n) { return `₹${Number(n || 0).toLocaleString('en-IN')}`; }
function formatDate(d) { if (!d) return '—'; try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return d; } }

const ORDER_STEPS = ['ordered', 'processing', 'shipped', 'delivered'];
const STEP_LABELS = { ordered: 'Ordered', processing: 'Packed', shipped: 'Shipped', delivered: 'Delivered' };
const STEP_ICONS = { ordered: ShoppingBag, processing: Box, shipped: Truck, delivered: Check };

function getTimelineState(status) {
  if (status === 'cancelled') return { steps: ORDER_STEPS, currentIdx: -1, cancelled: true };
  const idx = ORDER_STEPS.indexOf(status === 'pending' ? 'ordered' : status);
  return { steps: ORDER_STEPS, currentIdx: idx >= 0 ? idx : 0, cancelled: false };
}

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh",
  "Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"
];

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════

export default function UserAccount({ onNavigateHome, wishlistItems = [], onMoveToCart, onRemoveFromWishlist }) {
  const {
    currentUser, userLogout, updateUserProfile,
    addUserAddress, updateUserAddress, deleteUserAddress,
    getUserOrders, getUserReviews, submitUserReview,
    products,
  } = useStore();

  const [activeSection, setActiveSection] = useState('orders');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addrForm, setAddrForm] = useState({ label: 'Home', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false });

  // Profile edit state
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewProductId, setReviewProductId] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Expanded order
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Get data
  const userOrders = useMemo(() => getUserOrders(), [getUserOrders]);
  const userReviews = useMemo(() => getUserReviews(), [getUserReviews]);

  if (!currentUser) return null;

  const navItems = [
    { id: 'orders', label: 'My Orders', icon: Package, badge: userOrders.length },
    { id: 'addresses', label: 'My Addresses', icon: MapPin, badge: currentUser.addresses?.length || 0 },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart, badge: wishlistItems.length },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'reviews', label: 'My Reviews', icon: Star, badge: userReviews.length },
  ];

  // ── Address Form Handlers ──
  const openAddressForm = (addr = null) => {
    if (addr) {
      setEditingAddress(addr);
      setAddrForm({ label: addr.label, name: addr.name, phone: addr.phone, line1: addr.line1, line2: addr.line2, city: addr.city, state: addr.state, pincode: addr.pincode, isDefault: addr.isDefault });
    } else {
      setEditingAddress(null);
      setAddrForm({ label: 'Home', name: currentUser.name, phone: currentUser.phone, line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false });
    }
    setShowAddressForm(true);
  };

  const saveAddress = () => {
    if (!addrForm.name || !addrForm.line1 || !addrForm.city || !addrForm.state || !addrForm.pincode) return;
    if (editingAddress) {
      updateUserAddress(editingAddress.id, addrForm);
    } else {
      addUserAddress(addrForm);
    }
    setShowAddressForm(false);
  };

  // ── Profile Handlers ──
  const startProfileEdit = () => {
    setProfileForm({ name: currentUser.name, email: currentUser.email, phone: currentUser.phone });
    setProfileEditing(true);
  };

  const saveProfile = () => {
    updateUserProfile({
      name: profileForm.name,
      phone: profileForm.phone,
      avatar: profileForm.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
    });
    setProfileEditing(false);
  };

  // ── Review Handlers ──
  const handleSubmitReview = () => {
    if (!reviewProductId || !reviewText.trim()) return;
    submitUserReview(parseInt(reviewProductId), reviewRating, reviewText);
    setShowReviewForm(false);
    setReviewProductId('');
    setReviewRating(5);
    setReviewText('');
  };

  // Get products that the user has ordered (for review dropdown)
  const orderedProductIds = [...new Set(userOrders.flatMap(o => o.items.map(i => i.productId)))];
  const reviewableProducts = products.filter(p => orderedProductIds.includes(p.id));

  // ════════════════════════════════════════════════════════════════
  // RENDER SECTIONS
  // ════════════════════════════════════════════════════════════════

  const renderOrders = () => (
    <div>
      <h1 className="ua-page-title">My Orders</h1>
      <p className="ua-page-subtitle">Track and manage your order history</p>

      {userOrders.length === 0 ? (
        <div className="ua-empty-state">
          <div className="ua-empty-icon"><Package /></div>
          <div className="ua-empty-title">No Orders Yet</div>
          <div className="ua-empty-text">Looks like you haven't placed any orders. Start exploring our crafts collection!</div>
          <button className="ua-btn ua-btn-primary" onClick={onNavigateHome}>
            <ShoppingBag size={16} /> Start Shopping
          </button>
        </div>
      ) : (
        <div>
          {userOrders.map(order => {
            const timeline = getTimelineState(order.status);
            const isExpanded = expandedOrderId === order.id;
            return (
              <div key={order.id} className="ua-card ua-order-card">
                <div className="ua-card-header" style={{ cursor: 'pointer' }} onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}>
                  <div>
                    <div className="ua-order-id">Order #{order.id}</div>
                    <div className="ua-order-date">Placed on {formatDate(order.createdAt)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className={`ua-status ua-status-${order.status}`}>
                      {order.status === 'cancelled' ? '✕ Cancelled' : order.status}
                    </span>
                    <ArrowRight size={16} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', color: 'var(--ua-text-muted)' }} />
                  </div>
                </div>

                <div className="ua-card-body">
                  <div className="ua-order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="ua-order-item">
                        <img src={item.image} alt={item.name} className="ua-order-item-img" />
                        <div className="ua-order-item-info">
                          <div className="ua-order-item-name">{item.name}</div>
                          <div className="ua-order-item-variant">{item.variant}</div>
                          <div className="ua-order-item-qty">Qty: {item.qty}</div>
                        </div>
                        <div className="ua-order-item-price">{formatCurrency(item.price * item.qty)}</div>
                      </div>
                    ))}
                  </div>

                  {/* Order Timeline — show when expanded */}
                  {isExpanded && !timeline.cancelled && (
                    <div className="ua-timeline" style={{ marginTop: 20 }}>
                      {timeline.steps.map((step, idx) => {
                        const Icon = STEP_ICONS[step];
                        const isCompleted = idx < timeline.currentIdx;
                        const isActive = idx === timeline.currentIdx;
                        return (
                          <div key={step} className={`ua-timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                            <div className="ua-timeline-dot"><Icon size={14} /></div>
                            <div className="ua-timeline-label">{STEP_LABELS[step]}</div>
                            {(isCompleted || isActive) && <div className="ua-timeline-date">{formatDate(order.updatedAt)}</div>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div style={{ marginTop: 16, padding: '16px', background: 'var(--ua-bg)', borderRadius: 'var(--ua-radius-sm)', fontSize: 13, color: 'var(--ua-text-secondary)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <strong style={{ color: 'var(--ua-text)', display: 'block', marginBottom: 4 }}>Delivery Address</strong>
                          {order.customer.address}
                        </div>
                        <div>
                          <strong style={{ color: 'var(--ua-text)', display: 'block', marginBottom: 4 }}>Payment</strong>
                          {order.payment.method} — {order.payment.status}
                          {order.payment.transactionId && <div style={{ fontSize: 11, marginTop: 2 }}>Txn: {order.payment.transactionId}</div>}
                        </div>
                      </div>
                      {order.notes && (
                        <div style={{ marginTop: 12 }}>
                          <strong style={{ color: 'var(--ua-text)' }}>Notes:</strong> {order.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="ua-order-footer">
                  <div className="ua-order-total">
                    <span>Total:</span> {formatCurrency(order.total)}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {order.status === 'delivered' && (
                      <button className="ua-btn ua-btn-outline ua-btn-sm" onClick={() => { setActiveSection('reviews'); setShowReviewForm(true); }}>
                        <Star size={14} /> Write Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderAddresses = () => (
    <div>
      <h1 className="ua-page-title">My Addresses</h1>
      <p className="ua-page-subtitle">Manage your delivery addresses</p>

      <div className="ua-addresses-grid">
        {(currentUser.addresses || []).map(addr => (
          <div key={addr.id} className={`ua-address-card ${addr.isDefault ? 'default' : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <span className="ua-address-label">
                <MapPin size={12} /> {addr.label}
              </span>
              {addr.isDefault && <span className="ua-address-default-badge">Default</span>}
            </div>
            <div className="ua-address-name">{addr.name}</div>
            <div className="ua-address-detail">
              {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
              {addr.city}, {addr.state} — {addr.pincode}
            </div>
            <div className="ua-address-phone">
              <Phone size={12} style={{ marginRight: 4, verticalAlign: -2 }} />{addr.phone}
            </div>
            <div className="ua-address-actions">
              <button className="ua-btn ua-btn-ghost ua-btn-sm" onClick={() => openAddressForm(addr)}>
                <Edit3 size={13} /> Edit
              </button>
              {!addr.isDefault && (
                <button className="ua-btn ua-btn-ghost ua-btn-sm" onClick={() => updateUserAddress(addr.id, { isDefault: true })}>
                  <Check size={13} /> Set Default
                </button>
              )}
              <button className="ua-btn ua-btn-ghost ua-btn-sm" style={{ color: 'var(--ua-danger)' }} onClick={() => deleteUserAddress(addr.id)}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}

        <button className="ua-add-card" onClick={() => openAddressForm()}>
          <Plus />
          <span>Add New Address</span>
        </button>
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div>
      <h1 className="ua-page-title">My Wishlist</h1>
      <p className="ua-page-subtitle">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later</p>

      {wishlistItems.length === 0 ? (
        <div className="ua-empty-state">
          <div className="ua-empty-icon"><Heart /></div>
          <div className="ua-empty-title">Your Wishlist is Empty</div>
          <div className="ua-empty-text">Browse our collection and tap the ♥ icon to save items you love!</div>
          <button className="ua-btn ua-btn-primary" onClick={onNavigateHome}>
            <ShoppingBag size={16} /> Browse Collection
          </button>
        </div>
      ) : (
        <div className="ua-wishlist-grid">
          {wishlistItems.map(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) return null;
            return (
              <div key={product.id} className="ua-wishlist-card">
                <img src={product.image1} alt={product.name} className="ua-wishlist-img" />
                <div className="ua-wishlist-body">
                  <div className="ua-wishlist-name">{product.name}</div>
                  <div>
                    <span className="ua-wishlist-price">{formatCurrency(product.salePrice)}</span>
                    {product.originalPrice > product.salePrice && (
                      <span className="ua-wishlist-original-price">{formatCurrency(product.originalPrice)}</span>
                    )}
                  </div>
                  <div className="ua-wishlist-actions">
                    <button className="ua-btn ua-btn-primary ua-btn-sm" onClick={() => onMoveToCart && onMoveToCart(product)}>
                      <ShoppingBag size={13} /> Add to Cart
                    </button>
                    <button className="ua-btn ua-btn-ghost ua-btn-sm" style={{ color: 'var(--ua-danger)', flex: 'none' }} onClick={() => onRemoveFromWishlist && onRemoveFromWishlist(product.id)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div>
      <h1 className="ua-page-title">My Profile</h1>
      <p className="ua-page-subtitle">Manage your personal information</p>

      <div className="ua-card" style={{ maxWidth: 560 }}>
        <div className="ua-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="ua-sidebar-avatar" style={{ width: 48, height: 48, fontSize: 18 }}>
              {currentUser.avatar}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{currentUser.name}</div>
              <div style={{ fontSize: 12, color: 'var(--ua-text-muted)' }}>Member since {formatDate(currentUser.joined)}</div>
            </div>
          </div>
          {!profileEditing && (
            <button className="ua-btn ua-btn-outline ua-btn-sm" onClick={startProfileEdit}>
              <Edit3 size={13} /> Edit
            </button>
          )}
        </div>
        <div className="ua-card-body">
          {profileEditing ? (
            <>
              <div className="ua-form-group">
                <label className="ua-form-label">Full Name</label>
                <input className="ua-form-input" value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="ua-form-group">
                <label className="ua-form-label">Email Address</label>
                <input className="ua-form-input" value={profileForm.email} disabled style={{ cursor: 'not-allowed' }} />
                <div style={{ fontSize: 11, color: 'var(--ua-text-muted)', marginTop: 4 }}>Email cannot be changed</div>
              </div>
              <div className="ua-form-group">
                <label className="ua-form-label">Phone Number</label>
                <input className="ua-form-input" value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button className="ua-btn ua-btn-primary" onClick={saveProfile}>
                  <Check size={14} /> Save Changes
                </button>
                <button className="ua-btn ua-btn-ghost" onClick={() => setProfileEditing(false)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ua-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Full Name</div>
                  <div style={{ fontSize: 15, color: 'var(--ua-text)', display: 'flex', alignItems: 'center', gap: 8 }}><User size={16} style={{ color: 'var(--ua-primary)' }} /> {currentUser.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ua-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Email</div>
                  <div style={{ fontSize: 15, color: 'var(--ua-text)', display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={16} style={{ color: 'var(--ua-primary)' }} /> {currentUser.email}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ua-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Phone</div>
                  <div style={{ fontSize: 15, color: 'var(--ua-text)', display: 'flex', alignItems: 'center', gap: 8 }}><Phone size={16} style={{ color: 'var(--ua-primary)' }} /> {currentUser.phone || '—'}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Account Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginTop: 24 }}>
        {[
          { label: 'Total Orders', value: userOrders.length, icon: Package, color: '#C07850' },
          { label: 'Saved Addresses', value: currentUser.addresses?.length || 0, icon: MapPin, color: '#7A9E7E' },
          { label: 'Wishlist Items', value: wishlistItems.length, icon: Heart, color: '#C48B9F' },
          { label: 'Reviews Given', value: userReviews.length, icon: Star, color: '#D4A96A' },
        ].map((stat, i) => (
          <div key={i} className="ua-card" style={{ padding: 20, textAlign: 'center' }}>
            <stat.icon size={24} style={{ color: stat.color, marginBottom: 8 }} />
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--ua-text)' }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: 'var(--ua-text-muted)', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <h1 className="ua-page-title">My Reviews</h1>
          <p className="ua-page-subtitle">Your product reviews and ratings</p>
        </div>
        {reviewableProducts.length > 0 && (
          <button className="ua-btn ua-btn-primary" onClick={() => setShowReviewForm(true)}>
            <Plus size={14} /> Write Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="ua-card" style={{ marginBottom: 24 }}>
          <div className="ua-card-header">
            <span style={{ fontWeight: 600, fontSize: 15 }}>Write a Review</span>
            <button className="ua-btn-icon" onClick={() => setShowReviewForm(false)}><X size={18} /></button>
          </div>
          <div className="ua-card-body">
            <div className="ua-form-group">
              <label className="ua-form-label">Select Product</label>
              <select className="ua-form-select" value={reviewProductId} onChange={e => setReviewProductId(e.target.value)}>
                <option value="">Choose a product to review…</option>
                {reviewableProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="ua-form-group">
              <label className="ua-form-label">Rating</label>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setReviewRating(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                    <Star size={24} fill={s <= reviewRating ? '#FFB300' : 'none'} color={s <= reviewRating ? '#FFB300' : '#ccc'} />
                  </button>
                ))}
              </div>
            </div>
            <div className="ua-form-group">
              <label className="ua-form-label">Your Review</label>
              <textarea className="ua-form-input" rows={4} value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience with this product…" style={{ resize: 'vertical' }} />
            </div>
            <button className="ua-btn ua-btn-primary" onClick={handleSubmitReview}>
              <Check size={14} /> Submit Review
            </button>
          </div>
        </div>
      )}

      {userReviews.length === 0 && !showReviewForm ? (
        <div className="ua-empty-state">
          <div className="ua-empty-icon"><MessageSquare /></div>
          <div className="ua-empty-title">No Reviews Yet</div>
          <div className="ua-empty-text">Share your experience! Your reviews help other crafters make better choices.</div>
          {reviewableProducts.length > 0 && (
            <button className="ua-btn ua-btn-primary" onClick={() => setShowReviewForm(true)}>
              <Star size={14} /> Write Your First Review
            </button>
          )}
        </div>
      ) : (
        <div>
          {userReviews.map(review => (
            <div key={review.id} className="ua-review-card">
              <div className="ua-review-header">
                <div className="ua-review-product">{review.productName}</div>
                <span className={`ua-status ${review.status === 'approved' ? 'ua-status-delivered' : review.status === 'rejected' ? 'ua-status-cancelled' : 'ua-status-pending'}`}>
                  {review.status}
                </span>
              </div>
              <div className="ua-review-stars">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} fill={s <= review.rating ? '#FFB300' : 'none'} color={s <= review.rating ? '#FFB300' : '#ddd'} />
                ))}
              </div>
              <div className="ua-review-text">{review.text}</div>
              <div className="ua-review-meta">
                <span><Clock size={12} /> {formatDate(review.date)}</span>
              </div>
              {review.adminReply && (
                <div className="ua-review-admin-reply">
                  <strong>Mothers Craft replied:</strong>
                  <div style={{ marginTop: 4 }}>{review.adminReply}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ════════════════════════════════════════════════════════════════

  const sectionRenderers = { orders: renderOrders, addresses: renderAddresses, wishlist: renderWishlist, profile: renderProfile, reviews: renderReviews };

  return (
    <div className="ua-container">
      {/* Mobile sidebar backdrop */}
      <div className={`ua-sidebar-backdrop ${mobileSidebarOpen ? 'open' : ''}`} onClick={() => setMobileSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`ua-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
        <div className="ua-sidebar-header">
          <div className="ua-sidebar-avatar">{currentUser.avatar}</div>
          <div className="ua-sidebar-user-info">
            <div className="ua-sidebar-user-name">{currentUser.name}</div>
            <div className="ua-sidebar-user-email">{currentUser.email}</div>
          </div>
        </div>
        <nav className="ua-sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`ua-sidebar-nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => { setActiveSection(item.id); setMobileSidebarOpen(false); }}
            >
              <item.icon size={20} />
              {item.label}
              {item.badge > 0 && <span className="ua-sidebar-nav-badge">{item.badge}</span>}
            </button>
          ))}
          <div className="ua-sidebar-divider" />
          <button className="ua-sidebar-nav-item" onClick={onNavigateHome}>
            <ShoppingBag size={20} /> Continue Shopping
          </button>
          <button className="ua-sidebar-nav-item logout" onClick={() => { userLogout(); onNavigateHome(); }}>
            <LogOut size={20} /> Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ua-main">
        <button className="ua-back-link" onClick={onNavigateHome}>
          <ChevronLeft size={16} /> Back to Store
        </button>
        {sectionRenderers[activeSection]?.()}
      </main>

      {/* Mobile sidebar toggle */}
      <button className="ua-mobile-toggle" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>
        {mobileSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="ua-modal-overlay" onClick={() => setShowAddressForm(false)}>
          <div className="ua-modal" onClick={e => e.stopPropagation()}>
            <div className="ua-modal-header">
              <div className="ua-modal-title">{editingAddress ? 'Edit Address' : 'Add New Address'}</div>
              <button className="ua-btn-icon" onClick={() => setShowAddressForm(false)}><X size={18} /></button>
            </div>
            <div className="ua-modal-body">
              <div className="ua-form-row">
                <div className="ua-form-group">
                  <label className="ua-form-label">Address Label</label>
                  <select className="ua-form-select" value={addrForm.label} onChange={e => setAddrForm(f => ({ ...f, label: e.target.value }))}>
                    <option>Home</option>
                    <option>Office</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="ua-form-group">
                  <label className="ua-form-label">Full Name *</label>
                  <input className="ua-form-input" value={addrForm.name} onChange={e => setAddrForm(f => ({ ...f, name: e.target.value }))} />
                </div>
              </div>
              <div className="ua-form-group">
                <label className="ua-form-label">Phone Number *</label>
                <input className="ua-form-input" value={addrForm.phone} onChange={e => setAddrForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="ua-form-group">
                <label className="ua-form-label">Address Line 1 *</label>
                <input className="ua-form-input" value={addrForm.line1} onChange={e => setAddrForm(f => ({ ...f, line1: e.target.value }))} placeholder="House No., Street, Colony" />
              </div>
              <div className="ua-form-group">
                <label className="ua-form-label">Address Line 2</label>
                <input className="ua-form-input" value={addrForm.line2} onChange={e => setAddrForm(f => ({ ...f, line2: e.target.value }))} placeholder="Landmark, Area (Optional)" />
              </div>
              <div className="ua-form-row">
                <div className="ua-form-group">
                  <label className="ua-form-label">City *</label>
                  <input className="ua-form-input" value={addrForm.city} onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))} />
                </div>
                <div className="ua-form-group">
                  <label className="ua-form-label">Pincode *</label>
                  <input className="ua-form-input" value={addrForm.pincode} onChange={e => setAddrForm(f => ({ ...f, pincode: e.target.value }))} maxLength={6} />
                </div>
              </div>
              <div className="ua-form-group">
                <label className="ua-form-label">State *</label>
                <select className="ua-form-select" value={addrForm.state} onChange={e => setAddrForm(f => ({ ...f, state: e.target.value }))}>
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', color: 'var(--ua-text-secondary)' }}>
                <input type="checkbox" checked={addrForm.isDefault} onChange={e => setAddrForm(f => ({ ...f, isDefault: e.target.checked }))} />
                Set as default address
              </label>
            </div>
            <div className="ua-modal-footer">
              <button className="ua-btn ua-btn-ghost" onClick={() => setShowAddressForm(false)}>Cancel</button>
              <button className="ua-btn ua-btn-primary" onClick={saveAddress}>
                <Check size={14} /> {editingAddress ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
