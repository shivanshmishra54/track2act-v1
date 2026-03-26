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
      DELIVERED: "bg-green-100 text-green-800",
      IN_TRANSIT: "bg-blue-100 text-blue-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      DELAYED: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
              Shipment Management
            </h1>
            <p className="text-gray-600 mt-2">Create, manage, and track shipments for your organization</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button onClick={fetchShipments} variant="outline" className="gap-2 mr-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Shipment
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
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Total Shipments</CardTitle>
                <div className="p-3 bg-emerald-600 rounded-lg">
                  <Truck className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">{shipments.length}</div>
              <p className="text-xs text-gray-600 mt-2">Created by you</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">In Transit</CardTitle>
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{shipments.filter(s => s.status === 'IN_TRANSIT').length}</div>
              <p className="text-xs text-gray-600 mt-2">Currently moving</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Delivered</CardTitle>
                <div className="p-3 bg-green-600 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{shipments.filter(s => s.status === 'DELIVERED').length}</div>
              <p className="text-xs text-gray-600 mt-2">Successfully completed</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-700">Avg Progress</CardTitle>
                <div className="p-3 bg-purple-600 rounded-lg">
                  <Building className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">
                {shipments.length > 0 ? Math.round(shipments.reduce((acc, s) => acc + s.currentProgress, 0) / shipments.length) : 0}%
              </div>
              <p className="text-xs text-gray-600 mt-2">Your shipments</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {showCreateForm && (
        <Card>

          <CardHeader>
            <CardTitle>Create New Shipment</CardTitle>
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
              <Card className={`border-0 shadow-lg hover:shadow-xl transition-all h-full bg-gradient-to-br from-white to-gray-50 ${selectedShipment?.id === shipment.id ? 'ring-2 ring-emerald-500 ring-opacity-50' : 'hover:from-emerald-50'} hover:scale-[1.02] transform`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 group-hover:text-emerald-900">{shipment.trackingNumber}</CardTitle>
                      <CardDescription className="text-sm mt-1">{shipment.cargoType} - {shipment.cargoWeight}kg</CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(shipment.status)} border-0 capitalize`}>
                      {shipment.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">From</p>
                      <p className="font-semibold">{shipment.originName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">To</p>
                      <p className="font-semibold">{shipment.destinationName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Customer</p>
                      <p className="font-semibold text-emerald-900">{shipment.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Receiver</p>
                      <p className="font-semibold">{shipment.receiverName}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-600">Progress</span>
                      <span className="font-bold text-emerald-600">{shipment.currentProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2.5 rounded-full"
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
    </div>
  )
}

