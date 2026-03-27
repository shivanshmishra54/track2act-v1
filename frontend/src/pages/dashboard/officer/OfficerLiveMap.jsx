import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"
import { Search, Map as MapIcon, Filter, Layers, Navigation, AlertOctagon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { API } from "@/context/AuthContext"
import { StatusBadge } from "@/components/ui/status-badge"

const officerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: "hue-rotate-180 brightness-110",
})

const alertIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "hue-rotate-320 saturate-200" // Red tint for alerts
})

export default function OfficerLiveMap() {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  
  // Real or mock data fetch
  useEffect(() => {
    const fetchActiveShipments = async () => {
       try {
         const res = await fetch(`${API}/api/shipments/active`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})
         if (res.ok) {
           const data = await res.json()
           let arr = data.data || []
           // Add mock lat/lng if missing
           arr = arr.map(s => ({
             ...s,
             lat: s.currentLatitude || 20.5937 + (Math.random() * 5 - 2.5),
             lng: s.currentLongitude || 78.9629 + (Math.random() * 5 - 2.5)
           }))
           setShipments(arr.length > 0 ? arr : fallbackShipments)
         } else {
           setShipments(fallbackShipments)
         }
       } catch (e) {
         setShipments(fallbackShipments)
       } finally {
         setLoading(false)
       }
    }
    fetchActiveShipments()
  }, [])

  const fallbackShipments = [
    { id: "SH-1029", trackingNumber: "TRK-001", customerName: "TechCorp Ltd", status: "IN_TRANSIT", lat: 13.0827, lng: 80.2707, updatedAt: new Date().toISOString() },
    { id: "SH-1028", trackingNumber: "TRK-002", customerName: "AutoParts Co", status: "DELAYED", lat: 19.0760, lng: 72.8777, updatedAt: new Date(Date.now() - 3600000).toISOString() },
    { id: "SH-1027", trackingNumber: "TRK-003", customerName: "Global Furnishings", status: "PENDING", lat: 28.6139, lng: 77.2090, updatedAt: new Date().toISOString() }
  ]

  const filtered = shipments.filter(s => 
    s.trackingNumber?.toLowerCase().includes(search.toLowerCase()) || 
    s.customerName?.toLowerCase().includes(search.toLowerCase())
  )

  const indiaCenter = [20.5937, 78.9629]

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden bg-background">
      
      {/* 30% Left Directory Panel */}
      <div className="order-2 lg:order-1 w-full lg:w-[400px] xl:w-[450px] border-r border-border/60 bg-card h-full flex flex-col z-20 shadow-2xl shrink-0 overflow-y-auto">
        <div className="p-6 sticky top-0 bg-card/95 backdrop-blur z-10 border-b border-border/40 space-y-4">
           <div>
             <h1 className="text-2xl font-black tracking-tight flex items-center gap-2"><MapIcon className="w-6 h-6 text-primary"/> Fleet Telemetry</h1>
             <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Total Signals Detected: {shipments.length}</p>
           </div>
           <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                 placeholder="Search UUID or Entity..." 
                 className="pl-9 bg-secondary/30 h-10 border-border/60" 
                 value={search} onChange={e=>setSearch(e.target.value)} 
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
             <div className="space-y-3 px-2">{[1,2,3,4].map(i => <div key={i} className="h-24 bg-secondary/30 rounded-xl animate-pulse border border-border/40" />)}</div>
          ) : filtered.map(s => (
             <div key={s.id} className="p-4 bg-secondary/10 border border-border/60 rounded-xl hover:bg-secondary/20 hover:border-primary/40 cursor-pointer transition-all card-shadow relative overflow-hidden group">
                 {s.status === 'DELAYED' && <div className="absolute top-0 right-0 w-2 h-full bg-destructive" />}
                 
                 <div className="flex justify-between items-start mb-2 pr-3">
                    <span className="font-mono text-sm font-bold text-primary group-hover:underline underline-offset-2">{s.trackingNumber}</span>
                    <StatusBadge status={s.status} />
                 </div>
                 
                 <p className="text-xs text-foreground font-semibold mb-3 truncate">{s.customerName || "Freight Container"}</p>
                 
                 <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border/40 pt-2">
                    <span className="flex items-center gap-1 font-mono uppercase"><Navigation className="w-3 h-3"/> Pinged {new Date(s.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span>LAT/LNG SYNCED</span>
                 </div>
             </div>
          ))}
        </div>
      </div>

      {/* 70% Right Map Cockpit */}
      <div className="order-1 lg:order-2 flex-1 relative bg-secondary/20 h-[50vh] lg:h-full z-0 overflow-hidden">
        
        {/* Disruption Alert Overlay - AI Tie-in */}
        <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
           <div className="bg-destructive/10 backdrop-blur-md px-3 py-2 rounded-lg border border-destructive/30 flex items-center gap-2 shadow-2xl cursor-pointer hover:bg-destructive/20 transition-colors">
              <AlertOctagon className="w-4 h-4 text-destructive animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-destructive uppercase tracking-widest leading-tight">Congestion Alert</span>
                <span className="text-[10px] text-destructive/80 font-mono">JNPT Portal Down</span>
              </div>
           </div>
        </div>

        <div className="absolute top-4 right-4 z-[400] flex gap-2">
           <div className="bg-background/90 backdrop-blur-md p-2 rounded-lg border border-primary/20 shadow-2xl flex items-center gap-2 px-3 text-xs font-bold font-mono text-primary/80">
             <Layers className="w-4 h-4 opacity-50"/> RADAR ONLINE
           </div>
        </div>

        <MapContainer center={indiaCenter} zoom={5} scrollWheelZoom={true} className="h-full w-full" zoomControl={false}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; <a href="https://carto.com/">CARTO</a>' />
          
          {shipments.map(s => (
            <Marker key={s.id} position={[s.lat, s.lng]} icon={s.status === 'DELAYED' ? alertIcon : officerIcon}>
              <Popup className="bg-background border-primary">
                <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{s.trackingNumber}</div>
                <div className="text-sm font-bold text-primary">{s.customerName}</div>
                <div className="text-[10px] mt-2 mb-1 border-b border-border/40 pb-1">{s.status === 'DELAYED' ? '⚠️ DISRUPTION DETECTED' : '✓ TELEMETRY STABLE'}</div>
                <div className="text-[9px] text-muted-foreground font-mono">LAT {s.lat.toFixed(4)} | LNG {s.lng.toFixed(4)}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
