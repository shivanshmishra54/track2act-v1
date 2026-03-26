# Track2Act - System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (React)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Landing    │  │   Track      │  │   Support    │       │
│  │   Page       │  │   Shipment   │  │   Page       │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Login      │  │   Signup     │  │  Dashboard   │       │
│  │   Page       │  │   Page       │  │   Router     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ┌─ Admin Dashboard ─┐  ┌─ Customer Dashboard ─┐            │
│  │ • User Mgmt       │  │ • Shipments          │            │
│  │ • Role Assign     │  │ • Tracking History   │            │
│  │ • Shipment CRUD   │  │ • Status Badges      │            │
│  └───────────────────┘  └──────────────────────┘            │
│                                                               │
│  ┌─ Driver Dashboard ──┐  ┌─ Company Dashboard ─┐           │
│  │ • Assignments       │  │ • Create Shipments  │           │
│  │ • Live Location     │  │ • Manage Shipments  │           │
│  │ • Status Updates    │  │ • Assign Drivers    │           │
│  └─────────────────────┘  └─────────────────────┘           │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Navbar Component (Global)               │    │
│  │  • Navigation Links • User Profile • Logout         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  API LAYER (Spring Boot)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │             Authentication Controller                 │   │
│  │ • POST /api/auth/register                            │   │
│  │ • POST /api/auth/login                               │   │
│  │ • POST /api/auth/logout                              │   │
│  │ • GET /api/auth/me                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Shipment Controller                           │   │
│  │ • GET /api/shipments (all)                           │   │
│  │ • GET /api/shipments/{id}                            │   │
│  │ • POST /api/shipments (create)                       │   │
│  │ • PUT /api/shipments/{id} (update)                   │   │
│  │ • DELETE /api/shipments/{id}                         │   │
│  │ • POST /api/shipments/location-update                │   │
│  │ • GET /api/shipments/{id}/tracking-history           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         User Controller (Admin Only)                  │   │
│  │ • GET /api/users (all users)                         │   │
│  │ • GET /api/users/{id}                                │   │
│  │ • POST /api/users/{id}/assign-role                   │   │
│  │ • POST /api/users/{id}/activate                      │   │
│  │ • POST /api/users/{id}/deactivate                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ ORM (JPA/Hibernate)
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  SERVICE LAYER                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │               AuthService                              │ │
│  │ • registerUser()                                       │ │
│  │ • authenticateUser()                                   │ │
│  │ • generateToken()                                      │ │
│  │ • validateToken()                                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │               ShipmentService                           │ │
│  │ • createShipment()                                      │ │
│  │ • updateShipment()                                      │ │
│  │ • deleteShipment()                                      │ │
│  │ • getShipmentById()                                     │ │
│  │ • getShipmentsByDriver()                                │ │
│  │ • updateLocation()                                      │ │
│  │ • getTrackingHistory()                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │               UserService                               │ │
│  │ • getAllUsers()                                         │ │
│  │ • getUsersByRole()                                      │ │
│  │ • assignRole()                                          │ │
│  │ • activateUser()                                        │ │
│  │ • deactivateUser()                                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Database Queries
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               Repositories                            │   │
│  │ • UserRepository                                      │   │
│  │ • ShipmentRepository                                  │   │
│  │ • TrackingUpdateRepository                            │   │
│  │ • LocationRepository                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ SQL Queries
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               MySQL Database                          │   │
│  │                                                        │   │
│  │  ┌──────────────┐  ┌──────────────┐                  │   │
│  │  │ Users Table  │  │ Shipments    │                  │   │
│  │  │              │  │ Table        │                  │   │
│  │  │ • id         │  │              │                  │   │
│  │  │ • email      │  │ • id         │                  │   │
│  │  │ • password   │  │ • tracking#  │                  │   │
│  │  │ • role       │  │ • driver_id  │                  │   │
│  │  │ • active     │  │ • status     │                  │   │
│  │  └──────────────┘  └──────────────┘                  │   │
│  │                                                        │   │
│  │  ┌──────────────────┐  ┌──────────────────┐          │   │
│  │  │ Locations Table  │  │ Tracking Updates │          │   │
│  │  │                  │  │ Table            │          │   │
│  │  │ • id             │  │                  │          │   │
│  │  │ • name           │  │ • id             │          │   │
│  │  │ • lat/lng        │  │ • shipment_id    │          │   │
│  │  └──────────────────┘  │ • lat/lng        │          │   │
│  │                        │ • timestamp      │          │   │
│  │                        │ • status_note    │          │   │
│  │                        └──────────────────┘          │   │
│  │                                                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Component Structure

