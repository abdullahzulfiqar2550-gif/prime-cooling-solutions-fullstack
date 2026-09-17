'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ContactRow {
  id: number;
  full_name: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  [key: string]: unknown;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (data) setContacts(data as ContactRow[]);
    setFetched(true);
  };

  const updateStatus = async (id: number, newStatus: string) => {
    await supabase.from('contacts').update({ status: newStatus }).eq('id', id);
    fetchContacts();
  };

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
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{contact.full_name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">{contact.phone}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{contact.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      contact.status === 'NEW' ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' :
                      'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                    }`}>
                      {contact.status || 'NEW'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <select 
                      value={contact.status || 'NEW'} 
                      onChange={(e) => updateStatus(contact.id, e.target.value)}
                      className="text-xs border border-slate-300 dark:border-slate-700 rounded px-2 py-1 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    >
                      <option value="NEW">NEW</option>
                      <option value="REPLIED">REPLIED</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </td>
                </tr>
              ))}
              {contacts.length === 0 && fetched && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No contacts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
