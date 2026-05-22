import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createTicket } from '../api/client'; 

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position} />;
}

export default function TicketForm() {
  const [position, setPosition] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cityCenter = [21.1702, 72.8311];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) return alert("Please click on the map to pinpoint the issue location.");
    
    setIsSubmitting(true);
    try {
      await createTicket({
        title, description, latitude: position.lat, longitude: position.lng,
        category_id: 1, zone_id: 1, priority: 'MEDIUM', citizen_id: null 
      });
      alert("Success! Your issue has been reported.");
      setTitle(''); setDescription(''); setPosition(null);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Report an Issue</h2>
        <p className="text-gray-500 text-sm mt-1">Help us improve the city infrastructure by pinpointing the problem.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Input Fields */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Issue Title</label>
          <input 
            type="text" 
            placeholder="e.g., Large Pothole on Main St" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Description</label>
          <textarea 
            placeholder="Provide specific details about the issue..." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
          />
        </div>

        {/* Map Section */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700 flex justify-between items-center">
            <span>Location Pin</span>
            {position && (
               <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                 {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
               </span>
            )}
          </label>
          
          <div className="h-[350px] w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner">
            <MapContainer center={cityCenter} zoom={13} className="h-full w-full">
              {/* Upgraded CartoDB Map Tiles */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
              />
              <LocationPicker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-lg transition-colors shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {isSubmitting ? 'Transmitting Data...' : 'Submit Official Report'}
        </button>
      </form>
    </div>
  );
}