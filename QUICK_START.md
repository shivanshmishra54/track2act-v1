# Track2Act - Quick Start Guide

## 30-Minute Setup

### Step 1: Backend (10 minutes)

```bash
# Navigate to backend
cd backend

# Build the project
mvn clean install

# Run the backend
mvn spring-boot:run

# Expected output:
# Started Track2ActApplication in X.XXX seconds
# Server is running on http://localhost:8080
```

**Backend Requirements:**
- Java 11+
- MySQL 8.0+ (with database created)
- Maven 3.6+

### Step 2: Frontend (5 minutes)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5173/
```

**Frontend Requirements:**
- Node.js 16+
- npm 8+

### Step 3: Test the Platform (15 minutes)

#### Test 1: Create Admin User
1. Open http://localhost:5173
2. Click "Sign Up"
3. Register: `admin@test.com` / `Admin@123`
4. Note the user ID from response

#### Test 2: Assign Admin Role
```bash
# Replace {userId} and {token} from signup response
curl -X POST http://localhost:8080/api/users/{userId}/assign-role \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"role":"ADMIN"}'
```

#### Test 3: Create Location (Required for Shipments)
```bash
curl -X POST http://localhost:8080/api/locations \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Mumbai Port",
    "type":"PORT",
    "latitude":19.0760,
    "longitude":72.8777
  }'
```

#### Test 4: Create Driver User
1. Sign up: `driver@test.com` / `Driver@123`
2. Via API, assign DRIVER role to this user

#### Test 5: Create Shipment
```bash
curl -X POST http://localhost:8080/api/shipments \
  -H "Authorization: Bearer {adminToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "cargoType":"Electronics",
    "cargoWeight":50,
    "originId":"{locationId}",
    "destinationId":"{locationId2}",
    "customerName":"John Doe",
    "customerContact":"9876543210",
    "receiverName":"Jane Smith",
    "receiverContact":"9876543211",
    "estimatedArrival":"2024-12-31T18:00:00",
    "assignedDriverId":"{driverId}"
  }'
```

#### Test 6: Test Dashboards
1. **Admin Dashboard**: Log in as admin → See user management
2. **Driver Dashboard**: Log in as driver → See assigned shipments
3. **Customer Dashboard**: Create customer user → See public shipments

---

## User Roles Quick Reference

### 1. ADMIN
**Capabilities:**
- Manage all users
- Assign/revoke roles
- View all shipments
- Platform monitoring

**Access:**
- Admin Dashboard
- User Management Panel
- All APIs with `ADMIN` restriction

### 2. DRIVER
**Capabilities:**
- View assigned shipments
- Share live location
- Update shipment status
- View tracking details

**Access:**
- Driver Dashboard
- Location update endpoints
- Own shipment details

### 3. COMPANY_OFFICER
**Capabilities:**
- Create shipments
- Assign drivers to shipments
- Edit shipment details
- Delete draft shipments
- View created shipments

**Access:**
- Company Officer Dashboard
- Shipment CRUD operations
- Driver assignment

### 4. CUSTOMER
**Capabilities:**
- Track shipments
- View real-time location
- See tracking history
- Receive updates

**Access:**
- Customer Dashboard
- Tracking endpoints (read-only)
- Own shipments only

### 5. ANALYST
**Capabilities:**
- View platform analytics
- Monitor delivery metrics
- Analyze shipment data
- Generate reports

**Access:**
- Analytics Dashboard
- Statistics endpoints
- All shipment data (read-only)

### 6. PORT_MANAGER
**Capabilities:**
- Similar to Company Officer
- Port/Hub specific

---

## Key API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/register
```

### Users
```
GET    /api/users                          (ADMIN)
GET    /api/users/role/{role}              (ADMIN)
POST   /api/users/{id}/assign-role         (ADMIN)
POST   /api/users/{id}/deactivate          (ADMIN)
POST   /api/users/{id}/activate            (ADMIN)
```

### Shipments
```
GET    /api/shipments/active
GET    /api/shipments/{id}
GET    /api/shipments/driver/{driverId}
GET    /api/shipments/{id}/tracking-history
POST   /api/shipments
PUT    /api/shipments/{id}
DELETE /api/shipments/{id}
POST   /api/shipments/location-update
```

---

## Common First Steps

