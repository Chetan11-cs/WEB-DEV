import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- SEPARATE FILE IMPORTS ---
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';

// --- SHARED NAVBAR ---
const Navbar = ({ cartCount, user, setShowAuth, setIsSideMenuOpen }) => (
  <nav style={{ 
    background: 'rgba(40, 116, 240, 0.95)', 
    backdropFilter: 'blur(10px)',
    color: 'white', 
    padding: '12px 10%', 
    display: 'flex', 
    alignItems: 'center', 
    position: 'sticky', 
    top: 0, 
    zIndex: 1000, 
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)' 
  }}>
    <div style={{ fontSize: '24px', cursor: 'pointer', marginRight: '20px', transition: '0.3s' }} onClick={() => setIsSideMenuOpen(true)}>☰</div>
    <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', flex: 1 }}>
      <h1 style={{ margin: 0, fontStyle: 'italic', fontSize: '26px', fontWeight: '800', letterSpacing: '1px' }}>CS<span style={{color: '#ff9f00'}}>Market</span></h1>
    </Link>
    <div style={{ flex: 2, margin: '0 30px' }}>
      <input 
        type="text" 
        placeholder="Search for perfection..." 
        id="mainSearch"
        style={{ 
            width: '100%', padding: '12px 20px', borderRadius: '30px', border: 'none', 
            outline: 'none', background: 'rgba(255,255,255,0.15)', color: 'white',
            border: '1px solid rgba(255,255,255,0.3)', transition: '0.3s'
        }} 
        onFocus={(e) => e.target.style.background = 'rgba(255,255,255,0.25)'}
        onBlur={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
      />
    </div>
    <div style={{ display: 'flex', gap: '25px', alignItems: 'center', fontWeight: 'bold' }}>
      {user ? (
        <Link to="/profile" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{width: '32px', height: '32px', background: '#ff9f00', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px'}}>{user.name[0]}</div>
            {user.name} ▼
        </Link>
      ) : (
        <button onClick={() => setShowAuth(true)} style={{ background: 'white', color: '#2874f0', border: 'none', padding: '8px 25px', cursor: 'pointer', fontWeight: 'bold', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>Login</button>
      )}
      <Link to="/cart" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <span style={{fontSize: '22px'}}>🛒</span>
        <span style={{ position: 'absolute', top: '-10px', right: '-12px', background: '#ff9f00', color: 'white', padding: '2px 7px', borderRadius: '50%', fontSize: '11px', fontWeight: '800' }}>{cartCount}</span>
      </Link>
    </div>
  </nav>
);

// --- SIDE MENU ---
const SideMenu = ({ isOpen, setIsOpen, user, handleLogout }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 2000 }} onClick={() => setIsOpen(false)}>
      <div className="animate-slide-in" style={{ width: '320px', height: '100%', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', boxShadow: '20px 0 50px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
        <div style={{ backgroundColor: '#2874f0', color: 'white', padding: '40px 25px', borderRadius: '0 0 30px 0' }}>
          <h3 style={{margin: 0, fontSize: '22px'}}>👤 {user ? user.name : 'Guest User'}</h3>
          <p style={{ fontSize: '13px', opacity: 0.8, marginTop: '5px' }}>{user ? user.email : 'Explore the best market'}</p>
        </div>
        <div style={{ flex: 1, padding: '25px' }}>
          <Link to="/profile" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: '#333' }}><div className="menu-item">Profile Information</div></Link>
          <Link to="/my-orders" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: '#333' }}><div className="menu-item">My Orders</div></Link>
        </div>
        {user && <button onClick={handleLogout} style={{ margin: '20px', padding: '15px', background: '#fb641b', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '12px', boxShadow: '0 10px 20px rgba(251, 100, 27, 0.3)' }}>LOGOUT</button>}
      </div>
    </div>
  );
};

