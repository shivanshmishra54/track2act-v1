import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth, API } from "@/context/AuthContext"
import { Search, MapPin, Package, Clock, CheckCircle2, Navigation, AlertCircle, Truck } from "lucide-react"

export default function TrackShipment() {
  const { user } = useAuth()
  const [trackingNumber, setTrackingNumber] = useState("")
  const [shipment, setShipment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-900 border-yellow-300",
      IN_TRANSIT: "bg-blue-100 text-blue-900 border-blue-300",
      DELIVERED: "bg-green-100 text-green-900 border-green-300",
      CANCELLED: "bg-red-100 text-red-900 border-red-300",
      DELAYED: "bg-orange-100 text-orange-900 border-orange-300",
      AT_RISK: "bg-red-100 text-red-900 border-red-300"
    }
    return colors[status] || "bg-gray-100 text-gray-900"
  }

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number")
      return
    }

    setLoading(true)
    setError("")
    setShipment(null)

    try {
      const response = await fetch(`${API}/api/shipments?trackingNumber=${trackingNumber}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      const data = await response.json()
      
      if (response.ok && data.data) {
        setShipment(data.data)
      } else {
        setError("Shipment not found. Please check the tracking number.")
      }
    } catch (err) {
      setError("Error fetching shipment. Please try again.")
      console.log("[v0] Error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-12 border-b border-border/50 pb-8 sticky top-20 bg-background/80 backdrop-blur-sm -mx-4 px-4 sm:px-6 lg:px-8 -mt-20 pt-20"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Track Your Shipment</h1>
          </div>
          <p className="text-muted-foreground text-base">Enter your tracking number for real-time delivery updates</p>
        </motion.div>

        {/* Search Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:border-border/75 transition-all rounded-xl mb-8">
            <CardHeader className="pb-6 border-b border-border/50 bg-gradient-to-r from-primary/5 to-primary/0">
              <CardTitle>Find Your Shipment</CardTitle>
              <CardDescription>Enter your tracking number for real-time updates</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleTrack} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter tracking number (e.g., TRK123456789)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="pl-12 h-11 text-base rounded-lg border-border/50 bg-secondary/50 focus:border-primary/50 focus:ring-primary/20 transition-colors"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg"
                >
                  {loading ? "Tracking..." : "Track Shipment"}
                </Button>
              </form>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-destructive">{error}</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Shipment Details */}
        {shipment && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:border-border/75 transition-all rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/50 pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">{shipment.trackingNumber}</CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground">{shipment.cargoType}</CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(shipment.status)} border`}>
                    {shipment.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-8 space-y-8">
                {/* Route Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900">Route Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* From */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-5 border border-blue-200/50 dark:border-blue-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <p className="text-xs font-semibold text-muted-foreground uppercase">From</p>
                      </div>
                      <p className="text-lg font-bold">{shipment.originName}</p>
                    </motion.div>

                    {/* To */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-green-50/50 dark:bg-green-950/20 rounded-lg p-5 border border-green-200/50 dark:border-green-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <p className="text-xs font-semibold text-muted-foreground uppercase">To</p>
                      </div>
                      <p className="text-lg font-bold">{shipment.destinationName}</p>
                    </motion.div>
                  </div>

                  {/* Route Visual */}
                  <div className="bg-secondary/30 rounded-lg p-5 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="text-xs font-semibold text-muted-foreground uppercase">Departure</div>
                        <div className="font-semibold text-foreground">{shipment.originName}</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <Navigation className="w-5 h-5 text-primary rotate-45" />
                      </div>
                      <div className="flex-1 space-y-1 text-right">
                        <div className="text-xs font-semibold text-muted-foreground uppercase">Delivery</div>
                        <div className="font-semibold text-foreground">{shipment.destinationName}</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-border/50 rounded-full h-2 relative overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-primary to-primary/50 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${shipment.currentProgress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-muted-foreground">
                      <span>Start</span>
                      <span className="text-primary">{shipment.currentProgress}%</span>
                      <span>Delivered</span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="border-t pt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Shipment Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <DetailBox label="Sender" value={shipment.customerName} />
                    <DetailBox label="Receiver" value={shipment.receiverName} />
                    <DetailBox label="Contact" value={shipment.receiverContact} />
                    <DetailBox label="Weight" value={`${shipment.cargoWeight || 'N/A'} kg`} />
                    <DetailBox label="Expected Delivery" value={new Date(shipment.estimatedArrival).toLocaleDateString()} />
                    <DetailBox label="Driver" value={shipment.assignedDriverName || 'Not Assigned'} />
                  </div>
                </div>

                {/* Tracking History */}
                {shipment.trackingHistory && shipment.trackingHistory.length > 0 && (
                  <div className="border-t border-border/50 pt-8">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      Tracking History
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {shipment.trackingHistory.map((update, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-r-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold">📍 {update.latitude.toFixed(4)}, {update.longitude.toFixed(4)}</p>
                              <p className="text-sm text-muted-foreground mt-1">{new Date(update.timestamp).toLocaleString()}</p>
                              {update.statusNote && <p className="text-sm mt-2 bg-background rounded px-3 py-1 border border-border/50">💬 {update.statusNote}</p>}
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function DetailBox({ label, value }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-secondary/30 rounded-lg p-4 border border-border/50">
      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">{label}</p>
      <p className="text-base font-semibold text-foreground">{value}</p>
    </motion.div>
  )
}
