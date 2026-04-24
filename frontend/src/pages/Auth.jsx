import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Wallet, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.success) navigate('/');
        else setError(result.error);
      } else {
        const result = await register(name, email, password);
        if (result.success) {
          setIsLogin(true);
          setError('Registration successful! Please login.');
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-[#0d0d0d] flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-700">
      <motion.div 
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px] pointer-events-none"
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary dark:bg-black rounded-2xl flex items-center justify-center mb-4 shadow-2xl dark:shadow-neon-blue/20 border border-white/10 dark:border-neon-blue/30">
            <Wallet className="text-white dark:text-neon-blue w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-primary dark:text-white tracking-tighter">Clear Ledger</h1>
          <p className="text-primary/60 dark:text-white/60 font-bold uppercase tracking-widest text-[10px] mt-2">
            The Standard of Clarity
          </p>
        </div>

        <Card className="p-8 dark:bg-[#121212] dark:border-white/10 dark:neon-glow-blue border-white/5">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-8">
            {isLogin ? 'Login' : 'Register'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key="name-field"
                >
                  <Input
                    label="Name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-neon-red font-medium bg-neon-red/10 p-3 rounded-lg border border-neon-red/20">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="neon-green"
              className="w-full h-12"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
              {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-secondary dark:text-neon-blue hover:underline"
            >
              {isLogin ? "Need an account? Register" : 'Already have an account? Login'}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
