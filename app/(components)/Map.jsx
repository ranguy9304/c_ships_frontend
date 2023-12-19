"use client";
import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [API_KEY] = useState("MGgeQmWpfgKwCi2QemVf");
  const shipMarkers = useRef({});

  const fetchShipData = async () => {
    try {
      const response = await fetch("http://localhost:8000/getShips");
      const data = await response.json();
      updateShipMarkers(data);
    } catch (error) {
      console.error("Error fetching ship data: ", error);
    }
  };

  const updateShipMarkers = (shipsData) => {
    Object.entries(shipsData).forEach(([shipId, coordinates]) => {
      if (map.current && map.current.isStyleLoaded()) {
        if (shipMarkers.current[shipId]) {
          // Update existing marker position
          shipMarkers.current[shipId].setLngLat([
            coordinates[1],
            coordinates[0],
          ]);
        } else {
          // Create a popup
          const popup = new maplibregl.Popup({
            offset: 25,
            closeOnClick: true,
          })
            .setHTML(`<div style="
            color: #333;
            background-color: ##8bace0;
            border: 1px solid #ccc;
            border-radius: 10px;
            padding: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            font-family: Arial, sans-serif;
          ">
          <h1 style="
              font-weight: bold;
              margin-top: 0;
            ">Ship Name: ${shipId}</h1>
          <p>Latitude: ${coordinates[0]}</p>
          <p>Longitude: ${coordinates[1]}</p>
          <p>People on Board: ${Math.floor(Math.random() * 100)}</p>
          <p>Velocity: ${Math.floor(Math.random() * 30)} knots</p>
        </div>`)
           

          // Create new marker
          const marker = new maplibregl.Marker({
            color: "#eb093e",
            draggable: true,
          })
            .setLngLat([coordinates[1], coordinates[0]])
            .setPopup(popup) // Set the popup on the marker
            .addTo(map.current);

          shipMarkers.current[shipId] = marker;

          // Optional: Add click event listener to the marker if needed
          marker.getElement().addEventListener("click", () => {
            // Code to execute on marker click, if any
          });
        }
      }
    });
  };

  useEffect(() => {
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/ocean/style.json?key=${API_KEY}`,
      center: [72.6136417,22.9949591],
      zoom: 3,
    });

    map.current.on("load", () => {
      fetchShipData();
      const interval = setInterval(fetchShipData, 1000);
      return () => clearInterval(interval);
    });
  }, []); // Empty dependency array to ensure effect runs only once

  return (
    <div className="map-wrap ">
      <div ref={mapContainer} className="map" />
    </div>
  );
};

export default Map;
