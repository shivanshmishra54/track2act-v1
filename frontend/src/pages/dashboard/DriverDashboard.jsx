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
        return "bg-green-100 text-green-800"
      case "IN_TRANSIT":
        return "bg-blue-100 text-blue-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "DELAYED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Driver Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage your assigned shipments and share your live location</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button onClick={fetchAssignedShipments} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {currentLocation && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-2 border-green-500 bg-green-50 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-800 font-semibold">
                <Navigation className="w-5 h-5 animate-pulse" />
                <span>LIVE: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Active Shipments</CardTitle>
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Truck className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{shipments.filter(s => s.status === "IN_TRANSIT").length}</div>
              <p className="text-xs text-gray-600 mt-2">Currently transporting</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Pending Pickup</CardTitle>
                <div className="p-3 bg-yellow-600 rounded-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-900">{shipments.filter(s => s.status === "PENDING").length}</div>
              <p className="text-xs text-gray-600 mt-2">Awaiting collection</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Delivered Today</CardTitle>
                <div className="p-3 bg-green-600 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{shipments.filter(s => s.status === "DELIVERED").length}</div>
              <p className="text-xs text-gray-600 mt-2">Successful deliveries</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Live Tracking</CardTitle>
                <div className="p-3 bg-emerald-600 rounded-lg">
                  <Navigation className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">{sharingLocation ? "ON" : "OFF"}</div>
              <p className="text-xs text-gray-600 mt-2">{sharingLocation ? "Location shared" : "Start sharing"}</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {loading ? (
        <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading your shipments...</p>
          </div>
        </motion.div>
      ) : shipments.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-12 pb-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No shipments assigned</p>
              <p className="text-gray-400 text-sm mt-2">Check back later for new assignments</p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
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
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all h-full bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:scale-[1.02] transform">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 group-hover:text-blue-900">{shipment.trackingNumber}</CardTitle>
                      <CardDescription className="text-sm mt-1">{shipment.cargoType}</CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(shipment.status)} border-0 capitalize`}>
                      {shipment.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Route */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium">{shipment.originName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-gray-400 flex-shrink-0 rotate-[-45deg]" />
                      <div className="flex-1 h-1 bg-gradient-to-r from-blue-400 to-green-600 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium">{shipment.destinationName}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-600">Progress</span>
                      <span className="font-bold text-blue-600">{shipment.currentProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-green-600 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${shipment.currentProgress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Receiver */}
                  <div className="pt-2 border-t space-y-1">
                    <p className="text-xs text-gray-600">Receiver</p>
                    <p className="font-semibold text-sm">{shipment.receiverName}</p>
                    <p className="text-xs text-gray-500">{shipment.receiverContact}</p>
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
    </div>
  )
}
