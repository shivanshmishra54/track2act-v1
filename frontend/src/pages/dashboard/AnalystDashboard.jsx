import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { useAuth, API } from "../../context/AuthContext"
import { TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3, Activity, RefreshCw, Users, Percent, Clock as ClockIcon } from "lucide-react"
import { motion } from "framer-motion"


export default function AnalystDashboard() {
  const { user } = useAuth()
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalShipments: 0,
    onTime: 0,
    delayed: 0,
    delivered: 0,
    averageProgress: 0,
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/shipments/active`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        const shipmentsList = data.data || []
        setShipments(shipmentsList)

        const totalShipments = shipmentsList.length
        const onTime = shipmentsList.filter(s => s.status !== "DELAYED").length
        const delayed = shipmentsList.filter(s => s.status === "DELAYED").length
        const delivered = shipmentsList.filter(s => s.status === "DELIVERED").length
        const averageProgress = totalShipments > 0 
          ? Math.round(shipmentsList.reduce((acc, s) => acc + (s.currentProgress || 0), 0) / totalShipments)
          : 0

        setStats({
          totalShipments,
          onTime,
          delayed,
          delivered,
          averageProgress,
        })
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusDistribution = () => {
    const distribution = {
      PENDING: 0,
      IN_TRANSIT: 0,
      DELIVERED: 0,
      DELAYED: 0,
      CANCELLED: 0,
    }
    shipments.forEach(s => {
      distribution[s.status] = (distribution[s.status] || 0) + 1
    })
    return distribution
  }

  const distribution = getStatusDistribution()

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Real-time insights, performance metrics, and predictive analytics</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button onClick={fetchAnalytics} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-indigo-50 to-indigo-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Total Shipments</CardTitle>
                <div className="p-3 bg-indigo-600 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-900">{stats.totalShipments}</div>
              <p className="text-xs text-gray-600 mt-2">Network wide</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">On-Time Delivery</CardTitle>
                <div className="p-3 bg-emerald-600 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">{stats.onTime}</div>
              <p className="text-xs text-gray-600 mt-2">
                {stats.totalShipments > 0 ? Math.round((stats.onTime / stats.totalShipments) * 100) : 0}%
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Delayed</CardTitle>
                <div className="p-3 bg-orange-600 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{stats.delayed}</div>
              <p className="text-xs text-gray-600 mt-2">
                {stats.totalShipments > 0 ? Math.round((stats.delayed / stats.totalShipments) * 100) : 0}%
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Avg Progress</CardTitle>
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{stats.averageProgress}%</div>
              <p className="text-xs text-gray-600 mt-2">Network average</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Shipment Status Distribution</CardTitle>
          <CardDescription>Current status breakdown of all shipments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {Object.entries(distribution).map(([status, count]) => {
              const colors = {
                PENDING: "bg-yellow-500",
                IN_TRANSIT: "bg-blue-500",
                DELIVERED: "bg-green-500",
                DELAYED: "bg-red-500",
                CANCELLED: "bg-gray-500",
              }
              const percentage = stats.totalShipments > 0 ? (count / stats.totalShipments) * 100 : 0
              
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{status}</span>
                    <span className="text-sm text-gray-600">{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${colors[status]} h-2 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
          <CardDescription>Latest 10 shipments in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                <p className="text-gray-600">Loading recent activity...</p>
              </div>
            </motion.div>
          ) : shipments.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <ClockIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No recent shipments</p>
              <p className="text-gray-400 text-sm mt-2">Recent activity will appear here</p>
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-3 max-h-[400px] overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
            >
              {shipments.slice(0, 10).map((shipment, idx) => (
                <motion.div 
                  key={shipment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group p-4 border rounded-xl hover:shadow-md hover:border-purple-300 bg-gradient-to-r from-gray-50 to-white transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {shipment.trackingNumber.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-purple-900">{shipment.trackingNumber}</p>
                        <p className="text-xs text-gray-600 truncate">{shipment.originName} → {shipment.destinationName}</p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <Badge variant="outline" className="mb-1 text-xs capitalize">
                        {shipment.status.replace('_', ' ')}
                      </Badge>
                      <p className="text-xs font-bold text-purple-600">{shipment.currentProgress}%</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Status Distribution - Enhanced */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Status Distribution
            </CardTitle>
            <CardDescription>Current breakdown across all shipments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1 }}>
              {Object.entries(distribution).map(([status, count]) => {
                const colors = {
                  PENDING: "from-yellow-500 to-yellow-600",
                  IN_TRANSIT: "from-blue-500 to-blue-600",
                  DELIVERED: "from-emerald-500 to-emerald-600",
                  DELAYED: "from-orange-500 to-orange-600",
                  CANCELLED: "from-gray-500 to-gray-600",
                }
                const percentage = stats.totalShipments > 0 ? (count / stats.totalShipments) * 100 : 0
                
                return (
                  <motion.div 
                    key={status} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="group hover:bg-gray-50 p-3 rounded-xl transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900 capitalize">{status.replace('_', ' ')}</span>
                      <span className="text-sm font-medium text-gray-600">{count} ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden group-hover:shadow-inner">
                      <motion.div
                        className={`bg-gradient-to-r from-${colors[status]} h-3 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(percentage, 5)}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

