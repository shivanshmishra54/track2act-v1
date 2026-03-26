import { motion } from "framer-motion"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { LiveMap } from "@/components/dashboard/live-map"
import { DecisionIntelligencePanel } from "@/components/dashboard/decision-intelligence"
import { CompliancePanel } from "@/components/dashboard/compliance-panel"
import { AuditLog } from "@/components/dashboard/audit-log"
import { TaskExecutionFlow } from "@/components/dashboard/task-execution-flow"
import { CheckCircle, AlertCircle, TrendingUp, Zap } from "lucide-react"


export default function DashboardPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <motion.div 
        className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-4 lg:p-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Supply Chain Intelligence</h1>
              <p className="text-sm text-muted-foreground mt-1">Real-time monitoring and control center</p>
            </div>
            <QuickActions />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats Section */}
        <motion.section
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
            <h2 className="text-lg font-semibold">Overview Metrics</h2>
          </div>
          <motion.div variants={itemVariants}>
            <StatsCards />
          </motion.div>
        </motion.section>

        {/* Primary Metrics Grid */}
        <motion.section 
          className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: CheckCircle, label: "System Status", value: "Operational", color: "text-green-500", bg: "bg-green-50 dark:bg-green-950" },
            { icon: TrendingUp, label: "Performance", value: "98.5%", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950" },
            { icon: Zap, label: "Active Operations", value: "127", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950" },
            { icon: AlertCircle, label: "Alerts", value: "3", color: "text-red-500", bg: "bg-red-50 dark:bg-red-950" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`rounded-lg border border-border/50 p-4 ${item.bg} backdrop-blur-sm transition-all hover:shadow-md hover:border-border`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-background/50 ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{item.label}</p>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Maps and Intelligence Section */}
        <motion.section
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
            <h2 className="text-lg font-semibold">Real-Time Tracking & Analysis</h2>
          </div>
          <motion.div 
            className="grid gap-6 lg:grid-cols-3"
            variants={itemVariants}
          >
            <div className="lg:col-span-2 rounded-xl border border-border/50 overflow-hidden bg-background/50 backdrop-blur-sm hover:border-border/75 transition-all">
              <div className="h-[400px] lg:h-[500px]">
                <LiveMap />
              </div>
            </div>
            <div className="rounded-xl border border-border/50 overflow-hidden bg-background/50 backdrop-blur-sm hover:border-border/75 transition-all">
              <div className="h-[400px] lg:h-[500px]">
                <DecisionIntelligencePanel />
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Execution Flow and Compliance */}
        <motion.section
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
            <h2 className="text-lg font-semibold">Operations & Compliance</h2>
          </div>
          <motion.div 
            className="grid gap-6 lg:grid-cols-2"
            variants={itemVariants}
          >
            <div className="rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm hover:border-border/75 transition-all overflow-hidden">
              <TaskExecutionFlow />
            </div>
            <div className="rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm hover:border-border/75 transition-all overflow-hidden">
              <CompliancePanel />
            </div>
          </motion.div>
        </motion.section>

        {/* Audit Trail */}
        <motion.section
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
            <h2 className="text-lg font-semibold">Activity Log</h2>
          </div>
          <motion.div 
            className="rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm hover:border-border/75 transition-all overflow-hidden"
            variants={itemVariants}
          >
            <AuditLog />
          </motion.div>
        </motion.section>
      </div>
    </div>
  )
}
