# Track2Act Platform - Testing Guide

## Setup Instructions

### Prerequisites
- Java 11+ and Maven installed
- Node.js 16+ installed
- MySQL 8.0+ running
- Postman or similar API testing tool (optional)

### Backend Setup

1. **Database Setup**
```bash
mysql -u root -p
CREATE DATABASE track2act;
USE track2act;
-- Run migrations from application.yml (ddl-auto: update will handle it)
```

2. **Backend Launch**
```bash
cd backend
mvn clean install
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

3. **Create Sample Data** (via API)
```bash
# Create some locations first (required for shipments)
# These would typically be set up through admin panel

# Location 1: Mumbai Port
POST /api/locations
{
  "name": "Mumbai Port",
  "type": "PORT",
  "latitude": 19.0760,
  "longitude": 72.8777
}

# Location 2: Delhi Hub
POST /api/locations
{
  "name": "Delhi Hub",
  "type": "HUB",
  "latitude": 28.7041,
  "longitude": 77.1025
}
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Start Dev Server**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

---

## Testing Scenarios

### Scenario 1: Admin User Management

#### Create Admin Account
1. Go to http://localhost:5173/signup
2. Sign up with:
   - Name: Admin User
   - Email: admin@track2act.com
   - Password: Admin@123
3. Backend should assign CUSTOMER role by default

#### Assign Admin Role via API
```bash
curl -X POST http://localhost:8080/api/users/{userId}/assign-role \
  -H "Authorization: Bearer {adminToken}" \
  -H "Content-Type: application/json" \
  -d '{"role": "ADMIN"}'
```

#### Test Admin Dashboard
1. Log in as admin
2. Verify admin dashboard loads
3. Test user search functionality
4. Test role assignment dropdown
5. Test user activation/deactivation buttons

---

### Scenario 2: Driver Live Location Tracking

#### Create Driver Account
1. Sign up as normal user
2. Assign DRIVER role via admin dashboard

#### Test Live Location Sharing
1. Log in as driver
2. Go to Driver Dashboard
3. Select a shipment
4. Click "Share Location" button
5. Browser should request geolocation permission
6. Verify location updates in real-time:
   - Check console for coordinate logs
   - Verify API calls to `/api/shipments/location-update`
   - Check shipment progress increases

#### Verify Tracking History
1. Switch to customer dashboard
2. View the same shipment's tracking history
3. Verify all location updates appear chronologically

---

### Scenario 3: Company Officer Shipment Management

#### Create Company Officer Account
1. Sign up as new user
2. Assign COMPANY_OFFICER role via admin

#### Create Shipment
1. Log in as company officer
2. Click "Create Shipment" on Company Officer Dashboard
3. Fill in form:
   - Cargo Type: Electronics
   - Cargo Weight: 50
   - Cargo Description: Laptop shipment
   - Origin ID: {uuid of Mumbai Port}
   - Destination ID: {uuid of Delhi Hub}
   - Customer Name: John Doe
   - Customer Contact: 9876543210
   - Receiver Name: Jane Smith
   - Receiver Contact: 9876543211
   - Estimated Arrival: 2024-12-31T18:00
4. Click "Create Shipment"
5. Verify success notification

#### Edit Shipment
1. Click "Edit" on created shipment
2. Modify cargo description
3. Assign a driver from dropdown
4. Save changes
5. Verify status updates

#### Delete Shipment
1. Click "Delete" on a shipment
2. Confirm deletion dialog
3. Verify shipment removed from list

---

### Scenario 4: Customer Tracking

#### Create Customer Account
1. Sign up as regular user (defaults to CUSTOMER)
2. Log in

#### View Active Shipments
1. Customer Dashboard shows active shipments
2. Verify filtering works (shows only PENDING, IN_TRANSIT, DELAYED)
3. Click on shipment card to view details

#### Real-Time Tracking
1. Select a shipment with DRIVER that's sharing location
2. View progress bar updating
3. Check tracking history appearing in real-time
4. Verify coordinates and timestamps

#### Tracking Timeline
1. Click shipment details
2. Scroll through tracking history
3. Verify all location updates listed chronologically
4. Check timestamps are correct
5. Verify coordinates make sense geographically

---

### Scenario 5: Analyst Dashboard

#### Create Analyst Account
1. Sign up as user
2. Assign ANALYST role via admin

#### View Analytics
1. Log in as analyst
2. Verify dashboard statistics load:
   - Total Shipments count
   - On Time percentage
   - Delayed count
   - Average Progress
3. Test status distribution chart displays correctly
4. Verify recent shipments list updates

#### Test Metrics
1. Create test shipments with different statuses
2. Verify analytics update accordingly
3. Test percentage calculations
4. Check recent shipments display latest entries

