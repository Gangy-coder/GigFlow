export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const GIG_STATUS = {
  OPEN: 'open',
  ASSIGNED: 'assigned'
};

export const BID_STATUS = {
  PENDING: 'pending',
  HIRED: 'hired',
  REJECTED: 'rejected'
};

export const BID_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  hired: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

export const GIG_STATUS_COLORS = {
  open: 'bg-green-100 text-green-800',
  assigned: 'bg-blue-100 text-blue-800'
};

