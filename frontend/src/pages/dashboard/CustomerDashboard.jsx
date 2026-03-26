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
              <h1 className="text-3xl font-bold">Track Your Shipments</h1>
              <p className="text-sm text-muted-foreground mt-1">Real-time tracking and delivery updates</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button onClick={fetchShipments} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="p-4 lg:p-6 space-y-6">

      {/* Shipments Section */}
      <motion.section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
          <h2 className="text-lg font-semibold">Active Shipments</h2>
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
                <p className="text-muted-foreground text-lg font-medium">No active shipments found</p>
                <p className="text-muted-foreground/70 text-sm mt-2">Your tracked parcels will appear here</p>
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
      </motion.section>

      {/* Tracking Details Modal */}
      {selectedShipment && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
            <h2 className="text-lg font-semibold">Tracking Details</h2>
          </div>

          <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:border-border/75 transition-all">
            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Shipment Tracking Details</CardTitle>
                  <CardDescription className="mt-1">{selectedShipment.trackingNumber}</CardDescription>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setSelectedShipment(null)}
                  className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full p-2 transition-colors"
                >
                  ✕
                </motion.button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-8 space-y-6">
              {/* Shipment Details Grid */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200/50 dark:border-blue-800/30">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">From</p>
                  <p className="font-semibold text-foreground mt-1 line-clamp-2">{selectedShipment.originName}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-green-50/50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200/50 dark:border-green-800/30">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">To</p>
                  <p className="font-semibold text-foreground mt-1 line-clamp-2">{selectedShipment.destinationName}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-purple-50/50 dark:bg-purple-950/20 rounded-lg p-4 border border-purple-200/50 dark:border-purple-800/30">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Receiver</p>
                  <p className="font-semibold text-foreground mt-1 line-clamp-2">{selectedShipment.receiverName}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-orange-50/50 dark:bg-orange-950/20 rounded-lg p-4 border border-orange-200/50 dark:border-orange-800/30">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Contact</p>
                  <p className="font-semibold text-foreground mt-1">{selectedShipment.receiverContact}</p>
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
      </motion.section>
      </div>
    </div>
  )
}
