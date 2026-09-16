'use client';

import React from 'react';

export default function AdminAuditPage() {
  const mockAuditLogs = [
    { id: '1', user: 'Admin User', action: 'STATUS_UPDATE', entity: 'Booking PCS-8823', date: '2026-09-16 10:15:00', details: 'Status changed from NEW to IN_PROGRESS' },
    { id: '2', user: 'Admin User', action: 'LOGIN', entity: 'System', date: '2026-09-16 09:00:00', details: 'Successful login from IP 192.168.1.1' },
    { id: '3', user: 'System', action: 'BOOKING_CREATE', entity: 'Booking PCS-8825', date: '2026-09-15 14:30:00', details: 'New booking created via website' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">System Audit Log</h2>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="space-y-6">
          {mockAuditLogs.map((log) => (
            <div key={log.id} className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <div className="hidden sm:block mt-1">
                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2"></div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between mb-2 gap-2">
                  <div className="font-medium text-slate-900 dark:text-white text-sm">
                    {log.user} performed <span className="font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-xs">{log.action}</span> on <span className="text-cyan-600 dark:text-cyan-400">{log.entity}</span>
                  </div>
                  <div className="text-xs text-slate-500 whitespace-nowrap font-mono">{log.date}</div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{log.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
