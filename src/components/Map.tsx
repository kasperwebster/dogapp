import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { Incident } from '../types';

// Fix for default marker icon in Leaflet with React
const icon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter: [number, number] = [52.2297, 21.0122]; // Warsaw coordinates

interface MapProps {
  incidents?: Incident[];
  onMapClick?: (e: { latlng: { lat: number; lng: number } }) => void;
  center?: [number, number];
}

// Component to handle map center changes
function MapCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

// Component to handle map clicks
function MapEvents({ onClick }: { onClick?: MapProps['onMapClick'] }) {
  useMapEvents({
    click: onClick,
  });
  return null;
}

const Map = ({ incidents = [], onMapClick, center = defaultCenter }: MapProps) => {
  return (
    <MapContainer
      center={center}
      zoom={12}
      style={containerStyle}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapCenter center={center} />
      <MapEvents onClick={onMapClick} />
      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={{ lat: incident.latitude, lng: incident.longitude }}
          icon={icon}
        >
          <Popup>
            <div>
              <strong>Date:</strong> {incident.date}<br />
              <strong>Time:</strong> {incident.time}<br />
              <strong>Description:</strong> {incident.description}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map; 