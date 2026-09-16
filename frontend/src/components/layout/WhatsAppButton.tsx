import React from 'react';
import { MessageCircle } from 'lucide-react';
import { COMPANY } from '@/lib/constants';

export function WhatsAppButton() {
  const message = encodeURIComponent("Hello Prime Cooling Solutions! I need AC service support.");
  const url = `https://wa.me/${COMPANY.whatsapp}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300"
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute w-full h-full rounded-full border-2 border-green-500 animate-ping opacity-75"></span>
      </a>
      <div className="absolute right-16 bottom-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-md text-sm shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat with us
      </div>
    </div>
  );
}