### Frontend Components Hierarchy

```
App.jsx
├── Navbar (Global)
│   ├── Logo
│   ├── Navigation Links
│   ├── User Profile
│   └── Mobile Menu
│
├── Router
│   ├── Landing Page
│   │   ├── Header
│   │   ├── Features Section
│   │   └── Footer
│   │
│   ├── Public Pages
│   │   ├── LoginPage
│   │   ├── SignupPage
│   │   ├── TrackShipment Page ⭐
│   │   └── Support Page ⭐
│   │
│   ├── Protected Routes (Auth Required)
│   │   └── Dashboard Router
│   │       ├── Admin Dashboard ⭐
│   │       │   ├── User Management
│   │       │   ├── Shipment Management
│   │       │   └── Analytics
│   │       │
│   │       ├── Customer Dashboard ⭐
│   │       │   ├── Shipment List
│   │       │   ├── Tracking Details
│   │       │   └── History Timeline
│   │       │
│   │       ├── Driver Dashboard
│   │       │   ├── Assignment List
│   │       │   ├── Location Sharing
│   │       │   └── Status Updates
│   │       │
│   │       ├── Company Officer Dashboard
│   │       │   ├── Create Shipment
│   │       │   ├── Manage Shipments
│   │       │   └── Driver Assignment
│   │       │
│   │       └── Analyst Dashboard
│   │           ├── Analytics Cards
│   │           ├── Charts
│   │           └── Reports
```

---

## 🔐 Authentication Flow

```
User Sign Up
    ↓
POST /api/auth/register
    ↓
Create User with CUSTOMER role
    ↓
Hash Password (bcrypt)
    ↓
Save to Database
    ↓
Auto Login (Optional)
    ↓
Redirect to Dashboard
    ↓
────────────────────────

User Login
    ↓
POST /api/auth/login
    ↓
Verify Email & Password
    ↓
Generate JWT Token
    ↓
Return Token + User Info
    ↓
Store in localStorage
    ↓
Redirect to Role Dashboard
    ↓
Navbar Updates with User Info
    ↓
All API calls include JWT Token
```

---

## 👥 Role-Based Access Control

```
┌─────────────────────────────────────────────────────────┐
│                   Request                                │
│            (With JWT Token + Role)                       │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
         ┌────────────────────────────────┐
         │  JWT Verification Filter        │
         │  • Token Valid?                 │
         │  • Token Expired?               │
         │  • User Active?                 │
         └────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
         Invalid               Valid Token
              │                       │
              ↓                       ↓
         401 Unauthorized    ┌──────────────────┐
                             │ Extract User Role│
                             └──────────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                 ADMIN           DRIVER          CUSTOMER
                    │                │                │
                    ↓                ↓                ↓
           Full Access    Driver Dashboard   Customer Dashboard
         (All Endpoints)   (Limited Access)   (Limited Access)
```

---

## 🚀 Data Flow - Creating a Shipment

```
Company Officer
    ↓
Fills out Shipment Form
├── Cargo Type
├── Weight
├── Origin
├── Destination
├── Receiver Info
└── Driver Selection
    ↓
POST /api/shipments
    ↓
ShipmentController validates request
    ↓
ShipmentService.create()
├── Create Shipment entity
├── Generate tracking number
├── Set initial status: PENDING
├── Assign driver
└── Save to database
    ↓
Return ShipmentDTO
    ↓
Frontend shows success
    ↓
Shipment visible in:
├── Admin Dashboard (all shipments)
├── Company Dashboard (created by me)
├── Customer Dashboard (sent by me)
└── Driver Dashboard (if assigned to me)
```

---

## 🗺️ Real-Time Tracking Flow

