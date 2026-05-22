import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// 1. Create a helper component that handles the click event
function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      // e.latlng contains the exact latitude and longitude of the click
      setPosition(e.latlng);
    },
  });

  // If no position is selected yet, render nothing. Otherwise, render the pin.
  return position === null ? null : <Marker position={position} />;
}

export default function TicketForm() {
  // 2. State to hold our form data, including the map coordinates
  const [position, setPosition] = useState(null); // Will hold { lat, lng }
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Center the map locally (e.g., Surat)
  const cityCenter = [21.1702, 72.8311];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 3. Validation: Ensure the user actually dropped a pin
    if (!position) {
      alert("Please click on the map to pinpoint the issue location.");
      return;
    }

    const ticketData = {
      title,
      description,
      latitude: position.lat,
      longitude: position.lng,
      category_id: 1, // Hardcoded for this example
      zone_id: 1,     // Hardcoded for this example
      priority: 'MEDIUM',
      citizen_id: '123e4567-e89b-12d3-a456-426614174000' // Example UUID
    };

    console.log("Submitting to API:", ticketData);
    // Here you would call your POST endpoint:
    // await fetchTickets(ticketData); 
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Report an Issue</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Basic Form Inputs */}
        <input 
          type="text" 
          placeholder="Issue Title (e.g., Large Pothole)" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <textarea 
          placeholder="Detailed description..." 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows="4"
        />

        {/* Map Container */}
        <div>
          <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>
            Click the map to drop a pin:
          </label>
          
          <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc' }}>
            <MapContainer center={cityCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
              
              {/* Inject the helper component into the map */}
              <LocationPicker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
          
          {/* Display the selected coordinates to the user */}
          {position && (
            <p style={{ fontSize: '14px', color: '#555' }}>
              Selected Coordinates: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
            </p>
          )}
        </div>

        <button 
          type="submit" 
          style={{ padding: '10px 20px', background: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}