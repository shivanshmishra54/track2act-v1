import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { useAuth, API } from "../../context/AuthContext"
import { MapPin, Package, Clock, CheckCircle, Navigation, Truck, AlertCircle, ChevronRight, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedShipment, setSelectedShipment] = useState(null)

  useEffect(() => {
    fetchShipments()
  }, [user])

  const fetchShipments = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/shipments/active`, {
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
              Track Your Shipments
            </h1>
            <p className="text-gray-600 mt-2">Monitor real-time location and status of your parcels</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button onClick={fetchShipments} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </motion.div>
        </div>
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
              <p className="text-gray-500 text-lg">No active shipments found</p>
              <p className="text-gray-400 text-sm mt-2">Your tracked parcels will appear here</p>
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
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all h-full bg-gradient-to-br from-white to-gray-50 hover:scale-105 transform">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900">{shipment.trackingNumber}</CardTitle>
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
                      <Navigation className="w-4 h-4 text-gray-400 flex-shrink-0 rotate-45" />
                      <div className="flex-1 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium">{shipment.destinationName}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-600">Progress</span>
                      <span className="text-xs font-bold text-blue-600">{shipment.currentProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-blue-700 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${shipment.currentProgress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                  </div>

                  {/* ETA */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>ETA: {new Date(shipment.estimatedArrival).toLocaleDateString()}</span>
                  </div>

                  {/* View Details Button */}
                  <motion.div whileHover={{ x: 4 }}>
                    <div className="flex items-center gap-2 text-blue-600 text-sm font-medium pt-2 group-hover:gap-3 transition-all">
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {selectedShipment && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-2xl">Tracking Details</CardTitle>
                  <CardDescription className="text-blue-100 mt-1">{selectedShipment.trackingNumber}</CardDescription>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setSelectedShipment(null)}
                  className="text-white hover:bg-white/20 rounded-full p-2"
                >
                  ✕
                </motion.button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-8 space-y-6">
              {/* Shipment Details Grid */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase">From</p>
                  <p className="font-bold text-gray-900 mt-1">{selectedShipment.originName}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase">To</p>
                  <p className="font-bold text-gray-900 mt-1">{selectedShipment.destinationName}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Receiver</p>
                  <p className="font-bold text-gray-900 mt-1">{selectedShipment.receiverName}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <p className="text-xs font-semibold text-gray-600 uppercase">Contact</p>
                  <p className="font-bold text-gray-900 mt-1">{selectedShipment.receiverContact}</p>
                </motion.div>
              </motion.div>

              {/* Tracking History */}
              {selectedShipment.trackingHistory && selectedShipment.trackingHistory.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    Tracking History
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedShipment.trackingHistory.map((update, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">
                              📍 {update.latitude.toFixed(4)}, {update.longitude.toFixed(4)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(update.timestamp).toLocaleString()}
                            </p>
                            {update.statusNote && (
                              <p className="text-xs text-gray-700 mt-2 bg-white rounded px-2 py-1 border border-gray-200">
                                💬 {update.statusNote}
                              </p>
                            )}
                          </div>
                          <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