---

## API Testing with Curl

### User Management

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@track2act.com","password":"Admin@123"}'

# Get all users (admin only)
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/users

# Get users by role
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/users/role/DRIVER

# Assign role
curl -X POST http://localhost:8080/api/users/{userId}/assign-role \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"role":"DRIVER","phoneNumber":"9876543210"}'

# Deactivate user
curl -X POST http://localhost:8080/api/users/{userId}/deactivate \
  -H "Authorization: Bearer {token}"
```

### Shipment Management

```bash
# Create shipment
curl -X POST http://localhost:8080/api/shipments \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "cargoType":"Electronics",
    "cargoWeight":50,
    "cargoDescription":"Laptop",
    "originId":"uuid-here",
    "destinationId":"uuid-here",
    "customerName":"John",
    "customerContact":"9876543210",
    "receiverName":"Jane",
    "receiverContact":"9876543211",
    "estimatedArrival":"2024-12-31T18:00:00"
  }'

# Get active shipments
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/shipments/active

# Get driver's shipments
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/shipments/driver/{driverId}

# Update location (driver)
curl -X POST http://localhost:8080/api/shipments/location-update \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "shipmentId":"uuid-here",
    "latitude":28.7041,
    "longitude":77.1025,
    "statusNote":"On the way"
  }'

# Get tracking history
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/shipments/{shipmentId}/tracking-history
```

---

## Expected Test Results

### Successful Outcomes
✅ User can register and defaults to CUSTOMER role
✅ Admin can assign roles to users
✅ Each role sees correct dashboard
✅ Drivers can share live location
✅ Location updates create tracking records
✅ Customers see real-time tracking
✅ Company officers can manage shipments
✅ Analytics display correct metrics
✅ Role-based access control works
✅ Unauthorized users redirected properly

### Common Issues & Solutions

**Issue**: Login fails
- **Solution**: Verify backend is running on port 8080
- **Solution**: Check token in localStorage
- **Solution**: Verify database has users table

**Issue**: Location sharing not working
- **Solution**: Check browser geolocation permissions
- **Solution**: Verify shipment is assigned to driver
- **Solution**: Check browser console for errors

**Issue**: Shipments not appearing
- **Solution**: Verify locations exist in database
- **Solution**: Check shipment status (must be PENDING, IN_TRANSIT, or DELAYED)
- **Solution**: Verify user has correct role

**Issue**: Tracking history empty
- **Solution**: Verify location updates were sent
- **Solution**: Check TrackingUpdate table has records
- **Solution**: Verify shipment ID is correct

---

## Performance Testing

### Load Testing Script (Optional)
```bash
# Create 100 shipments
for i in {1..100}; do
  curl -X POST http://localhost:8080/api/shipments \
    -H "Authorization: Bearer {token}" \
    -H "Content-Type: application/json" \
    -d '{"cargoType":"Test-'$i'","cargoWeight":'$i',...}'
done

# Load test with Apache Bench
ab -n 1000 -c 10 -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/shipments/active
```

---

## Security Testing

### Password Security
- [ ] Test with weak passwords (should reject)
- [ ] Test with special characters
- [ ] Verify passwords are hashed in database

### Role-Based Access
- [ ] Customer cannot access admin APIs
- [ ] Driver cannot access company officer APIs
- [ ] Non-admin cannot assign roles
- [ ] Deactivated users cannot login

### Data Privacy
- [ ] Users can only see their own shipments (except admin)
- [ ] Drivers cannot see other drivers' shipments
- [ ] API returns 403 for unauthorized access

---

## Troubleshooting

### Backend Won't Start
```bash
# Clear Maven cache
mvn clean

# Check Java version
java -version

# Check port 8080
lsof -i :8080
```

### Frontend Won't Start
```bash
# Clear node modules
rm -rf node_modules
npm install

# Check npm version
npm -v

# Check port 5173
lsof -i :5173
```

### Database Connection Issues
```bash
# Verify MySQL running
mysql -u root -p -e "SELECT 1"

# Check database exists
mysql -u root -p -e "USE track2act; SHOW TABLES;"
```

---

## Next Steps After Testing

1. **Production Deployment**
   - Set up proper database
   - Configure HTTPS
   - Set strong JWT secret
   - Enable CORS properly

2. **Data Migration**
   - Migrate existing shipments
   - Assign roles to existing users
   - Create location records for ports/hubs

3. **Monitoring**
   - Set up error logging
   - Monitor API performance
   - Track user activity

4. **User Training**
   - Provide documentation
   - Create user guides per role
   - Set up support system

---

## Conclusion

This testing guide covers all major features and scenarios. Follow each step carefully to ensure the platform is working as expected before deploying to production.
