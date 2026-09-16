'use client';

import React from 'react';
import { SERVICES } from '@/lib/constants';
import * as LucideIcons from 'lucide-react';

function DynamicIcon({ name, className }: { name: string, className?: string }) {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  const Icon = icons[name];
  return Icon ? <Icon className={className} /> : <LucideIcons.Check className={className} />;
}

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Manage Services</h2>
        <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-brand-navy font-medium rounded-md transition-colors text-sm">
          Add Service
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Icon</th>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Title</th>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Category</th>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Price</th>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Status</th>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {SERVICES.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-cyan-500">
                      <DynamicIcon name={service.icon} className="w-4 h-4" />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{service.title}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{service.category}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{service.priceText}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-cyan-600 dark:text-cyan-400 font-medium hover:underline cursor-pointer">
                    Edit
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