### 1. Set Up Admin
```bash
# Register admin account via UI
# Assign ADMIN role via API
# Use admin account to manage platform
```

### 2. Create Locations
```bash
# Create at least 2 locations (origin/destination)
# Ports or distribution hubs
# Include accurate coordinates
```

### 3. Create Test Users
```bash
# Create Driver user
# Create Company Officer user
# Create Customer user
# Test each dashboard
```

### 4. Create Test Shipment
```bash
# Log in as Company Officer
# Create shipment with all details
# Assign driver
# Test tracking as customer
# Test location sharing as driver
```

---

## Troubleshooting

### Backend Connection Error
**Problem**: Frontend can't reach backend
```
Error: Failed to fetch
```

**Solution**:
1. Verify backend running: `curl http://localhost:8080/api/auth/login`
2. Check `API` variable in `frontend/src/context/AuthContext.jsx`
3. Should be: `http://localhost:8080`

### Token Expired
**Problem**: Getting 401 Unauthorized
```
Error: Unauthorized
```

**Solution**:
1. Clear localStorage: `localStorage.clear()`
2. Log in again
3. Tokens are valid for 24 hours by default

### Shipment Creation Fails
**Problem**: 400 Bad Request
```
Error: Origin location not found
```

**Solution**:
1. Create locations first
2. Use correct location UUIDs
3. Both origin and destination are required

### Live Location Not Working
**Problem**: Location sharing not updating
```
No updates in tracking history
```

**Solution**:
1. Check browser geolocation permissions
2. Device must have GPS capability
3. Shipment must be assigned to driver
4. Must be PENDING or IN_TRANSIT status

---

## Database Setup (If Needed)

### MySQL Commands
```bash
# Create database
mysql -u root -p
CREATE DATABASE track2act;
USE track2act;

# Application will auto-create tables on startup
```

### Alternative: Docker
```bash
# Run MySQL in Docker
docker run --name track2act-db -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=track2act -p 3306:3306 -d mysql:8.0
```

---

## File Structure Overview

```
track2act/
├── backend/                    # Spring Boot application
│   ├── src/main/java/
│   │   └── com/track2act/
│   │       ├── entity/        # JPA entities
│   │       ├── dto/           # Request/Response DTOs
│   │       ├── service/       # Business logic
│   │       ├── controller/    # API endpoints
│   │       └── repository/    # Database access
│   └── pom.xml
│
├── frontend/                   # React Vite application
│   ├── src/
│   │   ├── pages/            # Dashboard pages
│   │   ├── components/       # Reusable components
│   │   ├── context/          # Auth context
│   │   └── App.jsx           # Main app component
│   └── package.json
│
├── IMPLEMENTATION_SUMMARY.md  # Complete documentation
├── TESTING_GUIDE.md          # Detailed testing scenarios
└── QUICK_START.md           # This file
```

---

## Next Actions

1. **Set Up Development Environment**
   - [ ] Clone/download project
   - [ ] Install dependencies
   - [ ] Start both frontend and backend

2. **Create Test Data**
   - [ ] Create admin user
   - [ ] Create locations
   - [ ] Create test drivers/officers
   - [ ] Create shipments

3. **Test Each Role**
   - [ ] Log in as each role
   - [ ] Verify correct dashboard loads
   - [ ] Test role-specific features

4. **Test Full Workflow**
   - [ ] Company officer creates shipment
   - [ ] Admin assigns driver
   - [ ] Driver shares location
   - [ ] Customer tracks in real-time
   - [ ] Analyst views metrics

5. **Deploy to Production**
   - [ ] Set up production database
   - [ ] Configure environment variables
   - [ ] Enable HTTPS
   - [ ] Set up monitoring/logging

---

## Support

For detailed information:
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Testing Guide**: See `TESTING_GUIDE.md`
- **API Documentation**: Backend Swagger UI (if enabled)

For issues:
1. Check browser console (F12)
2. Check backend logs
3. Verify database connectivity
4. Clear cache and try again

---

## What's Different Now

### Before
- Single dashboard
- Basic shipment tracking
- Limited user roles
- No live location

### After  ✨
- 5 role-specific dashboards
- Real-time GPS tracking
- Complete shipment CRUD
- User management system
- Analytics & metrics
- Audit trails
- Production-ready code

**Happy Tracking!** 📍
