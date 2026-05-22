import { useState, useEffect } from 'react';
import { fetchTickets } from '../api/client'; // Import your API function

export default function Dashboard() {
  // Set up state to hold our database records
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // This hook runs automatically when the Engineer Dashboard loads
  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await fetchTickets();
        setTickets(Array.isArray(data) ? data : data.rows || []);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
        alert("Could not load database records.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTickets();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Engineer Dashboard</h2>
          <p className="text-gray-500 mt-1">Manage and track live civic infrastructure reports.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold">
          Active Tickets: {tickets.length}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold">ID</th>
              <th className="p-4 font-semibold">Issue Title</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Coordinates</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            
            {/* Show a loading state while fetching from the cloud */}
            {isLoading && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">
                  Loading live tickets from database...
                </td>
              </tr>
            )}

            {/* If no tickets exist, tell the user */}
            {!isLoading && tickets.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">
                  No issues reported yet. The city is perfect!
                </td>
              </tr>
            )}

            {/* Map through the live database records and create a row for each */}
            {!isLoading && tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-sm text-gray-500 font-mono">
                  #{ticket.id.substring(0, 6)}...
                </td>
                <td className="p-4 font-medium text-gray-900">{ticket.title}</td>
                <td className="p-4">
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    {ticket.status || 'OPEN'}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500 font-mono">
                  {Number(ticket.latitude).toFixed(4)}, {Number(ticket.longitude).toFixed(4)}
                </td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
            
          </tbody>
        </table>
      </div>
    </div>
  );
}