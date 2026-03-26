import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { useAuth, API } from "../../context/AuthContext"
import { Users, Truck, Building2, Eye, Shield, LogOut, TrendingUp, CheckCircle2, AlertCircle, Search, ChevronRight, Lock } from "lucide-react"
import { motion } from "framer-motion"

const ROLES = ["ADMIN", "DRIVER", "COMPANY_OFFICER", "PORT_MANAGER", "ANALYST", "CUSTOMER"]

export default function AdminDashboard() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [assigningRole, setAssigningRole] = useState(null)
  const [newRole, setNewRole] = useState("")
  const [filter, setFilter] = useState("")

  useEffect(() => {
    fetchAllUsers()
  }, [])

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setUsers(data.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignRole = async (userId) => {
    if (!newRole) {
      alert("Please select a role")
      return
    }
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/users/${userId}/assign-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      })
      const data = await res.json()
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? data.data : u))
        setAssigningRole(null)
        setNewRole("")
        alert("Role assigned successfully")
      } else {
        alert(data.message || "Failed to assign role")
      }
    } catch (error) {
      console.error("Failed to assign role:", error)
      alert("Error assigning role")
    }
  }

  const handleDeactivateUser = async (userId) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/users/${userId}/deactivate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, isActive: false } : u))
        alert("User deactivated successfully")
      }
    } catch (error) {
      console.error("Failed to deactivate user:", error)
      alert("Error deactivating user")
    }
  }

  const handleActivateUser = async (userId) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API}/api/users/${userId}/activate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, isActive: true } : u))
        alert("User activated successfully")
      }
    } catch (error) {
      console.error("Failed to activate user:", error)
      alert("Error activating user")
    }
  }

  const getRoleColor = (role) => {
    const colors = {
      ADMIN: "bg-red-100 text-red-800",
      DRIVER: "bg-blue-100 text-blue-800",
      COMPANY_OFFICER: "bg-purple-100 text-purple-800",
      PORT_MANAGER: "bg-green-100 text-green-800",
      ANALYST: "bg-orange-100 text-orange-800",
      CUSTOMER: "bg-gray-100 text-gray-800",
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(filter.toLowerCase()) ||
    u.email.toLowerCase().includes(filter.toLowerCase())
  )

  const stats = {
    total: users.length,
    drivers: users.filter(u => u.role === "DRIVER").length,
    officers: users.filter(u => u.role === "COMPANY_OFFICER").length,
    active: users.filter(u => u.isActive).length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div 
        className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }}
      >
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage users, roles, and platform activity</p>
            </div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button variant="outline" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                Export Report
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="p-4 lg:p-6 space-y-8">

      {/* Stats Section */}
      <motion.section
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
          <h2 className="text-lg font-semibold">Platform Metrics</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border border-border/50 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 hover:border-border hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Users</CardTitle>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-2">Platform wide</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Drivers Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border border-border/50 bg-gradient-to-br from-cyan-50/50 to-cyan-100/30 dark:from-cyan-950/20 dark:to-cyan-900/10 hover:border-border hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Drivers</CardTitle>
                  <div className="p-2 bg-cyan-100 dark:bg-cyan-900/40 rounded-lg">
                    <Truck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.drivers}</div>
                <p className="text-xs text-muted-foreground mt-2">Active drivers</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Officers Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border border-border/50 bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/20 dark:to-purple-900/10 hover:border-border hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Officers</CardTitle>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                    <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.officers}</div>
                <p className="text-xs text-muted-foreground mt-2">Management staff</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Users Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border border-border/50 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-900/10 hover:border-border hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Active Users</CardTitle>
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.active}</div>
                <p className="text-xs text-muted-foreground mt-2">Currently active</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* User Management Section */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
          <h2 className="text-lg font-semibold">User Management</h2>
        </div>

        <Card className="border border-border/50 bg-background/50 backdrop-blur-sm hover:border-border/75 transition-all">
          <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-primary/0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Platform Users</CardTitle>
                <CardDescription>Manage roles, permissions, and user status</CardDescription>
              </div>
              <Button onClick={() => fetchAllUsers()} variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 py-2 h-10 bg-secondary/50 border-border/50 focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Users List */}
            {loading ? (
              <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="inline-block">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-primary/30 mb-4"></div>
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              </motion.div>
            ) : filteredUsers.length === 0 ? (
              <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <AlertCircle className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground text-base font-medium">No users found</p>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-3 max-h-[700px] overflow-y-auto pr-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05 }}
              >
                {filteredUsers.map((u, idx) => (
                  <motion.div 
                    key={u.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border border-border/50 rounded-lg p-4 hover:shadow-sm hover:border-border transition-all bg-gradient-to-r from-background to-secondary/30 hover:from-secondary/50 hover:to-secondary/20"
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                            {u.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{u.fullName}</h4>
                            <p className="text-sm text-gray-500">{u.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Role and Status */}
                      <div className="flex items-center gap-3">
                        <Badge className={`${getRoleColor(u.role)} border-0`}>
                          {u.role.replace('_', ' ')}
                        </Badge>
                        {!u.isActive && (
                          <Badge variant="outline" className="text-amber-600 border-amber-200">
                            Inactive
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      {assigningRole === u.id ? (
                        <motion.div className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select role...</option>
                            {ROLES.map(role => (
                              <option key={role} value={role}>{role.replace('_', ' ')}</option>
                            ))}
                          </select>
                          <Button
                            size="sm"
                            onClick={() => handleAssignRole(u.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setAssigningRole(null)
                              setNewRole("")
                            }}
                          >
                            Cancel
                          </Button>
                        </motion.div>
                      ) : (
                        <div className="flex gap-2">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setAssigningRole(u.id)
                                setNewRole(u.role)
                              }}
                              className="gap-2"
                            >
                              <Lock className="w-4 h-4" />
                              Assign Role
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            {u.isActive ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:border-red-300"
                                onClick={() => handleDeactivateUser(u.id)}
                              >
                                Deactivate
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700 hover:border-green-300"
                                onClick={() => handleActivateUser(u.id)}
                              >
                                Activate
                              </Button>
                            )}
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.section>
    </div>
  )
}
