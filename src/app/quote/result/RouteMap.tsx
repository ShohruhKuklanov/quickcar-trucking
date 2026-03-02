"use client";

import { useEffect, useMemo, useRef } from "react";
import type { LatLngExpression, Map as LeafletMap, LayerGroup, Polyline } from "leaflet";

type Coord = { lat: number; lon: number };

type LeafletModule = typeof import("leaflet");
type LeafletModuleWithDefault = LeafletModule & { default?: LeafletModule };

type RouteApiResponse =
  | { coordinates: Array<[number, number]> }
  | { error: string; code?: string };

function isValidCoord(c: Coord | null | undefined): c is Coord {
  return !!c && Number.isFinite(c.lat) && Number.isFinite(c.lon);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function RouteMap({
  from,
  to,
}: {
  from: Coord | null;
  to: Coord | null;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const routeRef = useRef<Polyline | null>(null);
  const rafRef = useRef<number | null>(null);

  const points = useMemo(() => {
    if (!isValidCoord(from) || !isValidCoord(to)) return null;
    const a: LatLngExpression = [from.lat, from.lon];
    const b: LatLngExpression = [to.lat, to.lon];
    return { a, b };
  }, [from, to]);

  useEffect(() => {
    let cancelled = false;

    const container = containerRef.current;
    if (!container) return;

    (async () => {
      if (typeof window === "undefined") return;

      const leafletModule = (await import("leaflet")) as LeafletModuleWithDefault;
      const L: LeafletModule = leafletModule.default ?? leafletModule;

      if (cancelled) return;

      if (!mapRef.current) {
        mapRef.current = L.map(container, {
          zoomControl: true,
          attributionControl: false,
          scrollWheelZoom: false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
        }).addTo(mapRef.current);

        layerRef.current = L.layerGroup().addTo(mapRef.current);
      }

      const map = mapRef.current;
      const layer = layerRef.current;
      if (!map || !layer) return;

      layer.clearLayers();
      routeRef.current = null;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (!points) {
        map.setView([39.5, -98.35], 4);
        return;
      }

      const { a, b } = points;

      const aLL = L.latLng(a);
      const bLL = L.latLng(b);

      const markerStyle = {
        radius: 7,
        color: "var(--primary)",
        fillColor: "var(--primary)",
        fillOpacity: 0.9,
        weight: 2,
      } as const;

      L.circleMarker(aLL, markerStyle).addTo(layer);
      L.circleMarker(bLL, markerStyle).addTo(layer);

      let latlngs: Array<import("leaflet").LatLng> = [];

      try {
        const routeUrl = new URL("/api/route", window.location.origin);
        routeUrl.searchParams.set("fromLat", String(aLL.lat));
        routeUrl.searchParams.set("fromLon", String(aLL.lng));
        routeUrl.searchParams.set("toLat", String(bLL.lat));
        routeUrl.searchParams.set("toLon", String(bLL.lng));

        const routeRes = await fetch(routeUrl.toString());
        const routeData = (await routeRes.json().catch(() => null)) as RouteApiResponse | null;

        const coords = (routeData && "coordinates" in routeData && routeData.coordinates) || null;
        if (routeRes.ok && coords && coords.length >= 2) {
          latlngs = coords.map(([lon, lat]) => L.latLng(lat, lon));
        }
      } catch {
        // ignore
      }

      if (latlngs.length < 2) {
        const steps = 90;
        latlngs = Array.from({ length: steps }, (_, i) => {
          const t = i / (steps - 1);
          return L.latLng(lerp(aLL.lat, bLL.lat, t), lerp(aLL.lng, bLL.lng, t));
        });
      }

      const route = L.polyline([latlngs[0]], {
        color: "var(--primary)",
        weight: 4,
        opacity: 0.9,
      }).addTo(layer);
      routeRef.current = route;

      map.fitBounds(L.latLngBounds(latlngs), { padding: [24, 24] });

      let start: number | null = null;
      const durationMs = 900;

      const tick = (ts: number) => {
        if (start === null) start = ts;
        const elapsed = ts - start;
        const t = Math.min(1, elapsed / durationMs);
        const count = Math.max(2, Math.floor(1 + t * (latlngs.length - 1)));
        route.setLatLngs(latlngs.slice(0, count));

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    })();

    return () => {
      cancelled = true;
    };
  }, [points]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className="h-72 w-full overflow-hidden rounded-2xl border border-foreground/10" />;
}
