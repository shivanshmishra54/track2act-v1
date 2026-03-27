import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"
import { ArrowLeft, Clock, MapPin, Navigation, Truck, AlertOctagon, Info, Phone } from "lucide-react"
import { useCustomerShipments } from "./hooks/useCustomerShipments"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"

// Ensure marker icons display correctly in React Leaflet
const truckIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: "hue-rotate-180 brightness-110", // Tint it blue/cyan for aesthetics
})
const endIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "hue-rotate-90 saturate-200" // Mint Green
})

export default function TrackingHub() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { shipments, loading } = useCustomerShipments()
  
  const shipment = id ? shipments.find(s => s.id === id || s.trackingNumber === id) : shipments[0]

  if (loading) {
     return <div className="h-full w-full flex items-center justify-center min-h-[500px]"><span className="animate-pulse font-mono tracking-widest text-primary">INITIALIZING GNSS LINK...</span></div>
  }

  if (!shipment && shipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <AlertOctagon className="h-16 w-16 mb-4 text-destructive/50" />
        <h2 className="text-2xl font-bold">No Records Found</h2>
        <p className="text-muted-foreground mt-2 max-w-md text-center">You have no active shipments to track. Return to the overview.</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-6">Go Back</Button>
      </div>
    )
  }

  if (!shipment && id) {
     return (
      <div className="flex flex-col items-center justify-center p-12 lg:p-24 border border-destructive/30 rounded-3xl m-6 lg:m-12 bg-destructive/5">
        <h2 className="text-2xl font-bold text-destructive mb-2">Unauthorized Tracking ID</h2>
        <p className="text-muted-foreground">The ID `{id}` either doesn't exist or belongs to an external account.</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-6 bg-destructive text-destructive-foreground hover:bg-destructive/90">Return Safely</Button>
      </div>
     )
  }

  const s = shipment || shipments[0]
  
  // Real-time Check
  const isDelayed = s.status === 'DELAYED' || s.status === 'AT_RISK'
  const isComplete = s.status === 'DELIVERED'
  const isPending = s.status === 'PENDING'

  // Extract valid coords
  // Real production should provide s.originLat / s.originLng. If missing, fallback to current or arbitrary points
  const currentPos = (s.currentLatitude && s.currentLongitude) ? [s.currentLatitude, s.currentLongitude] : [40.7128, -74.0060]
  const destPos = [currentPos[0] + 0.05, currentPos[1] + 0.05] // Mock destination slightly offset if no actual DB dest coords exist

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-background">
      
      {/* 30% Right Panel (Moves to bottom sheet on mobile) */}
      <div className="order-2 lg:order-1 w-full lg:w-[400px] xl:w-[450px] border-r border-border/60 bg-card h-full flex flex-col z-20 shadow-2xl shrink-0 overflow-y-auto relative">
        <div className="p-6 pb-0 sticky top-0 bg-card/95 backdrop-blur z-10 border-b border-border/40 pb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="mb-4 text-muted-foreground hover:text-foreground -ml-3">
             <ArrowLeft className="w-4 h-4 mr-2" /> Overview
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest mb-1">Tracking UUID</p>
              <h1 className="text-2xl font-black font-mono tracking-tighter text-primary">{s.trackingNumber}</h1>
            </div>
            <StatusBadge status={s.status} />
          </div>
        </div>

        {isDelayed && (
          <div className="mx-6 mt-6 bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex items-start gap-3">
             <AlertOctagon className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
             <div>
                <h4 className="font-bold text-destructive text-sm">Action Required</h4>
                <p className="text-xs text-destructive/80 mt-1">This shipment is experiencing delays. Our support team is ready to assist.</p>
                <Button variant="outline" size="sm" className="mt-3 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground h-8"
                  onClick={() => navigate('/dashboard/support', { state: { autoFillShipmentId: s.id }})}
                >
                  Contact Support
                </Button>
             </div>
          </div>
        )}

        {isPending && (
          <div className="mx-6 mt-6 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-500/80">Awaiting driver assignment. Tracking telemetry will activate automatically once moving.</p>
          </div>
        )}

        <div className="p-6 space-y-8 flex-1">
          {/* Timeline Nodes */}
          <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-6 before:w-[2px] before:bg-border/60">
            
            <div className="relative">
              <div className="absolute -left-[30px] p-1 bg-card rounded-full ring-2 ring-primary ring-offset-2 ring-offset-card">
                 <Package className="w-3 h-3 text-primary" />
              </div>
              <h3 className="font-bold text-sm">Dispatched from Logistics</h3>
              <p className="text-xs text-muted-foreground mt-1 tracking-wide">{s.originName}</p>
            </div>

            <div className="relative">
              <div className={`absolute -left-[30px] p-1 bg-card rounded-full ring-2 ${s.currentProgress > 0 ? 'ring-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]' : 'ring-border'} ring-offset-2 ring-offset-card`}>
                 <Truck className={`w-3 h-3 ${s.currentProgress > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <h3 className={`font-bold text-sm ${s.currentProgress > 0 ? '' : 'text-muted-foreground'}`}>In Transit</h3>
              <p className="text-xs text-muted-foreground mt-1">
                 {s.currentProgress > 0 ? 'Driver en route. Telemetry link established.' : 'Awaiting departure...'}
              </p>
            </div>

            <div className="relative">
              <div className={`absolute -left-[30px] p-1 bg-card rounded-full ring-2 ${isComplete ? 'ring-success' : 'ring-border'} ring-offset-2 ring-offset-card`}>
                 <MapPin className={`w-3 h-3 ${isComplete ? 'text-success' : 'text-muted-foreground'}`} />
              </div>
              <h3 className={`font-bold text-sm flex items-center gap-2 ${isComplete ? 'text-success' : 'text-muted-foreground'}`}>
                 Arrival
                 {s.currentProgress > 0 && !isComplete && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">ETA {new Date(s.estimatedArrival).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{s.destinationName}</p>
            </div>
          </div>
        </div>

        {/* Global Support Button locked to bottom */}
        <div className="p-6 border-t border-border/40 bg-card/50">
           <Button onClick={() => navigate('/dashboard/support', { state: { autoFillShipmentId: s.id }})} variant="secondary" className="w-full justify-between group h-12">
             <span className="flex items-center"><Phone className="w-4 h-4 mr-2" /> Secure Help Desk</span>
             <ArrowLeft className="w-4 h-4 rotate-180 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
           </Button>
        </div>
      </div>

      {/* 70% Map Panel (Top on Mobile) */}
      <div className="order-1 lg:order-2 flex-1 relative bg-secondary/20 h-[50vh] lg:h-full z-0 overflow-hidden">
        {/* Timestamp Overlay */}
        <div className="absolute top-4 right-4 z-[400] bg-background/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-primary/20 flex flex-col items-end">
           <div className="flex items-center gap-2 text-xs font-bold font-mono tracking-widest text-primary/80">
             <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
             </span>
             GNSS ACTIVE
           </div>
           <span className="text-[10px] text-muted-foreground mt-1">LAST PING {new Date().toLocaleTimeString()}</span>
        </div>

        <MapContainer 
          center={currentPos} 
          zoom={12} 
          scrollWheelZoom={true} 
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          <Marker position={currentPos} icon={truckIcon}>
            <Popup className="bg-background border-primary">
              <div className="font-mono text-xs font-bold">VEHICLE {s.assignedDriverName || "SYS-1"}</div>
              <div className="text-[10px] text-muted-foreground">LAT {currentPos[0].toFixed(4)} LNG {currentPos[1].toFixed(4)}</div>
            </Popup>
          </Marker>
          <Marker position={destPos} icon={endIcon}>
            <Popup>
              <strong>Destination Checkpoint</strong>
            </Popup>
          </Marker>
          <Polyline positions={[currentPos, destPos]} pathOptions={{ color: 'hsl(var(--primary))', weight: 4, dashArray: '10, 10', opacity: 0.5 }} />
        </MapContainer>
      </div>

    </div>
  )
}
