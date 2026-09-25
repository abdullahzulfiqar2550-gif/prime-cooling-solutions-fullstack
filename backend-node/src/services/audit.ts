import { supabase } from '../supabase.js';

export const createAuditLog = async (
  actorId: string,
  action: string,
  details: any,
  entityType?: string,
  entityId?: string
): Promise<void> => {
  try {
    await supabase.from('audit_logs').insert({
      actor_id: actorId,
      action,
      details,
      entity_type: entityType,
      entity_id: entityId,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to create audit log', error);
  }
};
