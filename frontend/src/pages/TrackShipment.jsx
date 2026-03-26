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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text text-transparent">
              Track Your Shipment
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Enter your tracking number to get real-time updates on your package</p>
        </motion.div>

        {/* Search Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-xl bg-white rounded-2xl mb-8">
            <CardHeader className="pb-0">
              <CardTitle>Find Your Shipment</CardTitle>
              <CardDescription>Use your tracking number to monitor your delivery</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleTrack} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter tracking number (e.g., TRK123456789)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="pl-12 h-12 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl"
                >
                  {loading ? "Tracking..." : "Track Shipment"}
                </Button>
              </form>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700">{error}</p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Shipment Details */}
        {shipment && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white pb-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-white text-2xl">{shipment.trackingNumber}</CardTitle>
                    <CardDescription className="text-blue-100 mt-2">{shipment.cargoType}</CardDescription>
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
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* From */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <p className="text-sm font-semibold text-gray-600 uppercase">From</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900">{shipment.originName}</p>
                    </motion.div>

                    {/* To */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-green-50 rounded-xl p-6 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <p className="text-sm font-semibold text-gray-600 uppercase">To</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900">{shipment.destinationName}</p>
                    </motion.div>
                  </div>

                  {/* Route Visual */}
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="text-sm font-semibold text-gray-600">DEPARTURE</div>
                        <div className="text-gray-900 font-bold">{shipment.originName}</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <Navigation className="w-6 h-6 text-blue-600 rotate-45" />
                      </div>
                      <div className="flex-1 space-y-2 text-right">
                        <div className="text-sm font-semibold text-gray-600">DELIVERY</div>
                        <div className="text-gray-900 font-bold">{shipment.destinationName}</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-300 rounded-full h-1 relative overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${shipment.currentProgress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 font-medium">
                      <span>Start</span>
                      <span className="font-bold text-blue-600">{shipment.currentProgress}%</span>
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
                  <div className="border-t pt-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      Tracking History
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {shipment.trackingHistory.map((update, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-r-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">📍 {update.latitude.toFixed(4)}, {update.longitude.toFixed(4)}</p>
                              <p className="text-sm text-gray-600 mt-1">{new Date(update.timestamp).toLocaleString()}</p>
                              {update.statusNote && <p className="text-sm text-gray-700 mt-2 bg-white rounded px-3 py-1 border border-gray-200">💬 {update.statusNote}</p>}
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 rounded-lg p-4">
      <p className="text-xs font-semibold text-gray-600 uppercase mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </motion.div>
  )
}
