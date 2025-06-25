import React, { useState } from 'react';
import { Mail, Lock, User, Github, Linkedin } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="min-h-screen w-full bg-[#101118] flex font-outfit text-white overflow-hidden">
      {/* Left Side: Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="text-left mb-8">
            <img src="/logo.svg" alt="Penta" className="h-10 mb-6" />
            <h1 className="text-4xl font-bold text-white mb-2">{isLoginView ? 'Welcome Back' : 'Create an Account'}</h1>
            <p className="text-gray-400">{isLoginView ? 'Sign in to access your dashboard.' : 'Join us and take control of your finances.'}</p>
          </div>
          
          <form className="space-y-5">
            {!isLoginView && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full bg-[#1a1c2c]/50 rounded-lg py-3.5 pl-12 pr-4 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-[#1a1c2c]/50 rounded-lg py-3.5 pl-12 pr-4 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="password"
                placeholder="Password" 
                className="w-full bg-[#1a1c2c]/50 rounded-lg py-3.5 pl-12 pr-4 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
              />
            </div>
            
            <div className="flex items-center justify-between text-sm pt-2">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[var(--color-primary)] bg-[#1a1c2c] border-gray-700 rounded focus:ring-offset-0 focus:ring-[var(--color-primary)]" />
                <label htmlFor="remember-me" className="ml-3 block text-gray-400">Remember me</label>
              </div>
              {isLoginView && (
                <a href="#" className="font-medium text-[var(--color-primary)] hover:underline">Forgot password?</a>
              )}
            </div>

            <div className='pt-3'>
                <button type="submit" className="w-full bg-[var(--color-primary)] text-black font-bold rounded-lg py-3.5 px-4 hover:bg-green-400 transition-all uppercase tracking-wider">
                {isLoginView ? 'Login' : 'Create Account'}
                </button>
            </div>
            
            <div className="relative flex items-center justify-center pt-3">
                <div className="absolute inset-x-0 h-px bg-gray-800"></div>
                <span className="relative bg-[#101118] px-4 text-sm text-gray-500">OR</span>
            </div>

            <div className="flex gap-4 pt-3">
                <button type="button" className="w-full flex items-center justify-center gap-3 bg-[#1a1c2c]/50 rounded-lg py-3 px-4 border border-gray-800 hover:bg-gray-800/50 transition-all">
                    <Github size={20} />
                    <span className="font-semibold">Github</span>
                </button>
                <button type="button" className="w-full flex items-center justify-center gap-3 bg-[#1a1c2c]/50 rounded-lg py-3 px-4 border border-gray-800 hover:bg-gray-800/50 transition-all">
                    <Linkedin size={20} />
                    <span className="font-semibold">LinkedIn</span>
                </button>
            </div>
          </form>

           <div className="text-center text-sm text-gray-500 mt-10">
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-[var(--color-primary)] hover:underline ml-2">
              {isLoginView ? "Sign Up" : "Login"}
            </button>
          </div>
        </div>
      </div>

      {/* Right Side: Branding */}
      <div className="hidden lg:flex lg:w-[55%] bg-[#1a1c2c] relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#101118] via-[#1a1c2c] to-black"></div>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 z-10 opacity-[0.03]">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
        <div className="z-20 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Unlock Your Financial Potential</h2>
            <p className="text-gray-400 max-w-md">
                Gain insights, track expenses, and visualize your financial data like never before. 
                Penta is the all-in-one solution for smart analytics.
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 