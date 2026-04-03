import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Image, UtensilsCrossed, ClipboardList, Layers,
  Pencil, Check, X, Trash2,
  RefreshCw, ExternalLink, LogOut, User2, Plus, Upload, ImageOff
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
type OrderItem = {
  id: number; nameEn: string; nameFr: string; nameAr: string;
  price: string; quantity: number;
};
type Order = {
  id: number; customerName: string; customerEmail: string;
  customerPhone?: string; message?: string; status: string;
  items?: string; totalPrice?: string;
  createdAt: string;
};
type Category = {
  id: number; slug: string;
  nameEn: string; nameFr: string; nameAr: string;
  imageUrl?: string; sortOrder: number;
};

const SLOT_LABELS: Record<string, string> = {
  hero: "Hero Banner",
  starters: "Starters Category",
  mains: "Mains Category",
  desserts: "Desserts Category",
  drinks: "Drinks Category",
};

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-amber-500/15  text-amber-400  border-amber-500/30",
  confirmed: "bg-blue-500/15   text-blue-400   border-blue-500/30",
  cancelled: "bg-red-500/15    text-red-400    border-red-500/30",
};
const STATUS_LABELS: Record<string, string> = {
  pending: "Pending", confirmed: "Confirmed", cancelled: "Cancelled",
};

const CATEGORY_ORDER = ["starters", "mains", "desserts", "drinks"];

type Section = "dashboard" | "media" | "menu" | "orders" | "categories";

