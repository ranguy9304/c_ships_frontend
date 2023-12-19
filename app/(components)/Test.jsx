"use client"
import React, { useRef, useEffect , useState} from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [API_KEY] = useState("MGgeQmWpfgKwCi2QemVf");
  const shipMarkers = useRef({});

  useEffect(() => {
    if (!map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/ocean/style.json?key=${API_KEY}`,
        center: [72.6136417, 22.9949591],
        zoom: 3,
      });
    }

    const ws = new WebSocket('ws://localhost:8000/ws');
    ws.onmessage = (event) => {
      const shipData = JSON.parse(event.data);
      updateShipMarker(shipData);
    };

    return () => {
      ws.close();
    };
  }, []);

  const updateShipMarker = (ship) => {
    const { id, lat, lon } = ship;
    if (map.current && map.current.isStyleLoaded()) {
      if (shipMarkers.current[id]) {
        console.log("moving " + id ,map.current + " to " + lat, lon);
        // Update existing marker position
        shipMarkers.current[id].setLngLat([lon, lat]);
      } else {
        // Create a new marker
        const popup = new maplibregl.Popup({
          offset: 25,
          closeOnClick: true,
        })
          .setHTML(`<div style="color: #333; background-color: #8bace0; border: 1px solid #ccc; border-radius: 10px; padding: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); font-family: Arial, sans-serif;">
            <h1 style="font-weight: bold; margin-top: 0;">Ship ID: ${id}</h1>
            <p>Latitude: ${lat}</p>
            <p>Longitude: ${lon}</p>
          </div>`);

        const marker = new maplibregl.Marker({ color: "#eb093e", draggable: true })
          .setLngLat([lon, lat])
          .setPopup(popup) // Set the popup on the marker
          .addTo(map.current);

        shipMarkers.current[id] = marker;
      }
    }
  };

  return (
    <div className="map-wrap ">
      <div ref={mapContainer} className="map" />
    </div>
  );
};

export default Map;
