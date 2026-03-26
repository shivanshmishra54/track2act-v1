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
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Real-time insights and performance metrics</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button onClick={fetchAnalytics} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="p-4 lg:p-6 space-y-8">

        {/* Stats Grid */}
        <motion.section 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
            <h2 className="text-lg font-semibold">System Metrics</h2>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {[
              { label: "Total Shipments", value: stats.totalShipments, icon: BarChart3, color: "indigo" },
              { label: "On-Time Delivery", value: stats.onTime, percentage: stats.totalShipments > 0 ? Math.round((stats.onTime / stats.totalShipments) * 100) : 0, icon: CheckCircle, color: "emerald" },
              { label: "Delayed", value: stats.delayed, icon: AlertTriangle, color: "orange" },
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
                    <p className="text-xs text-muted-foreground mt-2">{item.percentage !== undefined ? `${item.percentage}%` : item.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Average Progress Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border border-border/50 bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10 hover:border-border hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Avg Progress</CardTitle>
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                      <Percent className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.averageProgress}%</div>
                  <p className="text-xs text-muted-foreground mt-2">Network average</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Status Distribution */}
        <motion.section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
            <h2 className="text-lg font-semibold">Shipment Status Distribution</h2>
          </div>

          <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:border-border/75 transition-all">
            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle>Status Breakdown</CardTitle>
              <CardDescription>Current distribution of all shipments by status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
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
                        <span className="text-sm text-muted-foreground">{count} ({Math.round(percentage)}%)</span>
                      </div>
                      <div className="w-full bg-border/50 rounded-full h-2">
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
        </motion.section>

        {/* Recent Shipments */}
        <motion.section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
            <h2 className="text-lg font-semibold">Recent Shipments</h2>
          </div>

          <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:border-border/75 transition-all">
            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle>Latest Activity</CardTitle>
              <CardDescription>Most recent 10 shipments in the system</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="inline-block">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-primary/30 mb-4"></div>
                    <p className="text-muted-foreground">Loading recent activity...</p>
                  </div>
                </motion.div>
              ) : shipments.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <ClockIcon className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg font-medium">No recent shipments</p>
                  <p className="text-muted-foreground/70 text-sm mt-2">Recent activity will appear here</p>
                </motion.div>
              ) : (
                <motion.div 
                  className="space-y-2 max-h-[400px] overflow-y-auto"
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
                      className="group p-4 border border-border/50 rounded-lg hover:shadow-sm hover:border-border bg-gradient-to-r from-background to-secondary/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                            {shipment.trackingNumber.charAt(0)}
                      </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm truncate">{shipment.trackingNumber}</p>
                            <p className="text-xs text-muted-foreground truncate">{shipment.originName} → {shipment.destinationName}</p>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <Badge variant="outline" className="mb-1 text-xs capitalize">
                            {shipment.status.replace('_', ' ')}
                          </Badge>
                          <p className="text-xs font-bold text-primary">{shipment.currentProgress}%</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}
