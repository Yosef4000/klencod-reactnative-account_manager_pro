export interface Account {
  id?: number;
  provider: string;
  provider_user_id?: string;
  display_name: string;
  email: string;
  photo_url?: string;
  category: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  last_used_at?: string;
}

export interface PlatformLink {
  id?: number;
  account_id: number;
  platform_name: string;
  platform_url?: string;
  local_status: string;
  linked_at?: string;
  notes?: string;
  created_at?: string;
}

export interface AuditLog {
  id?: number;
  action: string;
  details: string;
  timestamp: string;
}
