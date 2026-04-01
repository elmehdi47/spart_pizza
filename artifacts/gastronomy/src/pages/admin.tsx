import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Image, UtensilsCrossed, ClipboardList,
  Pencil, Check, X, Trash2, ChevronDown, ChevronUp,
  RefreshCw, ExternalLink, LogOut, User2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const API = (path: string) => `/api${path}`;

type MediaItem = { id: number; slot: string; imageUrl: string };
type MenuItem = {
  id: number; category: string;
  nameEn: string; nameFr: string; nameAr: string;
  description: string; price: string; imageUrl?: string;
  sortOrder: number;
};
type Order = {
  id: number; customerName: string; customerEmail: string;
  customerPhone?: string; message?: string; status: string;
  createdAt: string;
};

const SLOT_LABELS: Record<string, string> = {
  hero: "Hero Banner",
  starters: "Starters Category",
  mains: "Mains Category",
  desserts: "Desserts Category",
  drinks: "Drinks Category",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  confirmed: "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};

const CATEGORY_ORDER = ["starters", "mains", "desserts", "drinks"];

type Section = "dashboard" | "media" | "menu" | "orders";

export default function Admin() {
  const [section, setSection] = useState<Section>("dashboard");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { username, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [m, mi, o] = await Promise.all([
        fetch(API("/admin/media")).then(r => r.json()),
        fetch(API("/admin/menu")).then(r => r.json()),
        fetch(API("/admin/orders")).then(r => r.json()),
      ]);
      setMedia(Array.isArray(m) ? m : []);
      setMenuItems(Array.isArray(mi) ? mi : []);
      setOrders(Array.isArray(o) ? o : []);
    } catch {
      toast({ title: "Connection error", description: "Could not reach the API server.", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const nav: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "media", label: "Media", icon: <Image className="w-4 h-4" /> },
    { id: "menu", label: "Menu Items", icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: "orders", label: "Orders", icon: <ClipboardList className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-white flex">

      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/5 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <img src="/spart-logo.jpg" alt="Spart" className="h-9 w-9 rounded-full object-cover" />
            <span className="text-lg font-serif font-bold tracking-widest text-white">SPART</span>
          </div>
          <div className="flex items-center gap-2 px-1 py-2 bg-white/[0.04] border border-white/5 rounded-sm">
            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
              <User2 className="w-3 h-3 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-medium truncate">{username || "Admin"}</p>
              <p className="text-[10px] text-gray-600">Administrator</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium tracking-wide rounded-sm transition-all duration-200
                ${section === item.id
                  ? "bg-primary/15 text-primary border-l-2 border-primary"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button
            onClick={fetchAll}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs uppercase tracking-widest text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-sm transition-all"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
          <Link href="/">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs uppercase tracking-widest text-gray-400 hover:text-primary border border-white/10 hover:border-primary/30 rounded-sm transition-all">
              <ExternalLink className="w-3 h-3" />
              View Site
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs uppercase tracking-widest text-red-500/70 hover:text-red-400 border border-red-500/15 hover:border-red-500/30 rounded-sm transition-all"
          >
            <LogOut className="w-3 h-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-5xl">
          {section === "dashboard" && (
            <DashboardView media={media} menuItems={menuItems} orders={orders} />
          )}
          {section === "media" && (
            <MediaView media={media} onUpdated={fetchAll} toast={toast} />
          )}
          {section === "menu" && (
            <MenuView items={menuItems} onUpdated={fetchAll} toast={toast} />
          )}
          {section === "orders" && (
            <OrdersView orders={orders} onUpdated={fetchAll} toast={toast} />
          )}
        </div>
      </main>
    </div>
  );
}

// ── DASHBOARD ────────────────────────────────────────────────────────────────

function DashboardView({ media, menuItems, orders }: { media: MediaItem[]; menuItems: MenuItem[]; orders: Order[] }) {
  const pending = orders.filter(o => o.status === "pending").length;
  const confirmed = orders.filter(o => o.status === "confirmed").length;
  const stats = [
    { label: "Image Slots", value: media.length, color: "text-blue-400" },
    { label: "Menu Items", value: menuItems.length, color: "text-primary" },
    { label: "Pending Orders", value: pending, color: "text-amber-400" },
    { label: "Confirmed", value: confirmed, color: "text-green-400" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-2">Dashboard</h1>
      <p className="text-sm text-gray-400 mb-8 font-light">Overview of your restaurant management panel.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <div key={s.label} className="p-5 bg-white/[0.03] border border-white/5 rounded-sm">
            <p className={`text-3xl font-serif font-bold mb-1 ${s.color}`}>{s.value}</p>
            <p className="text-xs uppercase tracking-widest text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-sm">
          <h2 className="text-base font-serif text-white mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 4).map(o => (
                <div key={o.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white font-medium">{o.customerName}</p>
                    <p className="text-xs text-gray-500">{o.customerEmail}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 border rounded-sm ${STATUS_COLORS[o.status] || ""}`}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-sm">
          <h2 className="text-base font-serif text-white mb-4">Quick Tips</h2>
          <ul className="space-y-2 text-sm text-gray-400 font-light">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">—</span>Go to <strong className="text-white">Media</strong> to change the hero banner or category photos.</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">—</span>Go to <strong className="text-white">Menu Items</strong> to edit dish names, descriptions, and prices.</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">—</span>Go to <strong className="text-white">Orders</strong> to confirm or cancel customer reservation requests.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── MEDIA ─────────────────────────────────────────────────────────────────────

function MediaView({ media, onUpdated, toast }: { media: MediaItem[]; onUpdated: () => void; toast: any }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (m: MediaItem) => {
    setEditing(m.slot);
    setUrl(m.imageUrl);
  };

  const save = async (slot: string) => {
    if (!url.trim()) return;
    setSaving(true);
    try {
      const r = await fetch(API(`/admin/media/${slot}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url.trim() }),
      });
      if (!r.ok) throw new Error();
      toast({ title: "Saved", description: `Image updated for ${SLOT_LABELS[slot] || slot}.` });
      setEditing(null);
      onUpdated();
    } catch {
      toast({ title: "Error", description: "Failed to save image URL.", variant: "destructive" });
    }
    setSaving(false);
  };

  const getDisplayUrl = (imageUrl: string) => {
    if (imageUrl.startsWith("/")) return imageUrl;
    return imageUrl;
  };

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-2">Media Management</h1>
      <p className="text-sm text-gray-400 mb-8 font-light">
        Update images displayed on the website. Paste any image URL or use a local path.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {media.map(m => (
          <div key={m.slot} className="bg-white/[0.03] border border-white/5 rounded-sm overflow-hidden">
            <div className="relative h-48 bg-zinc-900">
              <img
                src={getDisplayUrl(m.imageUrl)}
                alt={SLOT_LABELS[m.slot] || m.slot}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.2"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-xs uppercase tracking-widest text-gray-300 bg-black/60 px-2 py-1 rounded-sm">
                  {SLOT_LABELS[m.slot] || m.slot}
                </span>
              </div>
            </div>

            <div className="p-4">
              {editing === m.slot ? (
                <div className="space-y-3">
                  <Input
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://... or /public/image.png"
                    className="bg-transparent border border-white/15 rounded-sm text-sm text-white focus-visible:border-primary focus-visible:ring-0"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={saving}
                      onClick={() => save(m.slot)}
                      className="flex-1 bg-primary hover:bg-primary/90 text-black font-medium text-xs uppercase tracking-widest rounded-sm"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditing(null)}
                      className="border-white/15 text-gray-400 hover:text-white rounded-sm text-xs"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-gray-500 font-mono truncate flex-1">{m.imageUrl}</p>
                  <button
                    onClick={() => startEdit(m)}
                    className="shrink-0 flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors px-3 py-1.5 border border-white/10 hover:border-primary/30 rounded-sm"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MENU ──────────────────────────────────────────────────────────────────────

function MenuView({ items, onUpdated, toast }: { items: MenuItem[]; onUpdated: () => void; toast: any }) {
  const [activeCategory, setActiveCategory] = useState("starters");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<MenuItem>>({});
  const [saving, setSaving] = useState(false);

  const grouped = CATEGORY_ORDER.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    acc[cat] = items.filter(i => i.category === cat).sort((a, b) => a.sortOrder - b.sortOrder);
    return acc;
  }, {});

  const startEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setForm({ ...item });
  };

  const cancelEdit = () => { setEditingId(null); setForm({}); };

  const save = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const r = await fetch(API(`/admin/menu/${editingId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameEn: form.nameEn, nameFr: form.nameFr, nameAr: form.nameAr,
          description: form.description, price: form.price, imageUrl: form.imageUrl,
        }),
      });
      if (!r.ok) throw new Error();
      toast({ title: "Saved", description: "Menu item updated." });
      setEditingId(null);
      onUpdated();
    } catch {
      toast({ title: "Error", description: "Failed to save menu item.", variant: "destructive" });
    }
    setSaving(false);
  };

  const field = (key: keyof MenuItem) => ({
    value: (form[key] as string) ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value })),
  });

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-2">Menu Items</h1>
      <p className="text-sm text-gray-400 mb-6 font-light">Edit dish names (EN / FR / AR), descriptions, prices, and images.</p>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/5 pb-4">
        {CATEGORY_ORDER.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); cancelEdit(); }}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-medium rounded-sm transition-all ${
              activeCategory === cat
                ? "bg-primary text-black"
                : "text-gray-400 hover:text-white border border-white/10 hover:border-white/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {(grouped[activeCategory] || []).map(item => (
          <div
            key={item.id}
            className={`border rounded-sm overflow-hidden transition-all duration-200 ${
              editingId === item.id
                ? "border-primary/40 bg-white/[0.04]"
                : "border-white/5 bg-white/[0.02] hover:bg-white/[0.035]"
            }`}
          >
            {editingId === item.id ? (
              /* Edit Form */
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">Name (EN)</label>
                    <Input {...field("nameEn")} className="bg-transparent border-white/15 text-white text-sm focus-visible:border-primary focus-visible:ring-0 rounded-sm" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">Name (FR)</label>
                    <Input {...field("nameFr")} className="bg-transparent border-white/15 text-white text-sm focus-visible:border-primary focus-visible:ring-0 rounded-sm" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">Name (AR)</label>
                    <Input {...field("nameAr")} dir="rtl" className="bg-transparent border-white/15 text-white text-sm focus-visible:border-primary focus-visible:ring-0 rounded-sm text-right" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">Description</label>
                    <Textarea {...field("description")} className="bg-transparent border-white/15 text-white text-sm focus-visible:border-primary focus-visible:ring-0 rounded-sm resize-none" rows={2} />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">Price</label>
                    <Input {...field("price")} className="bg-transparent border-white/15 text-white text-sm focus-visible:border-primary focus-visible:ring-0 rounded-sm" />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">Image URL (optional)</label>
                  <Input {...field("imageUrl")} placeholder="https://... or leave empty for category image" className="bg-transparent border-white/15 text-white text-sm focus-visible:border-primary focus-visible:ring-0 rounded-sm" />
                </div>
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    disabled={saving}
                    onClick={save}
                    className="bg-primary hover:bg-primary/90 text-black font-medium text-xs uppercase tracking-widest rounded-sm px-6"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelEdit}
                    className="border-white/15 text-gray-400 hover:text-white rounded-sm text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              /* Row View */
              <div className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-0.5">
                    <p className="font-serif text-white font-medium">{item.nameEn}</p>
                    <span className="text-xs text-gray-500 font-light hidden md:block">/ {item.nameFr}</span>
                    <span className="text-xs text-gray-600 hidden lg:block">/ {item.nameAr}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-light truncate">{item.description}</p>
                </div>
                <span className="font-serif text-primary font-medium shrink-0">{item.price}</span>
                <button
                  onClick={() => startEdit(item)}
                  className="shrink-0 flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors px-3 py-1.5 border border-white/10 hover:border-primary/30 rounded-sm"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ORDERS ────────────────────────────────────────────────────────────────────

function OrdersView({ orders, onUpdated, toast }: { orders: Order[]; onUpdated: () => void; toast: any }) {
  const [updating, setUpdating] = useState<number | null>(null);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    try {
      const r = await fetch(API(`/admin/orders/${id}/status`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!r.ok) throw new Error();
      toast({ title: "Updated", description: `Order #${id} marked as ${status}.` });
      onUpdated();
    } catch {
      toast({ title: "Error", description: "Failed to update order status.", variant: "destructive" });
    }
    setUpdating(null);
  };

  const deleteOrder = async (id: number) => {
    setUpdating(id);
    try {
      const r = await fetch(API(`/admin/orders/${id}`), { method: "DELETE" });
      if (!r.ok) throw new Error();
      toast({ title: "Deleted", description: `Order #${id} removed.` });
      onUpdated();
    } catch {
      toast({ title: "Error", description: "Failed to delete order.", variant: "destructive" });
    }
    setUpdating(null);
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch { return iso; }
  };

  return (
    <div>
      <h1 className="text-2xl font-serif text-white mb-2">Orders & Reservations</h1>
      <p className="text-sm text-gray-400 mb-8 font-light">
        Manage customer reservation requests submitted via the contact form.
      </p>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm uppercase tracking-widest">No orders yet</p>
          <p className="text-xs mt-2 text-gray-700">Reservations submitted through the website will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white/[0.025] border border-white/5 rounded-sm p-5"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <p className="font-serif text-white font-medium">{order.customerName}</p>
                    <span className={`text-xs px-2 py-0.5 border rounded-sm ${STATUS_COLORS[order.status] || ""}`}>
                      {order.status}
                    </span>
                    <span className="text-xs text-gray-600">#{order.id}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-0.5">{order.customerEmail}{order.customerPhone ? ` · ${order.customerPhone}` : ""}</p>
                  <p className="text-xs text-gray-600">{formatDate(order.createdAt)}</p>
                  {order.message && (
                    <p className="text-sm text-gray-400 font-light mt-3 leading-relaxed border-l-2 border-white/10 pl-3">
                      {order.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {order.status !== "confirmed" && (
                    <button
                      disabled={updating === order.id}
                      onClick={() => updateStatus(order.id, "confirmed")}
                      className="flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 border border-green-500/25 hover:border-green-500/50 px-3 py-1.5 rounded-sm transition-all"
                    >
                      <Check className="w-3 h-3" />
                      Confirm
                    </button>
                  )}
                  {order.status !== "cancelled" && (
                    <button
                      disabled={updating === order.id}
                      onClick={() => updateStatus(order.id, "cancelled")}
                      className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 border border-amber-500/25 hover:border-amber-500/50 px-3 py-1.5 rounded-sm transition-all"
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </button>
                  )}
                  <button
                    disabled={updating === order.id}
                    onClick={() => deleteOrder(order.id)}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 border border-red-500/25 hover:border-red-500/50 px-3 py-1.5 rounded-sm transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
