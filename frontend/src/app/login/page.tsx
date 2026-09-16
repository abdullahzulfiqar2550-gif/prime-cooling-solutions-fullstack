'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    localStorage.setItem('pcs_token', 'mock_admin_token');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Image src="/logo.png" alt="Logo" width={60} height={60} className="mx-auto rounded-lg shadow-sm mb-4" />
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Portal</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Authorized personnel only</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl border border-slate-200 dark:border-slate-800 sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand-navy bg-cyan-500 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
              >
                <Lock className="w-4 h-4 mr-2" /> Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