```
Driver Location Update
    ↓
Browser Geolocation API
    ↓
Get Latitude & Longitude
    ↓
POST /api/shipments/location-update
{
  shipmentId: "uuid",
  latitude: 28.6139,
  longitude: 77.2090,
  statusNote: "Arrived at hub"
}
    ↓
LocationUpdateService processes
    ↓
Create TrackingUpdate record
├── Store coordinates
├── Store timestamp
├── Store status note
└── Calculate progress %
    ↓
Update Shipment status
    ↓
Save to database
    ↓
Return updated shipment
    ↓
Frontend updates in real-time:
├── Progress bar animates
├── Location coordinates show
├── Timestamp displays
└── Status updates
    ↓
Customer sees in dashboard
    ↓
Public tracking shows update
```

---

## 📱 Responsive Breakpoints

```
Mobile First Approach
    ↓
└─ Mobile (375px - 639px)
   ├── Single column layouts
   ├── Full-width cards
   ├── Hamburger menu
   └── Large touch targets
    ↓
└─ Tablet (640px - 1023px)
   ├── Two column grids
   ├── Optimized padding
   ├── Side navigation
   └── Medium spacing
    ↓
└─ Desktop (1024px+)
   ├── Multi-column grids
   ├── Full navigation
   ├── Wider content
   └── Generous spacing
```

---

## 🔄 User Role Transition

```
Sign Up
    ↓
CUSTOMER (Auto-assigned)
    │
    ├─── Admin Assigns DRIVER
    │    ├─ Driver Dashboard Access
    │    ├─ Location Sharing
    │    └─ Delivery Updates
    │
    ├─── Admin Assigns COMPANY_OFFICER
    │    ├─ Create Shipments
    │    ├─ Manage Shipments
    │    └─ Assign Drivers
    │
    ├─── Admin Assigns ADMIN
    │    ├─ User Management
    │    ├─ Full CRUD
    │    └─ Platform Control
    │
    └─── Admin Assigns ANALYST
         ├─ View Data
         ├─ Generate Reports
         └─ Trend Analysis
```

---

## 🎯 API Response Structure

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "CUSTOMER",
    "fullName": "John Doe",
    "isActive": true
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "User not found",
  "code": "USER_NOT_FOUND",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 📚 Database Relations

```
Users (1) ──→ (N) Shipments (as assignedDriver)
Users (1) ──→ (N) Shipments (as createdBy)
Shipments (1) ──→ (N) TrackingUpdates
Locations (1) ──→ (N) Shipments (as origin/destination)
```

---

## 🔐 Security Layers

```
Request
    ↓
HTTPS/SSL (Transport Layer)
    ↓
CORS Validation
    ↓
JWT Token Verification
    ↓
Role-Based Access Check
    ↓
Input Validation & Sanitization
    ↓
Database Query (Parameterized)
    ↓
Response with Security Headers
```

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Load Balancer / CDN             │
└─────────────────────────────────────────┘
              │             │
         ┌────┴───────┐     └────────────┐
         ↓            ↓                   ↓
    ┌─────────┐  ┌─────────┐    ┌──────────────┐
    │Frontend │  │Backend  │    │  S3 / Blob   │
    │ React   │  │ Spring  │    │  Storage     │
    │Vite App │  │ Boot    │    │  (Images)    │
    └─────────┘  └─────────┘    └──────────────┘
         │            │
         └────────────┼────────────────┐
                      ↓                │
             ┌──────────────────┐      │
             │  MySQL Database  │      │
             │  (Persistent)    │      │
             └──────────────────┘      │
                                       ↓
                          ┌──────────────────────┐
                          │ Redis Cache (Optional│
                          │ for scale)           │
                          └──────────────────────┘
```

---

## 📊 Monitoring & Logging

```
Application
    ↓
Logs
├── API Request/Response
├── User Actions
├── Errors & Exceptions
└── Database Queries
    ↓
Stored in
├── Local files
├── Database
└── Log aggregation service
    ↓
Metrics
├── Request count
├── Response time
├── Error rate
└── User analytics
```

This architecture provides scalability, security, and maintainability for the Track2Act platform.
