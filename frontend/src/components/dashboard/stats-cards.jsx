import { motion } from "framer-motion"
import { Skeleton } from "../ui/skeleton"
import { TrendingUp, TrendingDown, Package, Truck, AlertTriangle, CheckCircle } from "lucide-react"

export function StatsCards({ stats, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  const dynamicStats = [
    {
      title: "Total Shipments",
      value: stats.totalShipments?.toLocaleString() || 0,
      change: "+12.5%",
      trend: "up",
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Shipments",
      value: stats.activeShipments?.toLocaleString() || 0,
      change: "+8.2%",
      trend: "up",
      icon: Truck,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Delayed Shipments",
      value: stats.delayedShipments?.toLocaleString() || 0,
      change: "-15.3%",
      trend: "down",
      icon: AlertTriangle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Delivered Shipments",
      value: stats.deliveredShipments?.toLocaleString() || 0,
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {dynamicStats.map((stat, index) => (
        <motion.div
          key={stat.title}
          className="rounded-xl border border-border/50 bg-card p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className={`rounded-lg p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium ${
              stat.trend === "up" ? "text-success" : "text-destructive"
            }`}>
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {stat.change}
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
