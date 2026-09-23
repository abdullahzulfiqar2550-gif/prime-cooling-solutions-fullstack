'use client';

import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ── Types ──────────────────────────────────────────────────────────
interface ServiceRow {
  id: number;
  slug: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  tier: string;
  price_text: string;
  status: string;
  sort_order: number;
}

const EMPTY_FORM: Omit<ServiceRow, 'id'> = {
  slug: '',
  title: '',
  category: 'General',
  icon: 'Wrench',
  description: '',
  tier: 'Standard',
  price_text: '',
  status: 'Active',
  sort_order: 0,
};

const CATEGORIES = ['General', 'Maintenance', 'Installation', 'Repair', 'Contract', 'Appliance'];
const TIERS = ['Basic', 'Standard', 'Premium'];
const ICON_OPTIONS = [
  'Search', 'Wrench', 'Hammer', 'PackageMinus', 'Droplets', 'Settings',
  'Gauge', 'Pipette', 'Zap', 'ShieldCheck', 'FileCheck', 'GlassWater',
  'Refrigerator', 'Fan', 'Thermometer', 'Wind', 'Check',
];

// ── Dynamic Icon ───────────────────────────────────────────────────
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  const Icon = icons[name];
  return Icon ? <Icon className={className} /> : <LucideIcons.Check className={className} />;
}

// ── Main Page ──────────────────────────────────────────────────────
export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // ── Fetch services from Supabase ─────────────────────────────────
  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      console.error('Error fetching services:', error);
    } else {
      setServices((data as ServiceRow[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ── Open modal for Add ───────────────────────────────────────────
  const handleAddClick = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, sort_order: services.length + 1 });
    setModalOpen(true);
  };

  // ── Open modal for Edit ──────────────────────────────────────────
  const handleEditClick = (service: ServiceRow) => {
    setEditing(service);
    setForm({
      slug: service.slug,
      title: service.title,
      category: service.category,
      icon: service.icon,
      description: service.description,
      tier: service.tier,
      price_text: service.price_text,
      status: service.status,
      sort_order: service.sort_order,
    });
    setModalOpen(true);
  };

  // ── Close modal ──────────────────────────────────────────────────
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  // ── Auto-generate slug from title ────────────────────────────────
  const handleTitleChange = (value: string) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm(prev => ({ ...prev, title: value, slug }));
  };

  // ── Save (Create or Update) ──────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price_text) {
      alert('Title and Price are required.');
      return;
    }
    setSaving(true);

    try {
      if (editing) {
        // Update existing
        const { error } = await supabase
          .from('services')
          .update({
            slug: form.slug,
            title: form.title,
            category: form.category,
            icon: form.icon,
            description: form.description,
            tier: form.tier,
            price_text: form.price_text,
            status: form.status,
            sort_order: form.sort_order,
          })
          .eq('id', editing.id);
        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase.from('services').insert({
          slug: form.slug,
          title: form.title,
          category: form.category,
          icon: form.icon,
          description: form.description,
          tier: form.tier,
          price_text: form.price_text,
          status: form.status,
          sort_order: form.sort_order,
        });
        if (error) throw error;
      }

      handleCloseModal();
      await fetchServices();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert(`Error saving service: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      setDeleteConfirm(null);
      await fetchServices();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert(`Error deleting service: ${message}`);
    }
  };

  // ── Toggle status ────────────────────────────────────────────────
  const handleToggleStatus = async (service: ServiceRow) => {
    const newStatus = service.status === 'Active' ? 'Inactive' : 'Active';
    await supabase.from('services').update({ status: newStatus }).eq('id', service.id);
    await fetchServices();
  };

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Manage Services</h2>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-brand-navy font-medium rounded-md transition-colors text-sm flex items-center gap-2"
        >
          <LucideIcons.Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Table */}
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
                <th className="px-6 py-4 font-medium text-slate-900 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <LucideIcons.Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />Loading services...
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No services found. Click &quot;Add Service&quot; to create one.</td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-cyan-500">
                        <DynamicIcon name={service.icon} className="w-4 h-4" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{service.title}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{service.category}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{service.price_text}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(service)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-medium border cursor-pointer transition-colors ${
                          service.status === 'Active'
                            ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 hover:bg-red-200'
                        }`}
                      >
                        {service.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEditClick(service)}
                          className="text-cyan-600 dark:text-cyan-400 font-medium hover:underline cursor-pointer text-sm"
                        >
                          Edit
                        </button>
                        {deleteConfirm === service.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(service.id)}
                              className="text-red-600 text-xs font-medium hover:underline"
                            >
                              Confirm
                            </button>
                            <span className="text-slate-400">|</span>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-slate-500 text-xs font-medium hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(service.id)}
                            className="text-red-500 hover:text-red-600 font-medium text-sm hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add/Edit Modal ──────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {editing ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <LucideIcons.X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. General AC Service"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-slate-400">Slug: {form.slug || '—'}</p>
              </div>

              {/* Category + Tier */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tier</label>
                  <select
                    value={form.tier}
                    onChange={(e) => setForm(prev => ({ ...prev, tier: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  >
                    {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Icon + Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Icon</label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-cyan-500 shrink-0">
                      <DynamicIcon name={form.icon} className="w-5 h-5" />
                    </div>
                    <select
                      value={form.icon}
                      onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    >
                      {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price *</label>
                  <input
                    type="text"
                    required
                    value={form.price_text}
                    onChange={(e) => setForm(prev => ({ ...prev, price_text: e.target.value }))}
                    placeholder="e.g. Rs. 2,000 – 2,500 or Quote-based"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="Brief description of the service"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              {/* Status + Sort Order */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sort Order</label>
                  <input
                    type="number"
                    min={0}
                    value={form.sort_order}
                    onChange={(e) => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-brand-navy font-bold rounded-md transition-colors text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <><LucideIcons.Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  ) : (
                    <><LucideIcons.Check className="w-4 h-4" /> {editing ? 'Update Service' : 'Create Service'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
