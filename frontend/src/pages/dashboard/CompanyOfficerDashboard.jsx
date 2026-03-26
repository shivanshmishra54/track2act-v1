import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { useAuth, API } from "../../context/AuthContext"
import { Plus, Edit2, Trash2, Eye, Truck, Package, Users, Building, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"


export default function CompanyOfficerDashboard() {
  const { user } = useAuth()
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [formData, setFormData] = useState({
    cargoType: "",
    cargoWeight: "",
    cargoDescription: "",
    originId: "",
    destinationId: "",
    customerName: "",
    customerContact: "",
    receiverName: "",
    receiverContact: "",
    estimatedArrival: "",
  })

  useEffect(() => {
    fetchShipments()
  }, [user])

  const fetchShipments = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/shipments/created-by/${user.id}`, {
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

  const handleCreateShipment = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/shipments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          originId: formData.originId ? { id: formData.originId } : null,
          destinationId: formData.destinationId ? { id: formData.destinationId } : null,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setShipments([...shipments, data.data])
        setShowCreateForm(false)
        setFormData({
          cargoType: "",
          cargoWeight: "",
          cargoDescription: "",
          originId: "",
          destinationId: "",
          customerName: "",
          customerContact: "",
          receiverName: "",
          receiverContact: "",
          estimatedArrival: "",
        })
      } else {
        alert(data.message || "Failed to create shipment")
      }
    } catch (error) {
      console.error("Failed to create shipment:", error)
      alert("Error creating shipment")
    }
  }

  const handleDeleteShipment = async (id) => {
    if (!confirm("Are you sure you want to delete this shipment?")) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/shipments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setShipments(shipments.filter(s => s.id !== id))
        alert("Shipment deleted successfully")
      }
    } catch (error) {
      console.error("Failed to delete shipment:", error)
      alert("Error deleting shipment")
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      DELIVERED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
      IN_TRANSIT: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
      PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
      DELAYED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
    }
    return colors[status] || "bg-muted text-muted-foreground"
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
              <h1 className="text-3xl font-bold">Shipment Management</h1>
              <p className="text-sm text-muted-foreground mt-1">Create, manage, and track shipments for your organization</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} className="flex gap-2">
              <Button onClick={fetchShipments} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4" />
                New Shipment
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
          <h2 className="text-lg font-semibold">Shipment Overview</h2>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {[
            { label: "Total Shipments", value: shipments.length, icon: Truck, color: "emerald" },
            { label: "In Transit", value: shipments.filter(s => s.status === 'IN_TRANSIT').length, icon: Package, color: "blue" },
            { label: "Delivered", value: shipments.filter(s => s.status === 'DELIVERED').length, icon: Users, color: "green" },
            { label: "Avg Progress", value: shipments.length > 0 ? Math.round(shipments.reduce((acc, s) => acc + s.currentProgress, 0) / shipments.length) : 0, icon: Building, color: "purple" },
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
                  <div className="text-3xl font-bold">{item.value}{item.label === "Avg Progress" ? "%" : ""}</div>
                  <p className="text-xs text-muted-foreground mt-2">{item.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Create Form Section */}
      {showCreateForm && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
            <h2 className="text-lg font-semibold">Create New Shipment</h2>
          </div>

          <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:border-border/75 transition-all rounded-xl">
            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle>Shipment Details</CardTitle>
            </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateShipment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Cargo Type"
                  value={formData.cargoType}
                  onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
                  required
                />
                <Input
                  placeholder="Cargo Weight (kg)"
                  type="number"
                  value={formData.cargoWeight}
                  onChange={(e) => setFormData({ ...formData, cargoWeight: e.target.value })}
                />
              </div>

              <Input
                placeholder="Cargo Description"
                value={formData.cargoDescription}
                onChange={(e) => setFormData({ ...formData, cargoDescription: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Origin Location ID"
                  value={formData.originId}
                  onChange={(e) => setFormData({ ...formData, originId: e.target.value })}
                  required
                />
                <Input
                  placeholder="Destination Location ID"
                  value={formData.destinationId}
                  onChange={(e) => setFormData({ ...formData, destinationId: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Customer Name"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
                <Input
                  placeholder="Customer Contact"
                  value={formData.customerContact}
                  onChange={(e) => setFormData({ ...formData, customerContact: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Receiver Name"
                  value={formData.receiverName}
                  onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                  required
                />
                <Input
                  placeholder="Receiver Contact"
                  value={formData.receiverContact}
                  onChange={(e) => setFormData({ ...formData, receiverContact: e.target.value })}
                  required
                />
              </div>

              <Input
                type="datetime-local"
                placeholder="Estimated Arrival"
                value={formData.estimatedArrival}
                onChange={(e) => setFormData({ ...formData, estimatedArrival: e.target.value })}
                required
              />

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Create Shipment</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
            <p className="text-gray-600">Loading your shipments...</p>
          </div>
        </motion.div>
      ) : shipments.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-12 pb-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No shipments yet</p>
              <p className="text-gray-400 text-sm mt-2">Create your first shipment to get started</p>
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
            >
              <Card className={`border border-border/50 hover:shadow-md transition-all h-full bg-gradient-to-br from-background to-secondary/30 hover:from-secondary/50 hover:to-secondary/20 ${selectedShipment?.id === shipment.id ? 'ring-2 ring-primary ring-opacity-50' : ''} hover:border-border/75`}>
                <CardHeader className="pb-3 border-b border-border/50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{shipment.trackingNumber}</CardTitle>
                      <CardDescription className="text-sm mt-1">{shipment.cargoType} - {shipment.cargoWeight}kg</CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(shipment.status)} border`}>
                      {shipment.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">From</p>
                      <p className="font-semibold">{shipment.originName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">To</p>
                      <p className="font-semibold">{shipment.destinationName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Customer</p>
                      <p className="font-semibold text-primary">{shipment.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Receiver</p>
                      <p className="font-semibold">{shipment.receiverName}</p>
                    </div>
                  </div>

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

                  <motion.div className="flex gap-2 pt-3" whileHover={{ scale: 1.05 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedShipment(selectedShipment?.id === shipment.id ? null : shipment)
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {selectedShipment?.id === shipment.id ? 'Hide' : 'Details'}
                    </Button>
                    <Button variant="outline" size="sm" className="px-3">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" className="px-3" onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteShipment(shipment.id)
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          </motion.div>
        )}
        </motion.section>
      </div>
    </div>
  )
}

