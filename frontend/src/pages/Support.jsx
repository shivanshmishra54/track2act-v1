import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/AuthContext"
import { HelpCircle, MessageSquare, AlertTriangle, Package, MapPin, Clock, Send } from "lucide-react"

export default function Support() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("report")
  const [formData, setFormData] = useState({
    shipmentId: "",
    subject: "",
    category: "general",
    priority: "medium",
    description: "",
    attachments: []
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const categories = [
    { id: "delayed", label: "Delayed Delivery", icon: Clock },
    { id: "damaged", label: "Damaged Package", icon: Package },
    { id: "missing", label: "Missing Items", icon: AlertTriangle },
    { id: "address", label: "Address Issue", icon: MapPin },
    { id: "general", label: "General Inquiry", icon: HelpCircle }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setTimeout(() => {
        setFormData({
          shipmentId: "",
          subject: "",
          category: "general",
          priority: "medium",
          description: "",
          attachments: []
        })
        setSubmitted(false)
      }, 3000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Support & Reporting
            </h1>
          </div>
          <p className="text-gray-600 text-lg">We're here to help. Report issues or get support for your shipments</p>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("report")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "report"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300"
            }`}
          >
            Report Issue
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "faq"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300"
            }`}
          >
            FAQ
          </button>
        </motion.div>

        {/* Report Issue Tab */}
        {activeTab === "report" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="text-white text-2xl">Create a Support Ticket</CardTitle>
                <CardDescription className="text-blue-100">Let us know what's wrong and we'll help fix it</CardDescription>
              </CardHeader>

              <CardContent className="pt-8">
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-6 bg-green-50 border border-green-300 rounded-xl flex gap-4"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 text-white font-bold">✓</div>
                    <div>
                      <p className="font-bold text-green-900">Ticket Created Successfully!</p>
                      <p className="text-sm text-green-700 mt-1">Our support team will contact you within 24 hours.</p>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Shipment ID */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">Shipment Tracking Number (Optional)</label>
                    <Input
                      type="text"
                      placeholder="TRK123456789"
                      value={formData.shipmentId}
                      onChange={(e) => setFormData({ ...formData, shipmentId: e.target.value })}
                      className="h-11 rounded-lg border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900">Issue Category</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((cat) => {
                        const Icon = cat.icon
                        return (
                          <motion.button
                            key={cat.id}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData({ ...formData, category: cat.id })}
                            className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                              formData.category === cat.id
                                ? "border-blue-600 bg-blue-50"
                                : "border-gray-200 bg-white hover:border-blue-300"
                            }`}
                          >
                            <Icon className={`w-5 h-5 ${formData.category === cat.id ? "text-blue-600" : "text-gray-600"}`} />
                            <span className={`text-xs font-semibold text-center ${formData.category === cat.id ? "text-blue-900" : "text-gray-700"}`}>
                              {cat.label}
                            </span>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">Priority Level</label>
                    <div className="flex gap-3">
                      {["low", "medium", "high"].map((priority) => (
                        <button
                          key={priority}
                          type="button"
                          onClick={() => setFormData({ ...formData, priority })}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all border-2 ${
                            formData.priority === priority
                              ? "border-blue-600 bg-blue-100 text-blue-900"
                              : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                          }`}
                        >
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">Subject</label>
                    <Input
                      type="text"
                      placeholder="Brief description of your issue"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="h-11 rounded-lg border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">Detailed Description</label>
                    <Textarea
                      placeholder="Please provide detailed information about your issue..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={6}
                      className="rounded-lg border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={loading || !formData.subject || !formData.description}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {loading ? "Submitting..." : "Submit Support Ticket"}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
            {faqItems.map((item, idx) => (
              <FAQCard key={idx} item={item} index={idx} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

function FAQCard({ item, index }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer rounded-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-6 flex items-start justify-between bg-white hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900 text-left">{item.question}</h3>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0 ml-4"
          >
            <HelpCircle className="w-5 h-5 text-blue-600" />
          </motion.div>
        </button>
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 text-gray-700 border-t">{item.answer}</div>
        </motion.div>
      </Card>
    </motion.div>
  )
}

const faqItems = [
  {
    question: "How do I track my shipment?",
    answer: "You can track your shipment using the tracking number provided in your confirmation email. Visit the 'Track Shipment' page and enter your tracking number to see real-time updates."
  },
  {
    question: "What should I do if my shipment is delayed?",
    answer: "If your shipment is delayed, you can report it through the Support page. Select 'Delayed Delivery' as the issue category and provide your tracking number. Our team will investigate and contact you within 24 hours."
  },
  {
    question: "How can I report a damaged package?",
    answer: "If you receive a damaged package, open a support ticket immediately with photos of the damage. Select 'Damaged Package' as the category. Keep the original packaging as proof for insurance claims."
  },
  {
    question: "What are your delivery timelines?",
    answer: "Delivery times vary by location. Standard deliveries are typically 3-5 business days within India. Express options are available for urgent shipments. Check your shipment details for the estimated delivery date."
  },
  {
    question: "Can I change my delivery address?",
    answer: "If your shipment hasn't been dispatched yet, you can request an address change through a support ticket. If it's already in transit, you can provide delivery instructions, but address changes may not be possible."
  },
  {
    question: "How do I get a refund or return?",
    answer: "Please contact our support team with your tracking number and order details. We'll guide you through the return process. Refunds are typically processed within 7-10 business days after the package is received."
  }
]
