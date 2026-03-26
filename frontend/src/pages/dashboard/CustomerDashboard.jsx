import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/card" // Note: using card exports for table as per shadcn pattern
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Truck, Clock, CheckCircle, MapPin, ChevronRight, Users, BarChart3, ArrowUpRight, Search } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function CustomerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [trackingInput, setTrackingInput] = useState('')
  const [stats, setStats] = useState({
    active: 0,
    inTransit: 0,
    delivered: 0,
    totalValue: 0
  })

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // Mock data - replace with real API calls
      setTimeout(() => {
        setShipments([
          {
            id: 1,
            trackingNumber: 'T2A-123456789',
            cargoType: 'Electronics',
            origin: 'New York, NY',
            destination: 'Los Angeles, CA',
            status: 'IN_TRANSIT',
            eta: '2024-12-20',
            driverName: 'John Smith',
            progress: 65
          },
          {
            id: 2,
            trackingNumber: 'T2A-987654321',
            cargoType: 'Apparel',
            origin: 'Chicago, IL',
            destination: 'Miami, FL',
            status: 'PENDING',
            eta: '2024-12-22',
            driverName: 'Sarah Johnson',
            progress: 12
          },
          {
            id: 3,
            trackingNumber: 'T2A-456789123',
            cargoType: 'Furniture',
            origin: 'Seattle, WA',
            destination: 'Dallas, TX',
            status: 'DELIVERED',
            eta: '2024-12-18',
            driverName: 'Mike Davis',
            progress: 100
          }
        ])
        setStats({
          active: 3,
          inTransit: 1,
          delivered: 1,
          totalValue: '$12,450'
        })
        setLoading(false)
      }, 800)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: { className: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      IN_TRANSIT: { className: 'bg-blue-100 text-blue-800', label: 'In Transit' },
      DELIVERED: { className: 'bg-green-100 text-green-800', label: 'Delivered' }
    }
    const variant = variants[status] || { className: 'bg-gray-100 text-gray-800', label: 'Unknown' }
    return <Badge className={`rounded-full px-3 py-1 ${variant.className}`}>{variant.label}</Badge>
  }

  const handleQuickTrack = () => {
    if (trackingInput.trim()) {
      navigate(`/track/${trackingInput.trim()}`)
    }
  }

  const handleRowClick = (trackingNumber) => {
    navigate(`/dashboard/track/${trackingNumber}`)
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-8 flex items-center justify-center min-h-[400px]">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
          <Users className="h-10 w-10 text-primary" />
          Customer Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Track your active shipments and delivery history in real-time
        </p>
      </motion.div>

      {/* Metrics Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {[
          { icon: Package, label: 'Active Shipments', value: stats.active, trend: '+12.5%', trendColor: 'green' },
          { icon: Truck, label: 'In Transit', value: stats.inTransit, trend: '+8.2%', trendColor: 'blue' },
          { icon: CheckCircle, label: 'Delivered', value: stats.delivered, trend: '+23%', trendColor: 'emerald' },
          { icon: BarChart3, label: 'Total Value', value: stats.totalValue, trend: '+15.8%', trendColor: 'purple' }
        ].map((stat, index) => (
          <motion.div key={stat.label} whileHover={{ y: -4, scale: 1.02 }}>
            <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/30">
              <CardContent className="p-6 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="px-2 py-1 bg-gradient-to-r rounded-full text-xs font-medium from-[var(--trend-color)] to-transparent">
                    <ArrowUpRight className="h-3 w-3 inline mr-1" />
                    {stat.trend}
                  </div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Track */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Quick Track
            </CardTitle>
            <CardDescription>
              Enter tracking number to jump to live tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="quick-track">Tracking ID</Label>
                <Input 
                  id="quick-track"
                  placeholder="T2A-123456789"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleQuickTrack()}
                />
              </div>
              <Button onClick={handleQuickTrack} className="w-32">
                Track Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Shipments Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Recent Shipments
            </CardTitle>
            <CardDescription>
              Your latest tracking activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((shipment) => (
                  <TableRow 
                    key={shipment.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleRowClick(shipment.trackingNumber)}
                  >
                    <TableCell className="font-mono font-semibold text-primary">
                      {shipment.trackingNumber}
                    </TableCell>
                    <TableCell>{shipment.cargoType}</TableCell>
                    <TableCell className="font-medium">{shipment.origin}</TableCell>
                    <TableCell className="font-medium">{shipment.destination}</TableCell>
                    <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                    <TableCell className="text-sm">{shipment.eta}</TableCell>
                    <TableCell className="font-medium">{shipment.driverName}</TableCell>
                    <TableCell>
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${shipment.progress}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 border-primary/50 hover:bg-primary/5"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRowClick(shipment.trackingNumber)
                        }}
                      >
                        Track Now
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
