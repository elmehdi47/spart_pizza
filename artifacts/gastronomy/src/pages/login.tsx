import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated) {
    setLocation("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!r.ok) {
        setError("Incorrect username or password. Please try again.");
        setLoading(false);
        return;
      }
      const data = await r.json() as { token: string; username: string };
      login(data.token, data.username);
      setLocation("/admin");
    } catch {
      setError("Connection error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 20% 80%, rgba(210,105,30,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(210,105,30,0.03) 0%, transparent 50%)"
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <img src="/spart-logo.jpg" alt="Spart" className="h-16 w-16 rounded-full object-cover mb-4 shadow-lg shadow-primary/10" />
          <h1 className="text-2xl font-serif font-bold tracking-widest text-white">SPART</h1>
          <p className="text-xs text-gray-500 tracking-widest uppercase mt-1">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/8 rounded-sm p-8 shadow-2xl">
          <h2 className="text-lg font-serif text-white mb-1">Sign In</h2>
          <p className="text-xs text-gray-500 font-light mb-8">Access the management dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 block mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <Input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  autoFocus
                  className="pl-10 bg-white/[0.04] border-white/10 text-white focus-visible:border-primary focus-visible:ring-0 rounded-sm placeholder:text-gray-700"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-gray-500 block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <Input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="pl-10 pr-10 bg-white/[0.04] border-white/10 text-white focus-visible:border-primary focus-visible:ring-0 rounded-sm placeholder:text-gray-700"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-sm"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-black font-semibold tracking-widest uppercase text-xs py-6 rounded-sm gold-glow mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          SPART Restaurant Management System
        </p>
      </motion.div>
    </div>
  );
}
