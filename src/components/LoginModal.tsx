import React from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (e: React.FormEvent) => void;
  username: string;
  setUsername: (user: string) => void;
  password: string;
  setPassword: (pass: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  loginMessage: { text: string; color: string };
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loginMessage
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white rounded-3xl p-6 md:p-8 w-full max-w-[380px] shadow-2xl border border-gray-100"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Acceso Admin</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        <form onSubmit={onLogin} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Nombre de Usuario</label>
            <input 
              type="text"
              autoComplete="off"
              className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[var(--primary)] outline-none transition-all font-semibold text-gray-900"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej.Intranet"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Contraseña</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[var(--primary)] outline-none transition-all font-semibold text-gray-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>
          {loginMessage.text && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-sm font-bold text-center p-3 rounded-xl bg-gray-50 ${loginMessage.color}`}
            >
              {loginMessage.text}
            </motion.p>
          )}
          <button type="submit" className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl font-black text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0">
            Entrar al Panel
          </button>
        </form>
      </motion.div>
    </div>
  );
};
