# Track2Act - Enterprise Platform Guide

## Overview

Track2Act is a modern, enterprise-level real-time shipment tracking and logistics management platform built with a professional architecture supporting multiple user roles, advanced features, and comprehensive admin controls.

---

## User Roles & Features

### 1. **Customer (Default Role)**
**Access Level:** Public tracking + Dashboard

**Features:**
- **Real-time Shipment Tracking**: Track parcels by shipment ID without login
- **Dashboard Access**: View all personal shipments with live updates
- **Tracking History**: See complete location history with timestamps
- **Support Tickets**: Report issues (delayed delivery, damaged packages, etc.)
- **Profile Management**: Update contact information

**Customer Flow:**
```
Sign Up → Auto-assign CUSTOMER role → Dashboard Access
         ↓
    Can track shipments
    Can create support tickets
    Admin can upgrade role later
```

### 2. **Driver**
**Access Level:** Vehicle tracking + Shipment assignment

**Features:**
- **Live Location Sharing**: Real-time GPS tracking while on delivery
- **Assigned Shipments**: View only assigned parcels
- **Delivery Status Updates**: Mark shipments as delivered/in-transit
- **Route Optimization**: View optimal routes for multiple stops
- **Daily Reports**: Submit delivery summaries

**Driver Workflow:**
```
Driver logs in → View assigned shipments → Share live location
            ↓
    Update delivery status → Mark complete → Daily summary
```

### 3. **Company Officer**
**Access Level:** Full shipment CRUD + operations

**Features:**
- **Create Shipments**: Full shipment creation with all details
- **Edit/Update Shipments**: Modify shipment details pre-dispatch
- **Delete Shipments**: Cancel shipments if needed
- **Assign Drivers**: Assign drivers to shipments
- **View Analytics**: See company-wide metrics
- **Manage Users**: View company staff

**Company Officer Workflow:**
```
Create shipment → Assign driver → Monitor progress → Generate reports
      ↓
Update tracking info → Close shipment → Archive
```

### 4. **Admin (Super User)**
**Access Level:** Complete platform control

**Features:**
- **User Management**: 
  - View all users in the system
  - Assign/change user roles
  - Activate/deactivate accounts
  - Search and filter users
  
- **Shipment Management**:
  - Create/edit/delete any shipment
  - Reassign drivers mid-journey
  - Force status updates
  - View all company shipments
  
- **Reporting**:
  - Platform-wide analytics
  - User activity logs
  - Shipment compliance reports
  - Financial summaries
  
- **System Controls**:
  - Monitor API usage
  - System health checks
  - Performance metrics

**Admin Workflow:**
```
Dashboard → User Management → Role Assignment
         ↓
    Shipment Oversight → Reporting → Analytics
```

### 5. **Port Manager**
**Same as Company Officer** - manages port/hub operations

### 6. **Analyst**
**Access Level:** Read-only analytics & insights

**Features:**
- **Data Analytics**: View all platform metrics
- **Trend Analysis**: Historical data analysis
- **Report Generation**: Create custom reports
- **Compliance Tracking**: Monitor regulatory compliance
- **Read-only Access**: Cannot modify data

---

## Platform Architecture

### Frontend Structure
```
frontend/src/
├── pages/
│   ├── LandingPage.jsx          # Public landing
│   ├── LoginPage.jsx             # Auth
│   ├── SignupPage.jsx            # Registration
│   ├── TrackShipment.jsx         # Public tracking (no auth required)
│   ├── Support.jsx               # Support & FAQ
│   ├── DashboardRouter.jsx       # Role-based routing
│   └── dashboard/
│       ├── AdminDashboard.jsx    # Admin panel
│       ├── DriverDashboard.jsx   # Driver tracking
│       ├── CustomerDashboard.jsx # Customer shipments
│       ├── CompanyOfficerDashboard.jsx
│       └── AnalystDashboard.jsx
├── components/
│   ├── Navbar.jsx               # Global navigation
│   ├── RoleBasedRoute.jsx       # Protected routes
│   └── ProtectedRoute.jsx       # Auth protection
├── context/
│   └── AuthContext.jsx          # Auth state management
└── App.jsx                      # Main router
```

### Backend API Endpoints

#### Authentication
```
POST /api/auth/register      # Register new user
POST /api/auth/login         # Login user
GET  /api/auth/me            # Get current user
POST /api/auth/logout        # Logout
```

#### Shipments (CRUD)
```
GET    /api/shipments                    # List active shipments
GET    /api/shipments/{id}               # Get shipment details
POST   /api/shipments                    # Create shipment
PUT    /api/shipments/{id}               # Update shipment
DELETE /api/shipments/{id}               # Delete shipment

GET    /api/shipments/driver/{driverId}  # Driver's shipments
GET    /api/shipments/created-by/{userId} # User's shipments
```

#### Tracking
```
POST  /api/shipments/location-update          # Update location
GET   /api/shipments/{id}/tracking-history    # Get history
```

