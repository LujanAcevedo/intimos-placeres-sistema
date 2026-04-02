// ============================================================
// INTIMOS PLACERES — SISTEMA DE GESTIÓN
// Pegar este archivo en Lovable.dev como App.jsx
// Requiere: npm install @supabase/supabase-js
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ── CONFIGURACIÓN SUPABASE ──────────────────────────────────
// Reemplazá estos valores con los de tu proyecto en supabase.com
// Settings → API → Project URL y anon public key
const SUPABASE_URL = "https://TU_PROYECTO.supabase.co";
const SUPABASE_ANON_KEY = "TU_ANON_KEY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── ESTILOS GLOBALES ────────────────────────────────────────
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --pk: #EE5197; --pk-d: #C73F7F; --pk-g: rgba(238,81,151,0.1);
    --bk: #000; --bs: #0a0a0a; --c1: #111; --c2: #161616; --c3: #1c1c1c; --c4: #222;
    --wh: #fff; --mu: rgba(255,255,255,0.38);
    --bd: rgba(238,81,151,0.15); --bdd: rgba(255,255,255,0.06);
    --ok: #22c55e; --warn: #eab308; --err: #ef4444; --blue: #3b82f6;
    --fd: 'Playfair Display', serif; --fb: 'DM Sans', sans-serif;
  }
  body { background: var(--bs); color: var(--wh); font-family: var(--fb); font-weight: 300; margin: 0; overflow: hidden; height: 100vh; }
  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-track { background: var(--bk); }
  ::-webkit-scrollbar-thumb { background: var(--pk); border-radius: 2px; }
  input, select, textarea, button { font-family: var(--fb); }
  .topbar { height: 50px; background: var(--c1); border-bottom: 1px solid var(--bdd); display: flex; align-items: center; justify-content: space-between; padding: 0 16px; position: sticky; top: 0; z-index: 200; flex-shrink: 0; }
  .layout { display: flex; height: calc(100vh - 50px); }
  .sidebar { width: 200px; background: var(--c1); border-right: 1px solid var(--bdd); overflow-y: auto; flex-shrink: 0; }
  .main { flex: 1; overflow-y: auto; padding: 20px 24px; }
  .sb-group { padding: 8px 0 2px; }
  .sb-label { font-size: 9px; font-weight: 500; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,.18); padding: 0 12px 3px; }
  .sb-item { display: flex; align-items: center; gap: 8px; padding: 8px 12px; font-size: 12px; color: var(--mu); cursor: pointer; border-left: 2px solid transparent; transition: all .15s; }
  .sb-item:hover { color: var(--wh); background: rgba(255,255,255,.03); }
  .sb-item.active { color: var(--pk); background: var(--pk-g); border-left-color: var(--pk); font-weight: 500; }
  .pg-title { font-family: var(--fd); font-size: 20px; font-weight: 400; color: var(--wh); margin-bottom: 4px; }
  .pg-title em { font-style: italic; color: var(--pk); }
  .pg-sub { font-size: 12px; color: var(--mu); }
  .pg-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; }
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 500; cursor: pointer; border: none; transition: all .2s; }
  .btn-pk { background: var(--pk); color: white; } .btn-pk:hover { background: var(--pk-d); }
  .btn-out { background: transparent; color: var(--wh); border: 1px solid var(--bdd); } .btn-out:hover { border-color: var(--bd); color: var(--pk); }
  .btn-ok { background: rgba(34,197,94,.12); color: var(--ok); border: 1px solid rgba(34,197,94,.2); }
  .stat-grid { display: grid; gap: 10px; margin-bottom: 16px; }
  .g4 { grid-template-columns: repeat(4,1fr); } .g3 { grid-template-columns: repeat(3,1fr); } .g2 { grid-template-columns: repeat(2,1fr); }
  .stat { background: var(--c2); border: 1px solid var(--bdd); border-radius: 10px; padding: 14px 16px; }
  .stat.hi { border-color: var(--bd); background: var(--pk-g); }
  .stat-l { font-size: 9px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: var(--mu); margin-bottom: 7px; }
  .stat-v { font-family: var(--fd); font-size: 22px; font-weight: 400; color: var(--wh); line-height: 1; }
  .stat-v.pk { color: var(--pk); } .stat-d { font-size: 10px; margin-top: 4px; }
  .up { color: var(--ok); } .dn { color: var(--err); } .wa { color: var(--warn); }
  .panel { background: var(--c2); border: 1px solid var(--bdd); border-radius: 10px; padding: 16px; margin-bottom: 14px; }
  .panel-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .panel-title { font-size: 12px; font-weight: 500; color: var(--wh); }
  .tbl { width: 100%; border-collapse: collapse; }
  .tbl th { font-size: 9px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: var(--mu); padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--bdd); }
  .tbl td { font-size: 11px; color: var(--mu); padding: 10px; border-bottom: 1px solid rgba(255,255,255,.03); vertical-align: middle; }
  .tbl td:first-child { color: var(--wh); } .tbl tr:hover td { background: rgba(255,255,255,.02); } .tbl tr:last-child td { border-bottom: none; }
  .inp { background: var(--c3); border: 1px solid var(--bdd); border-radius: 7px; padding: 8px 11px; font-size: 12px; color: var(--wh); outline: none; transition: border-color .2s; width: 100%; }
  .inp:focus { border-color: var(--pk); }
  .inp::placeholder { color: rgba(255,255,255,.18); }
  .sel { background: var(--c3); border: 1px solid var(--bdd); border-radius: 7px; padding: 8px 11px; font-size: 12px; color: var(--wh); outline: none; cursor: pointer; width: 100%; }
  .sel:focus { border-color: var(--pk); }
  .form-g { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
  .form-lbl { font-size: 10px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--mu); }
  .fg2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .fg3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .search-box { display: flex; align-items: center; gap: 7px; background: var(--c3); border: 1px solid var(--bdd); border-radius: 7px; padding: 7px 11px; flex: 1; }
  .search-box input { background: none; border: none; outline: none; color: var(--wh); font-size: 12px; width: 100%; }
  .search-box input::placeholder { color: var(--mu); }
  .filt { background: var(--c3); border: 1px solid var(--bdd); border-radius: 7px; padding: 6px 12px; font-size: 11px; color: var(--mu); cursor: pointer; }
  .filt.on { border-color: var(--bd); color: var(--pk); background: var(--pk-g); }
  .pill { display: inline-block; font-size: 9px; font-weight: 500; padding: 2px 8px; border-radius: 7px; }
  .p-ok { background: rgba(34,197,94,.1); color: var(--ok); } .p-wa { background: rgba(234,179,8,.1); color: var(--warn); }
  .p-er { background: rgba(239,68,68,.1); color: var(--err); } .p-pk { background: var(--pk-g); color: var(--pk); }
  .p-bl { background: rgba(59,130,246,.1); color: var(--blue); }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.75); z-index: 500; display: flex; align-items: center; justify-content: center; }
  .modal { background: var(--c2); border: 1px solid var(--bdd); border-radius: 14px; padding: 24px; width: 480px; max-height: 85vh; overflow-y: auto; }
  .modal-title { font-family: var(--fd); font-size: 18px; font-weight: 400; color: var(--wh); margin-bottom: 4px; }
  .modal-sub { font-size: 12px; color: var(--mu); margin-bottom: 20px; }
  .barcode-strip { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: rgba(238,81,151,.07); border: 1px solid var(--bd); border-radius: 9px; margin-bottom: 12px; }
  .barcode-strip input { flex: 1; background: none; border: none; outline: none; color: var(--wh); font-size: 13px; }
  .barcode-strip input::placeholder { color: rgba(238,81,151,.4); }
  .pos-grid { display: grid; grid-template-columns: 1fr 360px; gap: 14px; height: calc(100vh - 170px); }
  .pos-prods { overflow-y: auto; }
  .prod-list { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
  .pos-prod { background: var(--c2); border: 1px solid var(--bdd); border-radius: 9px; padding: 11px; cursor: pointer; transition: all .2s; }
  .pos-prod:hover { border-color: var(--pk); background: var(--pk-g); }
  .cart-box { background: var(--c2); border: 1px solid var(--bdd); border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; }
  .cart-items { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; }
  .ci { display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: var(--c3); border-radius: 7px; }
  .ci-qbtn { width: 22px; height: 22px; background: var(--c4); border-radius: 5px; border: none; color: var(--wh); font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .pay-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
  .pay-btn { padding: 10px; border-radius: 8px; font-size: 11px; font-weight: 500; cursor: pointer; border: none; transition: all .2s; }
  .pay-cash { background: var(--ok); color: white; } .pay-card { background: var(--blue); color: white; }
  .pay-tigo { background: #9333ea; color: white; } .pay-tr { background: var(--c3); color: var(--wh); border: 1px solid var(--bdd); }
  .btn-cobrar { width: 100%; background: var(--pk); color: white; border: none; border-radius: 9px; padding: 13px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all .2s; }
  .btn-cobrar:hover { background: var(--pk-d); }
  .btn-cobrar:disabled { opacity: .4; cursor: not-allowed; }
  .comm-card { background: var(--c2); border: 1px solid var(--bdd); border-radius: 10px; padding: 16px; display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .comm-av { width: 38px; height: 38px; border-radius: 50%; background: var(--pk); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: white; flex-shrink: 0; }
  .comm-bar { flex: 1; height: 5px; background: var(--c3); border-radius: 3px; overflow: hidden; }
  .comm-bar-fill { height: 100%; background: var(--pk); border-radius: 3px; }
  .loading { display: flex; align-items: center; justify-content: center; height: 200px; color: var(--mu); font-size: 13px; }
  .toast { position: fixed; top: 60px; right: 16px; background: var(--c2); border: 1px solid var(--bd); border-radius: 10px; padding: 12px 16px; z-index: 1000; display: flex; align-items: center; gap: 10px; min-width: 260px; animation: slideIn .3s ease; }
  @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  .login-wrap { height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bs); }
  .login-box { background: var(--c2); border: 1px solid var(--bdd); border-radius: 16px; padding: 36px; width: 360px; }
  .login-logo { text-align: center; margin-bottom: 28px; }
  .login-title { font-family: var(--fd); font-size: 22px; color: var(--wh); }
  .login-title em { font-style: italic; color: var(--pk); }
  .login-sub { font-size: 12px; color: var(--mu); text-align: center; margin-top: 4px; }
  .gap-8 { display: flex; flex-direction: column; gap: 8px; }
  .mov-row { display: flex; align-items: center; gap: 10px; padding: 9px 12px; background: var(--c3); border-radius: 8px; border: 1px solid var(--bdd); margin-bottom: 6px; }
  .amount-in { color: var(--ok); } .amount-out { color: var(--err); }
`;

// ── TOAST NOTIFICATION ──────────────────────────────────────
function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  if (!msg) return null;
  return (
    <div className="toast">
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--pk)", flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: "var(--wh)" }}>{msg}</span>
    </div>
  );
}

// ── FORMATTERS ──────────────────────────────────────────────
const fmtGs = (n) => "Gs " + Number(n || 0).toLocaleString("es-PY");
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("es-PY") : "—";

// ── LOGIN PAGE ──────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError("Email o contraseña incorrectos"); setLoading(false); return; }
    onLogin(data.user);
    setLoading(false);
  }

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="login-logo">
          <div className="login-title">Intimos <em>Placeres</em></div>
          <div className="login-sub">Sistema de Gestión · Tiendas físicas</div>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-g">
            <label className="form-lbl">Email</label>
            <input className="inp" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
          </div>
          <div className="form-g">
            <label className="form-lbl">Contraseña</label>
            <input className="inp" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {error && <div style={{ fontSize: 12, color: "var(--err)", marginBottom: 12 }}>{error}</div>}
          <button className="btn btn-pk" type="submit" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── TOPBAR ──────────────────────────────────────────────────
function Topbar({ tienda, onToggleTienda, user, onLogout }) {
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 8));
  useEffect(() => { const t = setInterval(() => setTime(new Date().toTimeString().slice(0, 8)), 1000); return () => clearInterval(t); }, []);
  return (
    <div className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontFamily: "var(--fd)", fontSize: 14, color: "var(--wh)" }}>
          Intimos <em style={{ fontStyle: "italic", color: "var(--pk)" }}>Placeres</em>
        </div>
        <div style={{ width: 1, height: 18, background: "var(--bdd)" }} />
        <div onClick={onToggleTienda} style={{ display: "flex", alignItems: "center", gap: 7, background: "var(--c3)", border: "1px solid var(--bdd)", borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 12, color: "var(--wh)", fontWeight: 500 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--ok)" }} />
          {tienda} ▾
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 12, color: "var(--mu)", fontVariantNumeric: "tabular-nums" }}>{time}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 7, background: "var(--c3)", border: "1px solid var(--bdd)", borderRadius: 7, padding: "4px 10px 4px 6px", cursor: "pointer" }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--pk)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: "white" }}>
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <span style={{ fontSize: 12, color: "var(--wh)" }}>{user?.email?.split("@")[0]}</span>
        </div>
        <button className="btn btn-out" onClick={onLogout} style={{ fontSize: 11, padding: "6px 12px" }}>Salir</button>
      </div>
    </div>
  );
}

// ── SIDEBAR ─────────────────────────────────────────────────
const MENU = [
  { group: "Principal", items: [{ id: "pos", label: "Punto de Venta", badge: "Live", badgeColor: "var(--ok)" }, { id: "dashboard", label: "Dashboard" }] },
  { group: "Caja", items: [{ id: "caja", label: "Arqueo de Caja" }, { id: "gastos", label: "Gastos" }] },
  { group: "Ventas", items: [{ id: "ventas", label: "Historial Ventas" }, { id: "devoluciones", label: "Devoluciones" }, { id: "presupuestos", label: "Presupuestos" }] },
  { group: "Inventario", items: [{ id: "stock", label: "Stock por Tienda" }, { id: "productos", label: "Productos" }, { id: "etiquetas", label: "Etiquetas" }, { id: "transferencias", label: "Transferencias" }] },
  { group: "Compras", items: [{ id: "compras", label: "Compras" }, { id: "proveedores", label: "Proveedores" }] },
  { group: "Personas", items: [{ id: "clientes", label: "Clientes" }, { id: "vendedoras", label: "Vendedoras" }, { id: "comisiones", label: "Comisiones" }] },
  { group: "Logística", items: [{ id: "delivery", label: "Delivery" }, { id: "remision", label: "Nota de Remisión" }] },
  { group: "Informes", items: [{ id: "informes", label: "Informes" }, { id: "precios", label: "Lista de Precios" }] },
];

function Sidebar({ active, onNav }) {
  return (
    <div className="sidebar">
      {MENU.map(({ group, items }) => (
        <div key={group} className="sb-group">
          <div className="sb-label">{group}</div>
          {items.map(({ id, label, badge, badgeColor }) => (
            <div key={id} className={`sb-item${active === id ? " active" : ""}`} onClick={() => onNav(id)}>
              {label}
              {badge && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 600, padding: "1px 6px", borderRadius: 8, background: "rgba(34,197,94,.1)", color: badgeColor || "var(--pk)" }}>{badge}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── POS PAGE ─────────────────────────────────────────────────
function POSPage({ tiendaId, vendedoraId, toast }) {
  const [productos, setProductos] = useState([]);
  const [cart, setCart] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [barcode, setBarcode] = useState("");
  const [caja, setCaja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [modal, setModal] = useState(null); // 'cobrar' | 'ticket'
  const [lastVenta, setLastVenta] = useState(null);

  useEffect(() => { loadData(); }, [tiendaId]);

  async function loadData() {
    setLoading(true);
    // Load productos with stock for this tienda
    const { data: prods } = await supabase
      .from("productos")
      .select("*, stock(cantidad), categorias(nombre)")
      .eq("activo", true)
      .eq("stock.tienda_id", tiendaId);
    setProductos(prods || []);

    // Load open caja
    const { data: cajas } = await supabase
      .from("cajas")
      .select("*")
      .eq("tienda_id", tiendaId)
      .eq("abierta", true)
      .limit(1);
    setCaja(cajas?.[0] || null);
    setLoading(false);
  }

  async function abrirCaja() {
    const monto = prompt("Monto de apertura (Gs):", "200000");
    if (!monto) return;
    const { data } = await supabase.from("cajas").insert({
      tienda_id: tiendaId, vendedora_id: vendedoraId,
      monto_apertura: parseInt(monto), abierta: true
    }).select().single();
    setCaja(data);
    toast("Caja abierta correctamente");
  }

  function addToCart(producto) {
    const existing = cart.find(i => i.id === producto.id);
    const stockDisp = producto.stock?.[0]?.cantidad || 0;
    if (existing) {
      if (existing.qty >= stockDisp) { toast("Sin stock suficiente"); return; }
      setCart(cart.map(i => i.id === producto.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      if (stockDisp === 0) { toast("Producto sin stock"); return; }
      setCart([...cart, { ...producto, qty: 1 }]);
    }
  }

  function handleBarcode(e) {
    if (e.key === "Enter") {
      const prod = productos.find(p => p.codigo_barras === barcode || p.sku === barcode);
      if (prod) { addToCart(prod); toast("Producto escaneado: " + prod.nombre); }
      else toast("Código no encontrado: " + barcode);
      setBarcode("");
    }
  }

  function changeQty(id, delta) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  }

  const subtotal = cart.reduce((s, i) => s + i.precio_venta * i.qty, 0);
  const total = Math.max(0, subtotal - (descuento || 0));

  async function cobrar(metodo) {
    if (!cart.length) return;
    if (!caja) { toast("Debés abrir la caja primero"); return; }
    // Insert venta
    const { data: venta } = await supabase.from("ventas").insert({
      tienda_id: tiendaId, vendedora_id: vendedoraId,
      caja_id: caja.id, subtotal, descuento: descuento || 0,
      total, metodo_pago: metodo, estado: "completada"
    }).select().single();

    // Insert items and update stock
    for (const item of cart) {
      await supabase.from("venta_items").insert({
        venta_id: venta.id, producto_id: item.id,
        cantidad: item.qty, precio_unitario: item.precio_venta,
        subtotal: item.precio_venta * item.qty
      });
      // Decrease stock
      await supabase.from("stock")
        .update({ cantidad: supabase.rpc("decrement", { row_id: item.id, tienda: tiendaId, qty: item.qty }) });
      // Register commission
      await supabase.from("comisiones").insert({
        vendedora_id: vendedoraId, venta_id: venta.id,
        monto_venta: total, porcentaje: 5,
        monto_comision: total * 0.05,
        mes: new Date().getMonth() + 1, anio: new Date().getFullYear()
      });
    }
    setLastVenta({ ...venta, items: cart });
    setCart([]); setDescuento(0);
    setModal("ticket");
    toast("Venta registrada — " + metodo);
    loadData();
  }

  const prodsFiltrados = productos.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filtro === "Todos" || p.categorias?.nombre === filtro;
    return matchSearch && matchCat;
  });

  if (loading) return <div className="loading">Cargando productos...</div>;

  return (
    <div>
      <div className="pg-header">
        <div>
          <div className="pg-title">Punto de <em>Venta</em></div>
          <div className="pg-sub">{caja ? `Caja abierta · ${fmtDate(caja.fecha_apertura)}` : "Caja cerrada"}</div>
        </div>
        {!caja && <button className="btn btn-ok" onClick={abrirCaja}>Abrir Caja</button>}
      </div>
      <div className="pos-grid">
        <div className="pos-prods">
          <div className="barcode-strip">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--pk)" strokeWidth="1.5">
              <rect x="2" y="2" width="4" height="20"/><rect x="8" y="2" width="2" height="20"/><rect x="12" y="2" width="3" height="20"/><rect x="17" y="2" width="1" height="20"/><rect x="20" y="2" width="2" height="20"/>
            </svg>
            <input placeholder="Escaneá el código de barras..." value={barcode} onChange={e => setBarcode(e.target.value)} onKeyDown={handleBarcode} />
            <span style={{ fontSize: 10, color: "var(--mu)", whiteSpace: "nowrap" }}>Enter para agregar</span>
          </div>
          <div className="toolbar">
            <div className="search-box">
              <input placeholder="Buscar producto..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            {["Todos", "Juguetes", "Cosméticos", "Accesorios"].map(f => (
              <button key={f} className={`filt${filtro === f ? " on" : ""}`} onClick={() => setFiltro(f)}>{f}</button>
            ))}
          </div>
          <div className="prod-list">
            {prodsFiltrados.map(p => {
              const stock = p.stock?.[0]?.cantidad || 0;
              return (
                <div key={p.id} className="pos-prod" onClick={() => addToCart(p)} style={{ opacity: stock === 0 ? 0.4 : 1 }}>
                  <div style={{ fontSize: 11, color: "var(--wh)", marginBottom: 3, lineHeight: 1.3 }}>{p.nombre}</div>
                  <div style={{ fontSize: 13, color: "var(--pk)", fontWeight: 500 }}>{fmtGs(p.precio_venta)}</div>
                  <div style={{ fontSize: 9, color: stock <= 3 ? "var(--warn)" : "var(--mu)" }}>
                    {stock === 0 ? "Sin stock" : `Stock: ${stock}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="cart-box">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--wh)" }}>Carrito</span>
            {cart.length > 0 && <button className="btn btn-out" style={{ fontSize: 11, padding: "4px 10px" }} onClick={() => setCart([])}>Limpiar</button>}
          </div>
          <div className="cart-items">
            {cart.length === 0
              ? <div style={{ fontSize: 12, color: "var(--mu)", textAlign: "center", padding: "20px 0" }}>Agregá productos</div>
              : cart.map(i => (
                <div key={i.id} className="ci">
                  <span style={{ flex: 1, fontSize: 11, color: "var(--wh)" }}>{i.nombre}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <button className="ci-qbtn" onClick={() => changeQty(i.id, -1)}>−</button>
                    <span style={{ fontSize: 11, color: "var(--mu)", minWidth: 16, textAlign: "center" }}>{i.qty}</span>
                    <button className="ci-qbtn" onClick={() => changeQty(i.id, 1)}>+</button>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--pk)", fontWeight: 500, minWidth: 80, textAlign: "right" }}>{fmtGs(i.precio_venta * i.qty)}</span>
                </div>
              ))
            }
          </div>

          <div style={{ borderTop: "1px solid var(--bdd)", paddingTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "var(--mu)", flex: 1 }}>Descuento (Gs)</span>
              <input className="inp" type="number" value={descuento} onChange={e => setDescuento(Number(e.target.value))} style={{ width: 100, textAlign: "right" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--mu)", marginBottom: 4 }}>
              <span>Subtotal</span><span>{fmtGs(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 500, color: "var(--wh)" }}>
              <span>Total</span><span style={{ color: "var(--pk)" }}>{fmtGs(total)}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--mu)", marginBottom: 8 }}>Forma de pago</div>
            <div className="pay-grid">
              <button className="pay-btn pay-cash" onClick={() => cobrar("Efectivo")}>💵 Efectivo</button>
              <button className="pay-btn pay-card" onClick={() => cobrar("Tarjeta")}>💳 Tarjeta</button>
              <button className="pay-btn pay-tigo" onClick={() => cobrar("Tigo Money")}>📱 Tigo Money</button>
              <button className="pay-btn pay-tr" onClick={() => cobrar("Transferencia")}>🏦 Transf.</button>
            </div>
          </div>

          <button className="btn-cobrar" disabled={cart.length === 0 || !caja} onClick={() => cobrar("Efectivo")}>
            Cobrar — {fmtGs(total)}
          </button>
        </div>
      </div>

      {modal === "ticket" && lastVenta && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Ticket de Venta</div>
            <div className="modal-sub">Venta #{lastVenta.numero} · {fmtDate(new Date())}</div>
            <div style={{ background: "var(--c3)", borderRadius: 8, padding: 14, fontSize: 12, lineHeight: 2, marginBottom: 16, fontFamily: "monospace" }}>
              <div style={{ textAlign: "center", fontWeight: 600, marginBottom: 8 }}>INTIMOS PLACERES</div>
              {lastVenta.items.map(i => (
                <div key={i.id} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{i.nombre} x{i.qty}</span><span>{fmtGs(i.precio_venta * i.qty)}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px dashed var(--bdd)", marginTop: 6, paddingTop: 6, display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
                <span>TOTAL</span><span style={{ color: "var(--pk)" }}>{fmtGs(lastVenta.total)}</span>
              </div>
              <div style={{ textAlign: "center", marginTop: 8, color: "var(--mu)", fontSize: 10 }}>¡Gracias por elegirnos! · 🔒 Envío discreto</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-pk" style={{ flex: 1 }} onClick={() => { window.print(); setModal(null); }}>🖨️ Imprimir</button>
              <button className="btn btn-out" onClick={() => setModal(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── DASHBOARD PAGE ───────────────────────────────────────────
function DashboardPage({ tiendaId }) {
  const [stats, setStats] = useState(null);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, [tiendaId]);

  async function loadStats() {
    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);
    const { data: ventasHoy } = await supabase
      .from("ventas").select("total, metodo_pago, created_at, vendedoras(nombre)")
      .eq("tienda_id", tiendaId).gte("created_at", today + "T00:00:00").order("created_at", { ascending: false });
    const totalHoy = (ventasHoy || []).reduce((s, v) => s + v.total, 0);
    setStats({ totalHoy, cantHoy: ventasHoy?.length || 0 });
    setVentas((ventasHoy || []).slice(0, 5));
    setLoading(false);
  }

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div>
      <div className="pg-header">
        <div><div className="pg-title"><em>Dashboard</em></div><div className="pg-sub">Resumen de hoy</div></div>
      </div>
      <div className="stat-grid g4">
        <div className="stat hi">
          <div className="stat-l">Ventas hoy</div>
          <div className="stat-v pk">{fmtGs(stats?.totalHoy)}</div>
          <div className="stat-d">{stats?.cantHoy} transacciones</div>
        </div>
        <div className="stat">
          <div className="stat-l">Ticket promedio</div>
          <div className="stat-v">{fmtGs(stats?.cantHoy ? stats.totalHoy / stats.cantHoy : 0)}</div>
        </div>
        <div className="stat">
          <div className="stat-l">Mes actual</div>
          <div className="stat-v">—</div>
          <div className="stat-d">Ver informe completo</div>
        </div>
        <div className="stat">
          <div className="stat-l">Alertas stock</div>
          <div className="stat-v wa">Ver stock</div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-hd"><div className="panel-title">Últimas ventas</div></div>
        <table className="tbl">
          <thead><tr><th>Hora</th><th>Vendedora</th><th>Método</th><th>Total</th></tr></thead>
          <tbody>
            {ventas.map(v => (
              <tr key={v.id}>
                <td>{new Date(v.created_at).toTimeString().slice(0, 5)}</td>
                <td>{v.vendedoras?.nombre || "—"}</td>
                <td>{v.metodo_pago}</td>
                <td style={{ color: "var(--pk)" }}>{fmtGs(v.total)}</td>
              </tr>
            ))}
            {ventas.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center" }}>Sin ventas hoy todavía</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── CAJA PAGE ────────────────────────────────────────────────
function CajaPage({ tiendaId, vendedoraId, toast }) {
  const [caja, setCaja] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCaja(); }, [tiendaId]);

  async function loadCaja() {
    setLoading(true);
    const { data } = await supabase.from("cajas").select("*").eq("tienda_id", tiendaId).eq("abierta", true).limit(1);
    const cajaActual = data?.[0];
    setCaja(cajaActual);
    if (cajaActual) {
      const { data: movs } = await supabase.from("caja_movimientos").select("*").eq("caja_id", cajaActual.id).order("created_at", { ascending: false });
      setMovimientos(movs || []);
    }
    setLoading(false);
  }

  async function agregarMovimiento(tipo, monto, descripcion, categoria) {
    if (!caja) return;
    await supabase.from("caja_movimientos").insert({ caja_id: caja.id, tipo, monto, descripcion, categoria });
    toast("Movimiento registrado");
    loadCaja();
    setModal(null);
  }

  async function cerrarCaja(efectivoCont) {
    const { data: ventas } = await supabase.from("ventas").select("total, metodo_pago").eq("caja_id", caja.id).eq("metodo_pago", "Efectivo");
    const sistemaEfectivo = (ventas || []).reduce((s, v) => s + v.total, 0) + caja.monto_apertura;
    const diferencia = efectivoCont - sistemaEfectivo;
    await supabase.from("cajas").update({ abierta: false, monto_cierre: sistemaEfectivo, efectivo_contado: efectivoCont, diferencia, fecha_cierre: new Date().toISOString() }).eq("id", caja.id);
    toast("Caja cerrada. Diferencia: " + fmtGs(diferencia));
    setCaja(null); setMovimientos([]);
  }

  const ModalMovimiento = () => {
    const [tipo, setTipo] = useState("egreso");
    const [monto, setMonto] = useState("");
    const [desc, setDesc] = useState("");
    const [cat, setCat] = useState("Limpieza");
    return (
      <div className="modal-overlay" onClick={() => setModal(null)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-title">Agregar Movimiento</div>
          <div className="fg2">
            <div className="form-g"><label className="form-lbl">Tipo</label>
              <select className="sel" value={tipo} onChange={e => setTipo(e.target.value)}>
                <option value="egreso">Egreso (Gasto)</option>
                <option value="ingreso">Ingreso extra</option>
              </select>
            </div>
            <div className="form-g"><label className="form-lbl">Monto (Gs)</label>
              <input className="inp" type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder="0" />
            </div>
          </div>
          <div className="form-g"><label className="form-lbl">Descripción</label>
            <input className="inp" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Ej: Compra limpieza" />
          </div>
          <div className="form-g"><label className="form-lbl">Categoría</label>
            <select className="sel" value={cat} onChange={e => setCat(e.target.value)}>
              {["Limpieza", "Logística", "Servicios", "Compras", "Otros"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn btn-pk" onClick={() => agregarMovimiento(tipo, Number(monto), desc, cat)}>Guardar</button>
            <button className="btn btn-out" onClick={() => setModal(null)}>Cancelar</button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div>
      <div className="pg-header">
        <div><div className="pg-title">Arqueo de <em>Caja</em></div><div className="pg-sub">{caja ? "Caja abierta" : "Sin caja abierta"}</div></div>
        {caja && (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-out" onClick={() => setModal("movimiento")}>+ Movimiento</button>
            <button className="btn" style={{ background: "rgba(239,68,68,.12)", color: "var(--err)", border: "1px solid rgba(239,68,68,.2)" }}
              onClick={() => { const monto = prompt("Efectivo contado en caja (Gs):"); if (monto) cerrarCaja(Number(monto)); }}>
              Cerrar Caja
            </button>
          </div>
        )}
      </div>
      {!caja && <div style={{ fontSize: 13, color: "var(--mu)", textAlign: "center", padding: 40 }}>No hay caja abierta en esta tienda</div>}
      {caja && (
        <>
          <div style={{ background: "var(--pk-g)", border: "1px solid var(--bd)", borderRadius: 10, padding: 16, display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ color: "var(--pk)", fontWeight: 500 }}>🟢 Caja ABIERTA · Apertura: {fmtGs(caja.monto_apertura)}</span>
            <span style={{ fontSize: 11, color: "var(--mu)" }}>Desde: {fmtDate(caja.fecha_apertura)}</span>
          </div>
          <div className="panel">
            <div className="panel-hd"><div className="panel-title">Movimientos del turno</div></div>
            <div>
              {movimientos.map(m => (
                <div key={m.id} className="mov-row">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "var(--wh)" }}>{m.descripcion}</div>
                    <div style={{ fontSize: 10, color: "var(--mu)" }}>{m.categoria} · {new Date(m.created_at).toTimeString().slice(0, 5)}</div>
                  </div>
                  <span className={m.tipo === "ingreso" ? "amount-in" : "amount-out"} style={{ fontSize: 13, fontWeight: 500 }}>
                    {m.tipo === "ingreso" ? "+" : "—"}{fmtGs(m.monto)}
                  </span>
                </div>
              ))}
              {movimientos.length === 0 && <div style={{ fontSize: 12, color: "var(--mu)", textAlign: "center", padding: 20 }}>Sin movimientos aún</div>}
            </div>
          </div>
        </>
      )}
      {modal === "movimiento" && <ModalMovimiento />}
    </div>
  );
}

// ── VENTAS PAGE ──────────────────────────────────────────────
function VentasPage({ tiendaId }) {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("ventas")
        .select("*, vendedoras(nombre)")
        .eq("tienda_id", tiendaId)
        .order("created_at", { ascending: false })
        .limit(50);
      setVentas(data || []);
      setLoading(false);
    }
    load();
  }, [tiendaId]);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div>
      <div className="pg-header">
        <div><div className="pg-title">Historial de <em>Ventas</em></div><div className="pg-sub">{ventas.length} registros cargados</div></div>
      </div>
      <div className="panel">
        <table className="tbl">
          <thead><tr><th>#</th><th>Fecha</th><th>Vendedora</th><th>Método</th><th>Total</th><th>Estado</th></tr></thead>
          <tbody>
            {ventas.map(v => (
              <tr key={v.id}>
                <td>#{v.numero}</td>
                <td>{fmtDate(v.created_at)}</td>
                <td>{v.vendedoras?.nombre || "—"}</td>
                <td>{v.metodo_pago}</td>
                <td style={{ color: "var(--pk)" }}>{fmtGs(v.total)}</td>
                <td><span className="pill p-ok">{v.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── STOCK PAGE ───────────────────────────────────────────────
function StockPage({ tiendaId }) {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("stock")
        .select("*, productos(nombre, sku, codigo_barras), tiendas(nombre)")
        .eq("tienda_id", tiendaId)
        .order("cantidad", { ascending: true });
      setStock(data || []);
      setLoading(false);
    }
    load();
  }, [tiendaId]);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div>
      <div className="pg-header">
        <div><div className="pg-title">Control de <em>Stock</em></div><div className="pg-sub">Stock actual de esta tienda</div></div>
      </div>
      <div className="panel">
        <table className="tbl">
          <thead><tr><th>Producto</th><th>SKU</th><th>Cantidad</th><th>Mínimo</th><th>Estado</th></tr></thead>
          <tbody>
            {stock.map(s => {
              const estado = s.cantidad === 0 ? "sin-stock" : s.cantidad <= s.stock_minimo ? "bajo" : "ok";
              return (
                <tr key={s.id}>
                  <td>{s.productos?.nombre}</td>
                  <td style={{ fontFamily: "monospace" }}>{s.productos?.sku || "—"}</td>
                  <td>{s.cantidad}</td>
                  <td>{s.stock_minimo}</td>
                  <td>
                    <span className={estado === "ok" ? "pill p-ok" : estado === "bajo" ? "pill p-wa" : "pill p-er"}>
                      {estado === "ok" ? "OK" : estado === "bajo" ? "Bajo" : "Sin stock"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── PRODUCTOS PAGE ───────────────────────────────────────────
function ProductosPage({ toast }) {
  const [productos, setProductos] = useState([]);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: "", sku: "", codigo_barras: "", precio_venta: "", precio_costo: "", descripcion: "" });

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase.from("productos").select("*, categorias(nombre)").eq("activo", true);
    setProductos(data || []);
    setLoading(false);
  }

  async function guardar() {
    const { error } = await supabase.from("productos").insert({ ...form, precio_venta: Number(form.precio_venta), precio_costo: Number(form.precio_costo) });
    if (error) { toast("Error: " + error.message); return; }
    toast("Producto guardado correctamente");
    setModal(false); setForm({ nombre: "", sku: "", codigo_barras: "", precio_venta: "", precio_costo: "", descripcion: "" });
    load();
  }

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div>
      <div className="pg-header">
        <div><div className="pg-title">Gestión de <em>Productos</em></div><div className="pg-sub">{productos.length} productos</div></div>
        <button className="btn btn-pk" onClick={() => setModal(true)}>+ Nuevo Producto</button>
      </div>
      <div className="panel">
        <table className="tbl">
          <thead><tr><th>Nombre</th><th>SKU</th><th>Código Barras</th><th>Categoría</th><th>Precio Venta</th></tr></thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td style={{ fontFamily: "monospace" }}>{p.sku || "—"}</td>
                <td style={{ fontFamily: "monospace" }}>{p.codigo_barras || "—"}</td>
                <td><span className="pill p-pk">{p.categorias?.nombre}</span></td>
                <td style={{ color: "var(--pk)" }}>{fmtGs(p.precio_venta)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Nuevo Producto</div>
            <div className="modal-sub">Completá los datos del producto</div>
            <div className="form-g"><label className="form-lbl">Nombre</label>
              <input className="inp" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Vibrador Ruby App" />
            </div>
            <div className="fg3">
              <div className="form-g"><label className="form-lbl">SKU</label>
                <input className="inp" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="Ej: VR-001" />
              </div>
              <div className="form-g"><label className="form-lbl">Precio Venta (Gs)</label>
                <input className="inp" type="number" value={form.precio_venta} onChange={e => setForm({ ...form, precio_venta: e.target.value })} />
              </div>
              <div className="form-g"><label className="form-lbl">Precio Costo (Gs)</label>
                <input className="inp" type="number" value={form.precio_costo} onChange={e => setForm({ ...form, precio_costo: e.target.value })} />
              </div>
            </div>
            <div className="barcode-strip" style={{ marginBottom: 12 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--pk)" strokeWidth="1.5">
                <rect x="2" y="2" width="4" height="20"/><rect x="8" y="2" width="2" height="20"/><rect x="12" y="2" width="3" height="20"/>
              </svg>
              <input placeholder="Escanear código de barras del producto..." value={form.codigo_barras} onChange={e => setForm({ ...form, codigo_barras: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-pk" onClick={guardar}>Guardar Producto</button>
              <button className="btn btn-out" onClick={() => setModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── COMISIONES PAGE ──────────────────────────────────────────
function ComisionesPage({ tiendaId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const mes = new Date().getMonth() + 1;
  const anio = new Date().getFullYear();

  useEffect(() => {
    async function load() {
      const { data: comis } = await supabase.from("comisiones")
        .select("monto_venta, monto_comision, porcentaje, vendedoras(nombre, tienda_id)")
        .eq("mes", mes).eq("anio", anio).eq("liquidada", false);
      // Group by vendedora
      const grouped = {};
      (comis || []).forEach(c => {
        const id = c.vendedoras?.nombre;
        if (!grouped[id]) grouped[id] = { nombre: id, totalVentas: 0, totalComision: 0, pct: c.porcentaje };
        grouped[id].totalVentas += c.monto_venta;
        grouped[id].totalComision += c.monto_comision;
      });
      setData(Object.values(grouped));
      setLoading(false);
    }
    load();
  }, [tiendaId]);

  const maxVentas = Math.max(...data.map(d => d.totalVentas), 1);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div>
      <div className="pg-header">
        <div><div className="pg-title">Comisiones de <em>Vendedoras</em></div><div className="pg-sub">Mes {mes}/{anio}</div></div>
      </div>
      <div className="stat-grid g3">
        <div className="stat"><div className="stat-l">Total comisiones</div><div className="stat-v pk">{fmtGs(data.reduce((s, d) => s + d.totalComision, 0))}</div></div>
        <div className="stat"><div className="stat-l">Ventas totales</div><div className="stat-v">{fmtGs(data.reduce((s, d) => s + d.totalVentas, 0))}</div></div>
        <div className="stat"><div className="stat-l">Vendedoras</div><div className="stat-v">{data.length}</div></div>
      </div>
      {data.map(d => (
        <div key={d.nombre} className="comm-card">
          <div className="comm-av">{d.nombre?.[0]}</div>
          <div style={{ flex: 1, padding: "0 12px" }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--wh)", marginBottom: 2 }}>{d.nombre}</div>
            <div style={{ fontSize: 11, color: "var(--mu)" }}>{d.pct}% comisión</div>
          </div>
          <div className="comm-bar"><div className="comm-bar-fill" style={{ width: `${(d.totalVentas / maxVentas) * 100}%` }} /></div>
          <div style={{ textAlign: "right", minWidth: 100 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: "var(--pk)" }}>{fmtGs(d.totalComision)}</div>
            <div style={{ fontSize: 10, color: "var(--mu)" }}>Ventas: {fmtGs(d.totalVentas)}</div>
          </div>
        </div>
      ))}
      {data.length === 0 && <div style={{ fontSize: 13, color: "var(--mu)", textAlign: "center", padding: 40 }}>Sin comisiones registradas este mes</div>}
    </div>
  );
}

// ── GASTOS PAGE ──────────────────────────────────────────────
function GastosPage({ tiendaId, toast }) {
  const [gastos, setGastos] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ descripcion: "", monto: "", categoria: "Limpieza" });

  useEffect(() => { load(); }, [tiendaId]);

  async function load() {
    const { data } = await supabase.from("gastos").select("*").eq("tienda_id", tiendaId).order("created_at", { ascending: false }).limit(30);
    setGastos(data || []);
  }

  async function guardar() {
    await supabase.from("gastos").insert({ ...form, monto: Number(form.monto), tienda_id: tiendaId });
    toast("Gasto registrado"); setModal(false); load();
  }

  const total = gastos.reduce((s, g) => s + g.monto, 0);

  return (
    <div>
      <div className="pg-header">
        <div><div className="pg-title"><em>Gastos</em></div><div className="pg-sub">Total: {fmtGs(total)}</div></div>
        <button className="btn btn-pk" onClick={() => setModal(true)}>+ Nuevo Gasto</button>
      </div>
      <div className="panel">
        <table className="tbl">
          <thead><tr><th>Fecha</th><th>Descripción</th><th>Categoría</th><th>Monto</th></tr></thead>
          <tbody>
            {gastos.map(g => (
              <tr key={g.id}>
                <td>{fmtDate(g.fecha)}</td>
                <td>{g.descripcion}</td>
                <td>{g.categoria}</td>
                <td style={{ color: "var(--err)" }}>— {fmtGs(g.monto)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Nuevo Gasto</div>
            <div className="form-g"><label className="form-lbl">Descripción</label>
              <input className="inp" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} placeholder="Ej: Artículos de limpieza" />
            </div>
            <div className="fg2">
              <div className="form-g"><label className="form-lbl">Monto (Gs)</label>
                <input className="inp" type="number" value={form.monto} onChange={e => setForm({ ...form, monto: e.target.value })} />
              </div>
              <div className="form-g"><label className="form-lbl">Categoría</label>
                <select className="sel" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                  {["Limpieza", "Logística", "Servicios", "Compras", "Otros"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-pk" onClick={guardar}>Guardar</button>
              <button className="btn btn-out" onClick={() => setModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CLIENTES PAGE ────────────────────────────────────────────
function ClientesPage({ toast }) {
  const [clientes, setClientes] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nombre: "", telefono: "", email: "" });

  useEffect(() => { load(); }, []);
  async function load() {
    const { data } = await supabase.from("clientes").select("*").order("created_at", { ascending: false });
    setClientes(data || []);
  }
  async function guardar() {
    await supabase.from("clientes").insert(form);
    toast("Cliente guardado"); setModal(false); setForm({ nombre: "", telefono: "", email: "" }); load();
  }

  return (
    <div>
      <div className="pg-header">
        <div><div className="pg-title"><em>Clientes</em></div><div className="pg-sub">{clientes.length} clientes</div></div>
        <button className="btn btn-pk" onClick={() => setModal(true)}>+ Nuevo Cliente</button>
      </div>
      <div className="panel">
        <table className="tbl">
          <thead><tr><th>Nombre</th><th>Teléfono</th><th>Email</th><th>Registrado</th></tr></thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.id}><td>{c.nombre}</td><td>{c.telefono || "—"}</td><td>{c.email || "—"}</td><td>{fmtDate(c.created_at)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Nuevo Cliente</div>
            <div className="form-g"><label className="form-lbl">Nombre</label><input className="inp" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre completo" /></div>
            <div className="fg2">
              <div className="form-g"><label className="form-lbl">Teléfono/WA</label><input className="inp" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} placeholder="+595 9xx xxxxxx" /></div>
              <div className="form-g"><label className="form-lbl">Email</label><input className="inp" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="opcional" /></div>
            </div>
            <div style={{ display: "flex", gap: 8 }}><button className="btn btn-pk" onClick={guardar}>Guardar</button><button className="btn btn-out" onClick={() => setModal(false)}>Cancelar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── INFORMES PAGE ────────────────────────────────────────────
function InformesPage({ tiendaId }) {
  const [data, setData] = useState([]);
  const [periodo, setPeriodo] = useState("hoy");
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, [tiendaId, periodo]);

  async function load() {
    setLoading(true);
    const now = new Date();
    let desde = new Date();
    if (periodo === "hoy") desde.setHours(0, 0, 0, 0);
    else if (periodo === "semana") desde.setDate(desde.getDate() - 7);
    else if (periodo === "mes") desde.setDate(1);

    const { data: ventas } = await supabase.from("ventas").select("total, metodo_pago, created_at, vendedoras(nombre)")
      .eq("tienda_id", tiendaId).gte("created_at", desde.toISOString()).order("created_at", { ascending: false });
    setData(ventas || []);
    setLoading(false);
  }

  const total = data.reduce((s, v) => s + v.total, 0);
  const byMethod = data.reduce((acc, v) => { acc[v.metodo_pago] = (acc[v.metodo_pago] || 0) + v.total; return acc; }, {});

  return (
    <div>
      <div className="pg-header">
        <div><div className="pg-title"><em>Informes</em></div></div>
      </div>
      <div className="toolbar">
        {["hoy", "semana", "mes"].map(p => (
          <button key={p} className={`filt${periodo === p ? " on" : ""}`} onClick={() => setPeriodo(p)}>
            {p === "hoy" ? "Hoy" : p === "semana" ? "Esta semana" : "Este mes"}
          </button>
        ))}
      </div>
      {loading ? <div className="loading">Cargando...</div> : (
        <>
          <div className="stat-grid g3">
            <div className="stat hi"><div className="stat-l">Total ventas</div><div className="stat-v pk">{fmtGs(total)}</div><div className="stat-d">{data.length} transacciones</div></div>
            <div className="stat"><div className="stat-l">Ticket promedio</div><div className="stat-v">{fmtGs(data.length ? total / data.length : 0)}</div></div>
            <div className="stat"><div className="stat-l">Mayor venta</div><div className="stat-v">{fmtGs(Math.max(...data.map(v => v.total), 0))}</div></div>
          </div>
          <div className="two-col">
            <div className="panel">
              <div className="panel-hd"><div className="panel-title">Por método de pago</div></div>
              <table className="tbl">
                <thead><tr><th>Método</th><th>Total</th></tr></thead>
                <tbody>
                  {Object.entries(byMethod).map(([m, v]) => (
                    <tr key={m}><td>{m}</td><td style={{ color: "var(--pk)" }}>{fmtGs(v)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="panel">
              <div className="panel-hd"><div className="panel-title">Últimas ventas</div></div>
              <table className="tbl">
                <thead><tr><th>Hora</th><th>Vendedora</th><th>Total</th></tr></thead>
                <tbody>
                  {data.slice(0, 6).map(v => (
                    <tr key={v.id}>
                      <td>{new Date(v.created_at).toTimeString().slice(0, 5)}</td>
                      <td>{v.vendedoras?.nombre || "—"}</td>
                      <td style={{ color: "var(--pk)" }}>{fmtGs(v.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── PAGE PLACEHOLDER ─────────────────────────────────────────
function PlaceholderPage({ title }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, gap: 12 }}>
      <div style={{ fontFamily: "var(--fd)", fontSize: 22, color: "var(--wh)" }}>{title}</div>
      <div style={{ fontSize: 13, color: "var(--mu)" }}>Módulo disponible en la próxima versión</div>
    </div>
  );
}

// ── APP PRINCIPAL ────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [tiendas, setTiendas] = useState([]);
  const [tiendaIdx, setTiendaIdx] = useState(0);
  const [page, setPage] = useState("pos");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });
    supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
    // Load tiendas
    supabase.from("tiendas").select("*").eq("activa", true).then(({ data }) => setTiendas(data || []));
  }, []);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3500); }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  const tiendaActual = tiendas[tiendaIdx];
  const tiendaId = tiendaActual?.id;
  const tiendaNombre = tiendaActual?.nombre || "Cargando...";

  function toggleTienda() { setTiendaIdx(prev => (prev + 1) % Math.max(tiendas.length, 1)); }

  function renderPage() {
    const props = { tiendaId, vendedoraId: user?.id, toast: showToast };
    switch (page) {
      case "pos": return <POSPage {...props} />;
      case "dashboard": return <DashboardPage {...props} />;
      case "caja": return <CajaPage {...props} />;
      case "ventas": return <VentasPage {...props} />;
      case "stock": return <StockPage {...props} />;
      case "productos": return <ProductosPage {...props} />;
      case "gastos": return <GastosPage {...props} />;
      case "clientes": return <ClientesPage {...props} />;
      case "comisiones": return <ComisionesPage {...props} />;
      case "informes": return <InformesPage {...props} />;
      case "transferencias": return <PlaceholderPage title="Transferencias entre Depósitos" />;
      case "etiquetas": return <PlaceholderPage title="Etiquetas y Códigos de Barras" />;
      case "compras": return <PlaceholderPage title="Compras" />;
      case "proveedores": return <PlaceholderPage title="Proveedores" />;
      case "vendedoras": return <PlaceholderPage title="Vendedoras" />;
      case "devoluciones": return <PlaceholderPage title="Devoluciones" />;
      case "presupuestos": return <PlaceholderPage title="Presupuestos" />;
      case "delivery": return <PlaceholderPage title="Delivery" />;
      case "remision": return <PlaceholderPage title="Nota de Remisión" />;
      case "precios": return <PlaceholderPage title="Lista de Precios" />;
      default: return <DashboardPage {...props} />;
    }
  }

  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bs)", color: "var(--mu)", fontSize: 13 }}>
      Cargando sistema...
    </div>
  );

  if (!user) return (
    <>
      <style>{G}</style>
      <LoginPage onLogin={setUser} />
    </>
  );

  return (
    <>
      <style>{G}</style>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <Topbar tienda={tiendaNombre} onToggleTienda={toggleTienda} user={user} onLogout={handleLogout} />
        <div className="layout">
          <Sidebar active={page} onNav={setPage} />
          <div className="main">{renderPage()}</div>
        </div>
      </div>
      <Toast msg={toast} onClose={() => setToast("")} />
    </>
  );
}
