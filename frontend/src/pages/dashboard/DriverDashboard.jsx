import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { useAuth, API } from "../../context/AuthContext"
import { MapPin, Navigation, Package, AlertCircle, Users, Truck, CheckCircle2, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"


export default function DriverDashboard() {
  const { user } = useAuth()
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [sharingLocation, setSharingLocation] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [selectedShipment, setSelectedShipment] = useState(null)

  useEffect(() => {
    fetchAssignedShipments()
  }, [user])

  const fetchAssignedShipments = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/shipments/driver/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setShipments(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch shipments:", error)
    } finally {
      setLoading(false)
    }
  }

  const startLiveLocation = async () => {
    setSharingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setCurrentLocation({ latitude, longitude })

          if (selectedShipment) {
            try {
              const token = localStorage.getItem("token")
              const res = await fetch(`${API}/api/shipments/location-update`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  shipmentId: selectedShipment.id,
                  latitude,
                  longitude,
                  statusNote: "Driver live location update",
                }),
              })
              if (res.ok) {
                const data = await res.json()
                setSelectedShipment(data.data)
              }
            } catch (error) {
              console.error("Failed to update location:", error)
            }
          }
        },
        (error) => {
          console.error("Location error:", error)
          setSharingLocation(false)
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 27000 }
      )
    } else {
      alert("Geolocation is not supported by your browser")
      setSharingLocation(false)
    }
  }

  const stopLiveLocation = () => {
    setSharingLocation(false)
    setCurrentLocation(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
      case "IN_TRANSIT":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200"
      case "DELAYED":
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div 
        className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Driver Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage assigned shipments and live tracking</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button onClick={fetchAssignedShipments} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="p-4 lg:p-6 space-y-6">

      {/* Live Location Alert */}
      {currentLocation && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border border-success/30 bg-success/5 backdrop-blur-sm hover:border-success/50 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-success font-semibold">
                <Navigation className="w-5 h-5 animate-pulse" />
                <span>LIVE TRACKING ACTIVE: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Section */}
      <motion.section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
          <h2 className="text-lg font-semibold">Shipment Metrics</h2>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {[
            { label: "Active Shipments", value: shipments.filter(s => s.status === "IN_TRANSIT").length, icon: Truck, color: "blue" },
            { label: "Pending Pickup", value: shipments.filter(s => s.status === "PENDING").length, icon: Package, color: "yellow" },
            { label: "Delivered Today", value: shipments.filter(s => s.status === "DELIVERED").length, icon: CheckCircle2, color: "green" },
            { label: "Live Tracking", value: sharingLocation ? "ON" : "OFF", icon: Navigation, color: "emerald" },
          ].map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className={`border border-border/50 bg-gradient-to-br from-${item.color}-50/50 to-${item.color}-100/30 dark:from-${item.color}-950/20 dark:to-${item.color}-900/10 hover:border-border hover:shadow-md transition-all`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.label}</CardTitle>
                    <div className={`p-2 bg-${item.color}-100 dark:bg-${item.color}-900/40 rounded-lg`}>
                      <item.icon className={`w-5 h-5 text-${item.color}-600 dark:text-${item.color}-400`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{item.value}</div>
                  <p className="text-xs text-muted-foreground mt-2">{item.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Shipments Section */}
      <motion.section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
          <h2 className="text-lg font-semibold">Assigned Shipments</h2>
        </div>

        {loading ? (
          <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="inline-block">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-primary/30 mb-4"></div>
              <p className="text-muted-foreground">Loading your shipments...</p>
            </div>
          </motion.div>
        ) : shipments.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border border-border/50 bg-background/50 backdrop-blur-sm">
              <CardContent className="pt-12 pb-12 text-center">
                <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg font-medium">No shipments assigned</p>
                <p className="text-muted-foreground/70 text-sm mt-2">Check back later for new assignments</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {shipments.map((shipment, idx) => (
              <motion.div
                key={shipment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="cursor-pointer group"
                onClick={() => setSelectedShipment(shipment)}
              >
                <Card className="border border-border/50 hover:shadow-md transition-all h-full bg-gradient-to-br from-background to-secondary/30 hover:from-secondary/50 hover:to-secondary/20 hover:border-border/75">
                  <CardHeader className="pb-3 border-b border-border/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{shipment.trackingNumber}</CardTitle>
                        <CardDescription className="text-sm mt-1">{shipment.cargoType}</CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(shipment.status)} border`}>
                        {shipment.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Route */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium">{shipment.originName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-muted-foreground flex-shrink-0 rotate-[-45deg]" />
                        <div className="flex-1 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium">{shipment.destinationName}</span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-muted-foreground">Progress</span>
                        <span className="font-bold text-primary">{shipment.currentProgress}%</span>
                      </div>
                      <div className="w-full bg-border/50 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-primary to-primary/50 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${shipment.currentProgress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Receiver */}
                    <div className="pt-2 border-t border-border/50 space-y-1">
                      <p className="text-xs text-muted-foreground">Receiver</p>
                      <p className="font-semibold text-sm">{shipment.receiverName}</p>
                      <p className="text-xs text-muted-foreground">{shipment.receiverContact}</p>
                    </div>

                    {/* Action Button */}
                    {selectedShipment?.id === shipment.id && (
                      <motion.div 
                        className="flex gap-2 pt-3" 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Button
                          size="sm"
                          variant={sharingLocation ? "destructive" : "default"}
                          className="flex-1"
                          onClick={(e) => { e.stopPropagation(); sharingLocation ? stopLiveLocation() : startLiveLocation(); }}
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          {sharingLocation ? "Stop Live" : "Start Live Tracking"}
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>
    </div>
  )
}