export default function Admin() {
  const [section, setSection] = useState<Section>("dashboard");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
      const [m, mi, o, cats] = await Promise.all([
        fetch(API("/admin/media")).then(r => r.json()),
        fetch(API("/admin/menu")).then(r => r.json()),
        fetch(API("/admin/orders")).then(r => r.json()),
        fetch(API("/admin/categories")).then(r => r.json()),
      ]);
      setMedia(Array.isArray(m) ? m : []);
      setMenuItems(Array.isArray(mi) ? mi : []);
      setOrders(Array.isArray(o) ? o : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch {
      toast({ title: "Connection error", description: "Could not reach the API server.", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const nav: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "media", label: "Media", icon: <Image className="w-4 h-4" /> },
    { id: "categories", label: "Categories", icon: <Layers className="w-4 h-4" /> },
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
          {section === "categories" && (
            <CategoriesView categories={categories} onUpdated={fetchAll} toast={toast} />
          )}
          {section === "menu" && (
            <MenuView items={menuItems} categories={categories} onUpdated={fetchAll} toast={toast} />
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

// ── IMAGE UPLOAD FIELD ─────────────────────────────────────────────────────────

function ImageUploadField({
  value, onChange, toast,
}: { value: string; onChange: (url: string) => void; toast: any }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const r = await fetch(API("/admin/upload"), { method: "POST", body: fd });
      if (!r.ok) throw new Error();
      const data = await r.json() as { url: string };
      onChange(data.url);
      toast({ title: "Image uploaded", description: "Image uploaded and URL set." });
    } catch {
      toast({ title: "Upload failed", description: "Could not upload image.", variant: "destructive" });
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://... or upload from PC below"
          className="bg-transparent border-white/15 text-white text-sm focus-visible:border-primary focus-visible:ring-0 rounded-sm flex-1"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-widest font-medium text-gray-300 hover:text-primary border border-white/15 hover:border-primary/40 rounded-sm transition-all disabled:opacity-50"
        >
          {uploading ? (
            <span className="w-3 h-3 border border-white/30 border-t-primary rounded-full animate-spin" />
          ) : (
            <Upload className="w-3 h-3" />
          )}
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
      {value && (
        <div className="relative h-24 rounded-sm overflow-hidden bg-zinc-900 border border-white/8">
          <img src={value} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.opacity = "0.1"; }} />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center hover:bg-red-900/70 transition-colors"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}

// ── CATEGORIES ────────────────────────────────────────────────────────────────

function CategoriesView({ categories, onUpdated, toast }: { categories: Category[]; onUpdated: () => void; toast: any }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ nameEn: "", nameFr: "", nameAr: "", imageUrl: "" });
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const API = (path: string) => `/api${path}`;

  const toSlug = (name: string) =>
    name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handleCreate = async () => {
    if (!form.nameEn.trim()) {
      toast({ title: "Missing fields", description: "English name is required.", variant: "destructive" });
      return;
    }
    const slug = toSlug(form.nameEn);
    setCreating(true);
    const res = await fetch(API("/admin/categories"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionStorage.getItem("admin_token")}` },
      body: JSON.stringify({ slug, ...form }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) {
      toast({ title: "Error", description: data.error || "Failed to create category", variant: "destructive" });
    } else {
      toast({ title: "Category created" });
      setForm({ nameEn: "", nameFr: "", nameAr: "", imageUrl: "" });
      setShowAdd(false);
      onUpdated();
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    const res = await fetch(API(`/admin/categories/${id}`), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${sessionStorage.getItem("admin_token")}` },
    });
    setDeletingId(null);
    setConfirmDelete(null);
    if (!res.ok) {
      toast({ title: "Error", description: "Failed to delete category", variant: "destructive" });
    } else {
      toast({ title: "Category deleted" });
      onUpdated();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-light tracking-widest uppercase text-white">Categories</h2>
          <p className="text-sm text-gray-400 mt-1 font-light">
            Manage the menu categories shown on the home page and menu pages.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border border-white/10 text-gray-400 hover:text-white hover:border-white/30 rounded-sm transition-all"
        >
          <Plus className="w-3 h-3" /> {showAdd ? "Cancel" : "Add Category"}
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-5 border border-primary/30 bg-primary/5 rounded-sm"
          >
            <p className="text-xs uppercase tracking-widest text-primary mb-4">New Category</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Name (English) *</label>
                <Input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))}
                  placeholder="e.g. Pasta" className="bg-white/5 border-white/10 text-white text-sm" />
                {form.nameEn.trim() && (
                  <p className="text-[10px] text-gray-600 mt-1">
                    URL key: <span className="text-gray-500">{toSlug(form.nameEn)}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Name (French)</label>
                <Input value={form.nameFr} onChange={e => setForm(f => ({ ...f, nameFr: e.target.value }))}
                  placeholder="e.g. Pâtes" className="bg-white/5 border-white/10 text-white text-sm" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-400 mb-1 block">Name (Arabic)</label>
                <Input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))}
                  placeholder="e.g. معكرونة" className="bg-white/5 border-white/10 text-white text-sm" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-400 mb-1.5 block">Category Image</label>
                <ImageUploadField
                  value={form.imageUrl}
                  onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
                  toast={toast}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleCreate} disabled={creating}
                className="bg-primary text-black hover:bg-primary/90 text-xs uppercase tracking-widest px-6">
                {creating ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2 mt-4">
        {categories.map(cat => (
          <div key={cat.id}
            className="flex items-center justify-between px-4 py-3 bg-white/3 border border-white/5 rounded-sm hover:border-white/10 transition-all"
          >
            <div className="flex items-center gap-4 min-w-0">
              {cat.imageUrl && (
                <img src={cat.imageUrl} alt={cat.nameEn}
                  className="w-10 h-10 object-cover rounded-sm opacity-80" />
              )}
              <div className="min-w-0">
                <p className="text-sm text-white font-medium">{cat.nameEn}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  <span className="text-gray-400">{cat.nameFr}</span>
                  <span className="mx-2 text-gray-700">·</span>
                  <span className="text-gray-400">{cat.nameAr}</span>
                  <span className="mx-2 text-gray-700">·</span>
                  <span className="text-gray-600">/{cat.slug}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {confirmDelete === cat.id ? (
                <>
                  <button onClick={() => setConfirmDelete(null)}
                    className="text-xs text-gray-400 hover:text-white px-2 py-1 border border-white/10 rounded-sm transition-all">
                    Cancel
                  </button>
                  <button onClick={() => handleDelete(cat.id)} disabled={deletingId === cat.id}
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1 border border-red-500/20 hover:border-red-500/40 rounded-sm transition-all">
                    {deletingId === cat.id ? "Deleting..." : "Confirm Delete"}
                  </button>
                </>
              ) : (
                <button onClick={() => setConfirmDelete(cat.id)}
                  className="text-gray-600 hover:text-red-400 transition-colors p-1.5">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-8">No categories yet. Add one above.</p>
        )}
      </div>
    </div>
  );
}

// ── MENU ──────────────────────────────────────────────────────────────────────

const EMPTY_NEW = { nameEn: "", nameFr: "", nameAr: "", description: "", price: "", imageUrl: "" };

function MenuView({ items, categories, onUpdated, toast }: { items: MenuItem[]; categories: Category[]; onUpdated: () => void; toast: any }) {
  const catSlugs = categories.length > 0 ? categories.map(c => c.slug) : CATEGORY_ORDER;
  const [activeCategory, setActiveCategory] = useState(catSlugs[0] || "starters");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<MenuItem>>({});
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState({ ...EMPTY_NEW });
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const grouped = catSlugs.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    acc[cat] = items.filter(i => i.category === cat).sort((a, b) => a.sortOrder - b.sortOrder);
    return acc;
  }, {});

  const startEdit = (item: MenuItem) => {
    setShowAdd(false);
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
          description: form.description, price: form.price, imageUrl: form.imageUrl || null,
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

  const createItem = async () => {
    if (!newForm.nameEn.trim()) {
      toast({ title: "Required", description: "English name is required.", variant: "destructive" });
      return;
    }
    setCreating(true);
    try {
      const r = await fetch(API("/admin/menu"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: activeCategory,
          nameEn: newForm.nameEn.trim(),
          nameFr: newForm.nameFr.trim() || newForm.nameEn.trim(),
          nameAr: newForm.nameAr.trim() || newForm.nameEn.trim(),
          description: newForm.description.trim(),
          price: newForm.price.trim(),
          imageUrl: newForm.imageUrl.trim() || null,
        }),
      });
      if (!r.ok) throw new Error();
      toast({ title: "Created", description: `"${newForm.nameEn}" added to ${activeCategory}.` });
      setNewForm({ ...EMPTY_NEW });
      setShowAdd(false);
      onUpdated();
    } catch {
      toast({ title: "Error", description: "Failed to create menu item.", variant: "destructive" });
    }
    setCreating(false);
  };

  const deleteItem = async (id: number) => {
    setDeletingId(id);
    try {
      const r = await fetch(API(`/admin/menu/${id}`), { method: "DELETE" });
      if (!r.ok) throw new Error();
      toast({ title: "Deleted", description: "Menu item removed." });
      setConfirmDelete(null);
      onUpdated();
    } catch {
      toast({ title: "Error", description: "Failed to delete item.", variant: "destructive" });
    }
    setDeletingId(null);
  };

  const setField = useCallback((key: keyof typeof EMPTY_NEW, val: string) => {
    setForm(f => ({ ...f, [key]: val }));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-serif text-white">Menu Items</h1>
        <button
          onClick={() => { setShowAdd(v => !v); setEditingId(null); setForm({}); }}
          className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest font-medium rounded-sm border transition-all ${
            showAdd
              ? "bg-white/5 text-gray-300 border-white/15"
              : "bg-primary/15 text-primary border-primary/30 hover:bg-primary/25"
          }`}
        >
          {showAdd ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showAdd ? "Cancel" : "Add New Item"}
        </button>
      </div>
      <p className="text-sm text-gray-400 mb-6 font-light">Edit dish names (EN / FR / AR), descriptions, prices, and images.</p>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-white/5 pb-4">
        {catSlugs.map(cat => {
          const catData = categories.find(c => c.slug === cat);
          const label = catData?.nameEn || cat;
          return (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); cancelEdit(); setShowAdd(false); setNewForm({ ...EMPTY_NEW }); }}
              className={`px-4 py-2 text-xs uppercase tracking-widest font-medium rounded-sm transition-all ${
                activeCategory === cat
                  ? "bg-primary text-black"
                  : "text-gray-400 hover:text-white border border-white/10 hover:border-white/20"
              }`}
            >
              {label}
              <span className={`ml-1.5 text-[10px] font-normal ${activeCategory === cat ? "text-black/60" : "text-gray-600"}`}>
                {grouped[cat]?.length ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add New Item Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="border border-primary/30 bg-primary/5 rounded-sm p-6 mb-4"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                <Plus className="w-3 h-3 text-primary" />
              </div>
              <p className="text-sm font-medium text-white">
                New item in <span className="text-primary capitalize">{activeCategory}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">Name (EN) <span className="text-red-400">*</span></label>
                <Input
                  value={newForm.nameEn}
                  onChange={e => setNewForm(f => ({ ...f, nameEn: e.target.value }))}
                  placeholder="e.g. Grilled Chicken"
                  autoFocus
                  className="bg-transparent border-white/15 text-white text-sm focus-visible:border-primary focus-visible:ring-0 rounded-sm"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">Name (FR)</label>
                <Input
                  value={newForm.nameFr}
                  onChange={e => setNewForm(f => ({ ...f, nameFr: e.target.value }))}
                  placeholder="e.g. Poulet Grillé"
                  className="bg-transparent border-white/15 text-white text-sm focus-visible:border-primary focus-visible:ring-0 rounded-sm"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">Name (AR)</label>
                <Input
                  value={newForm.nameAr}
                  onChange={e => setNewForm(f => ({ ...f, nameAr: e.target.value }))}
                  dir="rtl"
                  placeholder="مثال: دجاج مشوي"
                  className="bg-transparent border-white/15 text-white text-sm focus-visible:border-primary focus-visible:ring-0 rounded-sm text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">Description</label>
                <Textarea
                  value={newForm.description}
                  onChange={e => setNewForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Short description of the dish..."
                  className="bg-transparent border-white/15 text-white text-sm focus-visible:border-primary focus-visible:ring-0 rounded-sm resize-none"
                  rows={2}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">Price</label>
                <Input
                  value={newForm.price}
                  onChange={e => setNewForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="e.g. 1200 DA"
                  className="bg-transparent border-white/15 text-white text-sm focus-visible:border-primary focus-visible:ring-0 rounded-sm"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">Photo</label>
              <ImageUploadField
                value={newForm.imageUrl}
                onChange={url => setNewForm(f => ({ ...f, imageUrl: url }))}
                toast={toast}
              />
            </div>

            <div className="flex gap-3">
              <Button
                disabled={creating}
                onClick={createItem}
                className="bg-primary hover:bg-primary/90 text-black font-semibold text-xs uppercase tracking-widest rounded-sm px-6"
              >
                <Check className="w-3 h-3 mr-1.5" />
                {creating ? "Creating..." : "Create Item"}
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowAdd(false); setNewForm({ ...EMPTY_NEW }); }}
                className="border-white/15 text-gray-400 hover:text-white rounded-sm text-xs"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item List */}
      <div className="space-y-3">
        {(grouped[activeCategory] || []).length === 0 && !showAdd && (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/8 rounded-sm text-gray-600">
            <ImageOff className="w-8 h-8 mb-3 opacity-40" />
            <p className="text-sm">No items in this category yet.</p>
            <button
              onClick={() => setShowAdd(true)}
              className="mt-4 text-xs text-primary hover:text-primary/80 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add the first item
            </button>
          </div>
        )}
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
                    <Input
                      value={(form.nameEn as string) ?? ""}
                      onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))}
                      className="bg-transparent border-white/15 text-white text-sm focus-visible:border-primary focus-visible:ring-0 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">Name (FR)</label>
                    <Input
                      value={(form.nameFr as string) ?? ""}
                      onChange={e => setForm(f => ({ ...f, nameFr: e.target.value }))}
                      className="bg-transparent border-white/15 text-white text-sm focus-visible:border-primary focus-visible:ring-0 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">Name (AR)</label>
                    <Input
                      value={(form.nameAr as string) ?? ""}
                      onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))}
                      dir="rtl"
                      className="bg-transparent border-white/15 text-white text-sm focus-visible:border-primary focus-visible:ring-0 rounded-sm text-right"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">Description</label>
                    <Textarea
                      value={(form.description as string) ?? ""}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      className="bg-transparent border-white/15 text-white text-sm focus-visible:border-primary focus-visible:ring-0 rounded-sm resize-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">Price</label>
                    <Input
                      value={(form.price as string) ?? ""}
                      onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      className="bg-transparent border-white/15 text-white text-sm focus-visible:border-primary focus-visible:ring-0 rounded-sm"
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="text-xs uppercase tracking-widest text-gray-500 block mb-1.5">Photo</label>
                  <ImageUploadField
                    value={(form.imageUrl as string) ?? ""}
                    onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
                    toast={toast}
                  />
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
                  <Button size="sm" variant="outline" onClick={cancelEdit} className="border-white/15 text-gray-400 hover:text-white rounded-sm text-xs">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              /* Row View */
              <div className="p-4 flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-sm overflow-hidden bg-zinc-900 shrink-0 border border-white/5">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.nameEn} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.opacity = "0.15"; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageOff className="w-4 h-4 text-gray-700" />
                    </div>
                  )}
                </div>

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

                {confirmDelete === item.id ? (
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-xs text-red-400">Delete?</span>
                    <button
                      onClick={() => deleteItem(item.id)}
                      disabled={deletingId === item.id}
                      className="text-xs text-red-400 hover:text-red-300 px-2 py-1 border border-red-500/30 hover:border-red-400/50 rounded-sm transition-colors disabled:opacity-50"
                    >
                      {deletingId === item.id ? "..." : "Yes"}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1 border border-white/10 rounded-sm"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(item.id)}
                    className="shrink-0 flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-400 transition-colors px-2 py-1.5 border border-white/5 hover:border-red-500/30 rounded-sm"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
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
  const [filter, setFilter] = useState<string>("pending");

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    try {
      const r = await fetch(API(`/admin/orders/${id}/status`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!r.ok) throw new Error();
      toast({ title: "Status updated", description: `Order #${id} → ${STATUS_LABELS[status] || status}.` });
      onUpdated();
    } catch {
      toast({ title: "Error", description: "Failed to update order status.", variant: "destructive" });
    }
    setUpdating(null);
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      return { date, time };
    } catch { return { date: iso, time: "" }; }
  };

  const parseItems = (raw?: string): OrderItem[] => {
    if (!raw) return [];
    try { return JSON.parse(raw) as OrderItem[]; } catch { return []; }
  };

  const filtered = orders.filter(o => o.status === filter)
    .slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const counts = { pending: 0, confirmed: 0, cancelled: 0 };
  orders.forEach(o => { if (o.status in counts) (counts as any)[o.status]++; });

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-serif text-white mb-1">Orders</h1>
          <p className="text-sm text-gray-500 font-light">
            {orders.length} total order{orders.length !== 1 ? "s" : ""} — newest first.
          </p>
        </div>
        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["pending", "confirmed", "cancelled"] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs uppercase tracking-widest px-3 py-1.5 rounded-sm border transition-all ${
                filter === s
                  ? "bg-primary/15 border-primary/40 text-primary"
                  : "border-white/8 text-gray-500 hover:text-white hover:border-white/15"
              }`}
            >
              {STATUS_LABELS[s]}
              <span className="ml-1.5 opacity-50">({(counts as any)[s]})</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-600">
          <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-sm uppercase tracking-widest">No orders{filter !== "all" ? ` with status "${STATUS_LABELS[filter]}"` : ""}</p>
          <p className="text-xs mt-2 text-gray-700">Orders placed by customers on the menu will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => {
            const orderItems = parseItems(order.items);
            const totalQty = orderItems.reduce((s, i) => s + i.quantity, 0);
            const { date, time } = formatDate(order.createdAt);
            const isCancelled = order.status === "cancelled";
            const isLoading = updating === order.id;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-sm overflow-hidden ${
                  isCancelled
                    ? "bg-white/[0.012] border-white/5 opacity-60"
                    : "bg-white/[0.03] border-white/8"
                }`}
              >
                {/* Top stripe: status color */}
                <div className={`h-0.5 w-full ${
                  order.status === "pending"   ? "bg-amber-500/60" :
                  order.status === "confirmed" ? "bg-blue-500/60" :
                  "bg-red-500/30"
                }`} />

                <div className="p-5 md:p-6">
                  {/* Row 1: order meta */}
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className={`text-[10px] font-bold px-2.5 py-1 border rounded-sm uppercase tracking-widest ${STATUS_COLORS[order.status] || "border-white/10 text-gray-500"}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                    <span className="text-xs text-gray-600 font-mono">Order #{order.id}</span>
                    <span className="text-gray-700 text-xs">·</span>
                    <span className="text-xs text-gray-500">{date}</span>
                    <span className="text-xs text-gray-600">{time}</span>
                    {totalQty > 0 && (
                      <>
                        <span className="text-gray-700 text-xs">·</span>
                        <span className="text-xs text-gray-500">{totalQty} item{totalQty !== 1 ? "s" : ""}</span>
                      </>
                    )}
                    {order.totalPrice && (
                      <>
                        <span className="text-gray-700 text-xs">·</span>
                        <span className="text-xs font-semibold text-primary font-serif">{order.totalPrice}</span>
                      </>
                    )}
                  </div>

                  {/* Row 2: two columns — customer | items */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Left: Customer info */}
                    <div className="space-y-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600">Customer</p>

                      <div>
                        <p className="text-xl font-serif text-white leading-tight">{order.customerName}</p>
                        {order.customerPhone && (
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="inline-flex items-center gap-2 mt-1.5 text-primary hover:text-primary/80 transition-colors font-medium text-base"
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {order.customerPhone}
                          </a>
                        )}
                      </div>

                      {order.message && (
                        <div className="bg-white/[0.03] border border-white/6 rounded-sm px-4 py-3">
                          <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1.5">Note</p>
                          <p className="text-sm text-gray-300 font-light leading-relaxed italic">"{order.message}"</p>
                        </div>
                      )}

                    </div>

                    {/* Right: Order items */}
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mb-3">
                        {orderItems.length > 0 ? "Items Ordered" : "No items recorded"}
                      </p>
                      {orderItems.length > 0 ? (
                        <div className="bg-black/20 border border-white/5 rounded-sm overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-white/5">
                                <th className="text-left px-4 py-2 text-[10px] uppercase tracking-widest text-gray-600 font-normal">Item</th>
                                <th className="text-center px-3 py-2 text-[10px] uppercase tracking-widest text-gray-600 font-normal w-12">Qty</th>
                                <th className="text-right px-4 py-2 text-[10px] uppercase tracking-widest text-gray-600 font-normal">Price</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/4">
                              {orderItems.map((item, idx) => (
                                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                  <td className="px-4 py-2.5">
                                    <p className="text-gray-200 font-medium leading-tight">{item.nameEn}</p>
                                    {item.nameFr && item.nameFr !== item.nameEn && (
                                      <p className="text-gray-600 text-xs">{item.nameFr}</p>
                                    )}
                                  </td>
                                  <td className="px-3 py-2.5 text-center">
                                    <span className="inline-flex items-center justify-center w-6 h-6 bg-white/6 border border-white/8 rounded-sm text-xs text-gray-300 font-medium">
                                      {item.quantity}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2.5 text-right text-gray-400 text-xs whitespace-nowrap">
                                    {item.price}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            {order.totalPrice && (
                              <tfoot>
                                <tr className="border-t border-white/8 bg-white/[0.02]">
                                  <td colSpan={2} className="px-4 py-3 text-xs uppercase tracking-widest text-gray-600">Total</td>
                                  <td className="px-4 py-3 text-right font-serif font-semibold text-primary text-base">{order.totalPrice}</td>
                                </tr>
                              </tfoot>
                            )}
                          </table>
                        </div>
                      ) : (
                        <div className="bg-black/10 border border-white/4 rounded-sm px-4 py-6 text-center">
                          <p className="text-xs text-gray-700">No item details saved with this order.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Action buttons — only for pending orders */}
                  {order.status === "pending" && (
                    <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/5">
                      <button
                        disabled={isLoading}
                        onClick={() => updateStatus(order.id, "confirmed")}
                        className="flex items-center gap-1.5 text-xs text-blue-300 hover:text-blue-200 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 px-4 py-2 rounded-sm transition-all font-medium"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Confirm Order
                      </button>
                      <button
                        disabled={isLoading}
                        onClick={() => updateStatus(order.id, "cancelled")}
                        className="flex items-center gap-1.5 text-xs text-red-400/70 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-red-500/15 hover:border-red-500/35 px-4 py-2 rounded-sm transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
