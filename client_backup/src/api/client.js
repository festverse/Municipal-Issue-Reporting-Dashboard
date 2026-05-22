const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const fetchTickets = async (zone_id = '', status = '') => {
  const query = new URLSearchParams();
  if (zone_id) query.append('zone_id', zone_id);
  if (status) query.append('status', status);

  const response = await fetch(`${BASE_URL}/tickets?${query.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch tickets');
  return response.json();
};

export const updateTicketStatus = async (id, new_status, user_id) => {
  const response = await fetch(`${BASE_URL}/tickets/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ new_status, user_id })
  });
  if (!response.ok) throw new Error('Failed to update status');
  return response.json();
};