#### Users (Admin)
```
GET    /api/users                        # List all users
GET    /api/users/{id}                   # Get user details
PUT    /api/users/{id}/role              # Assign role
PUT    /api/users/{id}/activate          # Activate user
PUT    /api/users/{id}/deactivate        # Deactivate user
GET    /api/users/role/{role}            # Get by role
```

---

## Key Features

### 1. Real-Time Tracking
- **Live GPS Updates**: Drivers share location in real-time
- **Route Visualization**: See shipment journey on map
- **Progress Indicators**: Visual progress bars (0-100%)
- **Automated Status Updates**: Status changes based on location

### 2. Support System
- **Ticket Creation**: Report issues with categories
- **Priority Levels**: Low/Medium/High priority
- **Auto-Response**: Instant confirmation
- **24-hour SLA**: Support team commitment
- **FAQ System**: Self-service knowledge base

### 3. Admin Controls
- **User Management**: Complete user lifecycle
- **Role-Based Access**: Granular permissions
- **Audit Trails**: Track all actions
- **Compliance Reporting**: Regulatory requirements
- **Analytics Dashboard**: Business intelligence

### 4. Enterprise Security
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt encryption
- **Role-Based Access Control (RBAC)**: Fine-grained permissions
- **HTTP-Only Cookies**: Prevent XSS attacks
- **Parameterized Queries**: Prevent SQL injection

---

## User Journey Examples

### New Customer Signs Up
```
1. Visit landing page
2. Click "Sign Up"
3. Enter name, email, password
4. Auto-assigned CUSTOMER role
5. Redirect to dashboard
6. Can track shipments & create support tickets
7. Admin can upgrade role to DRIVER/COMPANY_OFFICER if needed
```

### Admin Onboards a Driver
```
1. Driver signs up as CUSTOMER
2. Admin views user management
3. Searches for driver by name/email
4. Clicks "Assign Role"
5. Selects "DRIVER"
6. Saves changes
7. Driver logs in with updated permissions
8. Now sees Driver Dashboard with live tracking
```

### Company Officer Creates Shipment
```
1. Log in as COMPANY_OFFICER
2. Go to dashboard
3. Click "Create Shipment"
4. Fill in cargo details, origin, destination
5. Select driver to assign
6. Submit
7. Shipment created with PENDING status
8. Driver notified of assignment
9. Driver can start live tracking
```

---

## Admin Dashboard Guide

### User Management Section
- **Search Bar**: Find users by name or email
- **Role Badges**: Color-coded role indicators
- **Status Indicators**: Active/Inactive flags
- **Assign Role Button**: Change user roles
- **Activate/Deactivate**: Control account access

### Shipment Management
- **View All Shipments**: Complete shipment list
- **Create New**: Quick shipment creation
- **Edit**: Update shipment details
- **Delete**: Remove shipments
- **Driver Assignment**: Reassign drivers
- **Status Updates**: Force status changes

### Analytics
- **Total Users**: Platform user count
- **Active Drivers**: Ready-for-delivery count
- **Company Officers**: Logistics staff count
- **Shipment Metrics**: In-transit, delivered, delayed
- **Performance Charts**: Trend analysis

---

## Security & Compliance

### Access Control
- **Role-Based Routes**: Unauthorized access blocked
- **Protected APIs**: All endpoints require authentication
- **Admin-Only Features**: Restricted to ADMIN role
- **Data Isolation**: Users see only their data

### Data Protection
- **Password Security**: Minimum 6 characters, bcrypt hashed
- **JWT Tokens**: Secure session management
- **Audit Logs**: All actions tracked with timestamps
- **HTTPS Required**: Secure data transmission

---

## Customization Points

### Add New User Role
1. Update User entity: `Role` enum
2. Create new Dashboard component
3. Add route in `App.jsx`
4. Update navigation in `Navbar.jsx`
5. Set role-specific permissions

### Extend Shipment Fields
1. Add fields to Shipment entity
2. Update DTOs
3. Modify forms
4. Update API endpoints

### Custom Analytics
1. Create Analyst data models
2. Build chart components
3. Add to AnalystDashboard
4. Connect to backend queries

---

## Deployment

### Prerequisites
- Node.js 16+
- Java 11+
- MySQL/PostgreSQL
- Git

### Build & Deploy
```bash
# Frontend
cd frontend
npm install
npm run build

# Backend
cd backend
mvn clean package
java -jar target/track2act.jar
```

### Environment Variables
```
REACT_APP_API_URL=http://localhost:8080
JWT_SECRET=your-secret-key
DATABASE_URL=mysql://user:pass@localhost:3306/track2act
```

---

## Support & Help

For detailed feature-specific guides, see:
- **Tracking Guide**: `/track` page
- **Support & FAQ**: `/support` page
- **Admin Documentation**: Admin dashboard help section
- **API Docs**: `/api/docs` (Swagger)

---

## Contact
For technical support or feature requests, create a support ticket or contact: support@track2act.com
