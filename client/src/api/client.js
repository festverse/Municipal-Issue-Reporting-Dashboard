// ── API Client ──────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helpers
const getToken = () => localStorage.getItem('token');

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

async function request(url, options = {}) {
  const res = await fetch(url, { ...options, headers: { ...getHeaders(), ...options.headers } });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = data?.error || data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

// ── Auth ──
export const registerUser = (body) =>
  request(`${BASE_URL}/auth/register`, { method: 'POST', body: JSON.stringify(body) });

export const loginUser = (body) =>
  request(`${BASE_URL}/auth/login`, { method: 'POST', body: JSON.stringify(body) });

export const getProfile = () =>
  request(`${BASE_URL}/auth/me`);

export const updateProfileAPI = (body) =>
  request(`${BASE_URL}/auth/me`, { method: 'PATCH', body: JSON.stringify(body) });

// ── Tickets ──
export const createTicket = (body) =>
  request(`${BASE_URL}/tickets`, { method: 'POST', body: JSON.stringify(body) });

export const fetchTickets = (filters = {}) => {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, v);
  });
  return request(`${BASE_URL}/tickets?${query.toString()}`);
};

export const fetchTicketById = (id) =>
  request(`${BASE_URL}/tickets/${id}`);

export const updateTicketStatus = (id, new_status, note = '') =>
  request(`${BASE_URL}/tickets/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ new_status, note }),
  });

// ── AI & Community ──
export const analyzeIssueAI = (title, description) =>
  request(`${BASE_URL}/tickets/analyze`, { method: 'POST', body: JSON.stringify({ title, description }) });

export const generateAINote = (ticket_title, old_status, new_status) =>
  request(`${BASE_URL}/tickets/ai-note`, { method: 'POST', body: JSON.stringify({ ticket_title, old_status, new_status }) });

export const toggleUpvoteTicket = (id) =>
  request(`${BASE_URL}/tickets/${id}/upvote`, { method: 'POST' });

export const addTicketComment = (id, comment) =>
  request(`${BASE_URL}/tickets/${id}/comments`, { method: 'POST', body: JSON.stringify({ comment }) });

export const fetchTicketComments = (id) =>
  request(`${BASE_URL}/tickets/${id}/comments`);

// ── Reference Data ──
export const fetchZones = () => request(`${BASE_URL}/zones`);
export const fetchCategories = () => request(`${BASE_URL}/categories`);

// ── Analytics ──
export const fetchAnalyticsSummary = () => request(`${BASE_URL}/analytics/summary`).then(res => {
  if (res && res.data) {
    const data = res.data;
    const stats = {
      total: data.totalTickets || 0,
      open: 0,
      in_progress: 0,
      resolved: 0,
      avgResolutionHours: data.avgResolutionHours || null
    };
    if (Array.isArray(data.byStatus)) {
      data.byStatus.forEach(item => {
        if (item.status === 'OPEN') stats.open = parseInt(item.count, 10);
        if (item.status === 'IN_PROGRESS') stats.in_progress = parseInt(item.count, 10);
        if (item.status === 'RESOLVED') stats.resolved = parseInt(item.count, 10);
      });
    }
    return stats;
  }
  return { total: 0, open: 0, in_progress: 0, resolved: 0, avgResolutionHours: null };
});

export const fetchAnalyticsByZone = () => request(`${BASE_URL}/analytics/by-zone`);
export const fetchAnalyticsByStatus = () => request(`${BASE_URL}/analytics/by-status`);
export const fetchRecentActivity = () => request(`${BASE_URL}/analytics/recent-activity`).then(res => {
  if (res && res.data) {
    return {
      activities: res.data.map(a => ({
        ...a,
        user_name: a.performed_by
      }))
    };
  }
  return { activities: [] };
});

// ── Utilities ──
export function timeAgo(dateString) {
  if (!dateString) return '';
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 0) return 'just now';
  const intervals = [
    { label: 'y', seconds: 31536000 },
    { label: 'mo', seconds: 2592000 },
    { label: 'w', seconds: 604800 },
    { label: 'd', seconds: 86400 },
    { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
  ];
  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1) return `${count}${i.label} ago`;
  }
  return 'just now';
}