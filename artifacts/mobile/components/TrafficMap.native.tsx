import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export interface MapAlert {
  id: string;
  lat: number;
  lon: number;
  title: string;
  address: string;
  type: string;
}

export interface RouteCoord {
  latitude: number;
  longitude: number;
}

interface Props {
  alerts?: MapAlert[];
  alertColors?: Record<string, string>;
  showRoute?: boolean;
  routeCoords?: RouteCoord[];
  routeColor?: string;
  originColor?: string;
  destinationTitle?: string;
  interactive?: boolean;
}

export function TrafficMap({
  alerts = [],
  alertColors = {},
  showRoute = false,
  routeCoords = [],
  routeColor = "#22C55E",
  originColor = "#FF6B2C",
  destinationTitle = "",
  interactive = false,
}: Props) {
  return (
    <MapView
      style={StyleSheet.absoluteFill}
      initialRegion={{
        latitude: -20.5386,
        longitude: -47.4006,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      }}
      scrollEnabled={interactive}
      zoomEnabled={interactive}
      pitchEnabled={false}
      rotateEnabled={false}
    >
      {alerts.map((alert) => (
        <Marker
          key={alert.id}
          coordinate={{ latitude: alert.lat, longitude: alert.lon }}
          pinColor={alertColors[alert.type] ?? "#FF6B2C"}
          title={alert.title}
          description={alert.address}
        />
      ))}
      {showRoute && routeCoords.length > 0 && (
        <>
          <Marker
            coordinate={{ latitude: -20.5386, longitude: -47.4006 }}
            title="Você está aqui"
            pinColor={originColor}
          />
          <Marker
            coordinate={routeCoords[routeCoords.length - 1]}
            title={destinationTitle}
            pinColor="#22C55E"
          />
          <Polyline
            coordinates={routeCoords}
            strokeColor={routeColor}
            strokeWidth={4}
          />
        </>
      )}
      {!showRoute && (
        <Marker
          coordinate={{ latitude: -20.5386, longitude: -47.4006 }}
          title="Você está aqui"
          pinColor={originColor}
        />
      )}
    </MapView>
  );
}
