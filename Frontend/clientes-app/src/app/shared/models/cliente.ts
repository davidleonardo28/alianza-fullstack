export interface Cliente {
  sharedKey: string;
  businessId: string;
  email: string;
  phone: string;
  createdAt: string;
}
export interface ClienteRequest {
  sharedKey: string;
  businessId: string;
  email: string;
  phone: string;
}
export interface AdvancedSearchRequest {
  sharedKeyContains?: string;
  emailContains?: string;
  businessIdEquals?: string;
  createdFrom?: string; // YYYY-MM-DD
  createdTo?: string;
}