// --- PAGE: FULL CART ---
const CartPage = ({ cart, setCart, onOrder }) => {
  const total = cart.reduce((acc, curr) => acc + curr.price, 0);
  return (
    <div className="animate-fade-in" style={{ padding: '40px 10%', display: 'flex', gap: '30px' }}>
      <div style={{ flex: 0.7, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <h2 style={{marginTop: 0}}>Shopping Cart ({cart.length})</h2>
        <hr style={{border: 'none', height: '1px', background: '#eee', margin: '20px 0'}} />
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{fontSize: '18px', color: '#666'}}>Your bag is empty!</p>
            <Link to="/"><button style={{ background: '#2874f0', color: 'white', border: 'none', padding: '12px 30px', cursor: 'pointer', borderRadius: '30px' }}>Shop Now</button></Link>
          </div>
        ) : cart.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '25px', padding: '20px 0', borderBottom: '1px solid #f0f0f0' }}>
            <img src={item.image} style={{ width: '100px', height: '100px', objectFit: 'contain', borderRadius: '15px' }} alt="" />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0 }}>{item.name}</h4>
              <h3 style={{ margin: '15px 0' }}>${item.price}</h3>
              <button onClick={() => setCart(cart.filter((_, idx) => idx !== i))} style={{ color: '#ff4d4d', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>REMOVE</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ flex: 0.3, background: 'white', padding: '30px', borderRadius: '20px', height: 'fit-content', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <h3>ORDER SUMMARY</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0', borderTop: '2px dashed #eee', paddingTop: '20px', fontWeight: 'bold', fontSize: '20px', color: '#1e3c72' }}>
          <span>Total Amount</span>
          <span>${total}</span>
        </div>
        <button onClick={() => onOrder(cart)} style={{ width: '100%', padding: '15px', background: 'linear-gradient(90deg, #fb641b, #ff9f00)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '15px' }}>CHECKOUT NOW</button>
      </div>
    </div>
  );
};

// --- PAGE: HOME ---
const Home = ({ products, setCategory, searchTerm }) => {
  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    <div className="animate-fade-in" style={{padding: '0 10% 50px'}}>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', gap: '15px', padding: '15px', borderRadius: '0 0 30px 30px', marginBottom: '40px' }}>
        {['All', 'Electronics', 'Clothing', 'Accessories'].map(cat => (
          <b key={cat} onClick={() => setCategory(cat === 'All' ? '' : cat)} style={{ cursor: 'pointer', color: '#2874f0', padding: '8px 20px' }}>{cat}</b>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '30px' }}>
        {filtered.map(p => (
          <Link to={`/product/${p._id}`} key={p._id} style={{ textDecoration: 'none', color: 'black' }}>
            <div className="product-card" style={{ backgroundColor: 'white', padding: '25px', textAlign: 'center', borderRadius: '25px', border: '1px solid #f0f0f0' }}>
              <img src={p.image} alt="" style={{ height: '180px', objectFit: 'contain' }} />
              <h4 style={{ margin: '20px 0 10px', height: '40px', overflow: 'hidden' }}>{p.name}</h4>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#1e3c72' }}>${p.price}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);
  const [orders, setOrders] = useState(JSON.parse(localStorage.getItem('userOrders')) || []);
  const [showAuth, setShowAuth] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => { if (!user) setShowAuth(true); }, [user]);

  useEffect(() => {
    const url = category ? `http://localhost:5000/api/products?category=${category}` : `http://localhost:5000/api/products`;
    axios.get(url).then(res => setProducts(res.data)).catch(err => console.error(err));
    const handleInput = (e) => setSearchTerm(e.target.value);
    document.getElementById('mainSearch')?.addEventListener('input', handleInput);
    return () => document.getElementById('mainSearch')?.removeEventListener('input', handleInput);
  }, [category]);

  const handleLogin = (e) => {
    e.preventDefault();
    const data = { name: 'Chetan Sonawane', email: 'chetan@csmarket.com', phone: '9876543210', address: 'Dindori, Nashik', photo: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' };
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    setShowAuth(false);
  };

  const handleLogout = () => { localStorage.removeItem('userInfo'); setUser(null); setIsSideMenuOpen(false); };

  const handleProcessOrder = (itemsToBuy) => {
    if (!user) return setShowAuth(true);
    setIsProcessingPayment(true);
    setTimeout(() => {
      const newOrders = (Array.isArray(itemsToBuy) ? itemsToBuy : [itemsToBuy]).map(p => ({
        id: Math.floor(Math.random() * 1000000),
        name: p.name,
        price: p.price,
        image: p.image,
        orderDate: new Date().toLocaleDateString(),
        arrivalDate: new Date(Date.now() + 345600000).toLocaleDateString()
      }));
      const updated = [...newOrders, ...orders];
      setOrders(updated);
      localStorage.setItem('userOrders', JSON.stringify(updated));
      setIsProcessingPayment(false);
      alert(`✅ Payment Successful! Item added to My Orders.`);
      if (Array.isArray(itemsToBuy)) setCart([]); 
    }, 2000);
  };

  const handleCancelOrder = (id) => {
    if (window.confirm("Cancel this order?")) {
      const filtered = orders.filter(o => o.id !== id);
      setOrders(filtered);
      localStorage.setItem('userOrders', JSON.stringify(filtered));
    }
  };

  return (
    <Router>
      <div style={{ backgroundColor: '#f4f7fa', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        <Navbar cartCount={cart.length} user={user} setShowAuth={setShowAuth} setIsSideMenuOpen={setIsSideMenuOpen} />
        <SideMenu isOpen={isSideMenuOpen} setIsOpen={setIsSideMenuOpen} user={user} handleLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<Home products={products} setCategory={setCategory} searchTerm={searchTerm} />} />
          <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} onOrder={handleProcessOrder} />} />
          <Route path="/product/:id" element={<ProductDetailsPage addToCart={(p) => setCart([...cart, p])} user={user} setShowAuth={setShowAuth} products={products} onOrder={handleProcessOrder} />} />
          <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
          <Route path="/my-orders" element={<OrdersPage orders={orders} onCancel={handleCancelOrder} />} />
        </Routes>

        {showAuth && <LoginModal handleLogin={handleLogin} setShowAuth={setShowAuth} />}

        {isProcessingPayment && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.9)', zIndex: 6000, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #2874f0', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <h2 style={{ color: '#1e3c72', marginTop: '20px' }}>Securely Processing Payment...</h2>
          </div>
        )}

        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
          .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
          .animate-slide-in { animation: slideIn 0.5s ease-out forwards; }
          .product-card:hover { transform: translateY(-10px); transition: 0.3s; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .menu-item { padding: 15px 20px; border-radius: 12px; transition: 0.3s; cursor: pointer; }
          .menu-item:hover { background: rgba(40, 116, 240, 0.1); color: #2874f0; }
        `}</style>
      </div>
    </Router>
  );
}

const ProductDetailsPage = ({ addToCart, products, onOrder }) => {
    const { id } = useParams();
    const product = products.find(p => p._id === id);
    if(!product) return <h2 style={{ textAlign: 'center', padding: '100px' }}>Loading...</h2>;
    return (
        <div className="animate-fade-in" style={{ display: 'flex', padding: '60px 10%', background: 'white', gap: '80px', minHeight: '80vh', borderRadius: '40px', margin: '40px 10%', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
            <div style={{ flex: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={product.image} style={{ width: '100%', maxHeight: '450px', objectFit: 'contain' }} alt="" /></div>
            <div style={{ flex: 0.5 }}>
                <h1 style={{ fontSize: '36px', color: '#333' }}>{product.name}</h1>
                <h2 style={{ fontSize: '42px', margin: '30px 0', color: '#1e3c72' }}>${product.price}</h2>
                <div style={{ display: 'flex', gap: '20px', marginTop: '50px' }}>
                    <button onClick={() => addToCart(product)} style={{ flex: 1, padding: '18px', background: '#ff9f00', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '15px' }}>ADD TO BAG</button>
                    <button onClick={() => onOrder(product)} style={{ flex: 1, padding: '18px', background: '#fb641b', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '15px' }}>ORDER NOW</button>
                </div>
            </div>
        </div>
    );
};

// --- UPDATED LOGIN MODAL WITH CREATE ACCOUNT OPTION ---
const LoginModal = ({ handleLogin, setShowAuth }) => (
  <div className="animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(30, 60, 114, 0.4)', backdropFilter: 'blur(12px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 5000 }}>
    <div style={{ background: 'white', width: '800px', height: '520px', display: 'flex', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
      <div style={{ flex: '0.45', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', color: 'white', padding: '50px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900' }}>Welcome</h2>
        <p style={{ marginTop: '20px', opacity: 0.8 }}>Access secure checkout and real-time order tracking.</p>
        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" alt="icon" style={{ width: '100%', marginTop: 'auto' }} />
      </div>
      <div style={{ flex: '0.55', padding: '60px', position: 'relative', background: '#fff' }}>
        <button onClick={() => setShowAuth(false)} style={{ position: 'absolute', top: '25px', right: '25px', border: 'none', background: '#f5f5f5', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <h3 style={{color: '#1e3c72', margin: 0}}>Sign In</h3>
          <input placeholder="Email or Mobile" required style={{ border: 'none', background: '#f8f9fa', padding: '15px 20px', borderRadius: '15px', outline: 'none', border: '1px solid #eee' }} />
          <input type="password" placeholder="Secure Password" required style={{ border: 'none', background: '#f8f9fa', padding: '15px 20px', borderRadius: '15px', outline: 'none', border: '1px solid #eee' }} />
          <button type="submit" style={{ background: '#2874f0', color: 'white', padding: '18px', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>LOG IN</button>
          
          {/* --- THE ADDED CREATE ACCOUNT OPTION --- */}
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <span style={{ color: '#777', fontSize: '14px' }}>New to CSMarket? </span>
            <button type="button" onClick={() => alert("Registration feature preserved.")} style={{ background: 'none', border: 'none', color: '#2874f0', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Create an account</button>
          </div>
        </form>
      </div>
    </div>
  </div>
);