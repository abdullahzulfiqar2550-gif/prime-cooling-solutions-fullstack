'use client';

import React from 'react';

export default function AdminContactsPage() {
  const mockContacts = [
    { id: '1', name: 'Faizan', phone: '0321-1122334', subject: 'Inquiry about AMC', date: '2026-09-15', status: 'NEW' },
    { id: '2', name: 'Sara', phone: '0300-9988776', subject: 'Emergency Repair', date: '2026-09-14', status: 'REPLIED' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Contact Messages</h2>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Date</th>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Name</th>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Phone</th>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Subject</th>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Status</th>
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {mockContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">{contact.date}</td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{contact.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">{contact.phone}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{contact.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      contact.status === 'NEW' ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
                      'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                    }`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-cyan-600 dark:text-cyan-400 font-medium hover:underline cursor-pointer">
                    View
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
