# Track2Act - Setup & Testing Guide

## Quick Start (5 minutes)

### 1. Admin Account (Pre-configured)
```
Email: shivansh@admin.com
Password: 9820689183
Name: Shivansh
Role: ADMIN
```

### 2. Start the Application
```bash
# Terminal 1: Start Backend
cd backend
mvn spring-boot:run

# Terminal 2: Start Frontend
cd frontend
npm install
npm run dev
```

### 3. Access the Platform
```
Landing: http://localhost:5173/
Dashboard: http://localhost:5173/dashboard (after login)
Track Shipment: http://localhost:5173/track (public, no auth)
Support: http://localhost:5173/support (requires auth)
```

---

## Testing Scenarios

### Scenario 1: Customer Registration & Tracking

**Step 1: Sign Up as Customer**
- Go to http://localhost:5173/signup
- Enter:
  - Name: "John Doe"
  - Email: "john@example.com"
  - Password: "password123"
- Click "Sign Up"
- You'll be auto-assigned CUSTOMER role
- Redirected to dashboard

**Step 2: View Customer Dashboard**
- Dashboard shows all your shipments
- See tracking progress with animated bars
- Click on any shipment for detailed view
- View tracking history with GPS coordinates

**Step 3: Track Shipment Publicly (No Auth)**
- Go to http://localhost:5173/track
- Enter a tracking number (from your shipment)
- View real-time location and status
- No login required!

**Expected Result:**
✅ Customer can sign up, access dashboard, and track shipments

---

### Scenario 2: Admin Role Assignment

**Step 1: Login as Admin**
- Go to http://localhost:5173/login
- Email: shivansh@admin.com
- Password: 9820689183
- Click "Sign in"

**Step 2: Access User Management**
- On Admin Dashboard, find "User Management" section
- You should see the customer "John Doe" you created
- Click "Search" to find user

**Step 3: Assign Driver Role**
- Find John Doe in the list
- Click "Assign Role" button
- Select "DRIVER" from dropdown
- Click "Save"
- Success! User is now a DRIVER

**Step 4: Verify Role Change**
- Logout and login as John Doe again
- Dashboard changes to DRIVER Dashboard
- Can now see live tracking options

**Expected Result:**
✅ Admin can manage users and assign roles

---

### Scenario 3: Create & Track Shipment as Company Officer

**Step 1: Sign Up as Company Officer**
- Sign up with new credentials: "alice@logistics.com"
- Contact admin to assign role "COMPANY_OFFICER"

**Step 2: Logout, Login as Company Officer**
- Login with alice@logistics.com credentials
- Dashboard changes to Company Officer view

**Step 3: Create New Shipment**
- Click "Create Shipment" button
- Fill in details:
  - Cargo Type: "Electronics"
  - Weight: "5 kg"
  - Origin: "Mumbai"
  - Destination: "Delhi"
  - Receiver: "Bob Smith"
  - Receiver Contact: "+91-9999999999"
- Click "Create"

**Step 4: Verify Shipment Created**
- Shipment appears in dashboard
- Status: PENDING
- Can edit or delete

**Expected Result:**
✅ Company Officer can create and manage shipments

---

### Scenario 4: Driver Live Tracking

**Step 1: Assign Shipment to Driver**
- Login as COMPANY_OFFICER
- Create shipment
- In creation form, select a DRIVER from dropdown
- Create shipment
- Driver is notified

**Step 2: Login as Driver**
- Logout and login as the driver
- Driver Dashboard shows assigned shipments
- Click "Start Live Tracking"

**Step 3: Share Live Location**
- Driver clicks "Share Location"
- Enter GPS coordinates (or auto-detect)
- Submit
- Location updated in real-time

**Step 4: Customer Sees Live Update**
- Customer logs in to their dashboard
- Shipment shows updated progress
- Tracking history includes new location entry

**Expected Result:**
✅ Drivers can share location, customers see real-time updates

---

### Scenario 5: Support Ticket Creation

**Step 1: Create Support Ticket**
- Login as any authenticated user
- Go to /support
- Click "Report Issue" tab
- Select issue category: "Delayed Delivery"
- Fill in subject and description
- Click "Submit Support Ticket"

**Step 2: Verify Ticket**
- Success message appears
- Ticket should be visible in admin support section

**Expected Result:**
✅ Support system working for customer feedback

---

### Scenario 6: Complete Admin CRUD Operations

**Step 1: Create Shipment as Admin**
- Login as admin
- In admin dashboard, create a test shipment
- Status should be PENDING

**Step 2: Read/View**
- Click on shipment to view details
- See all tracking history
- View driver assignment

**Step 3: Update/Edit**
- Click "Edit" on shipment
- Change cargo type or destination
- Save changes
- Verify update

**Step 4: Delete**
- Click "Delete" on shipment
- Confirm deletion
- Shipment removed from system

**Expected Result:**
✅ Full CRUD operations working for admin

---

## API Testing

### Test with cURL

**1. Login & Get Token**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "shivansh@admin.com",
    "password": "9820689183"
  }'

# Response includes JWT token
# Save token for next requests
TOKEN="your-token-here"
```

**2. Get Shipments**
```bash
curl -X GET http://localhost:8080/api/shipments/active \
  -H "Authorization: Bearer $TOKEN"
```

**3. Create Shipment**
```bash
curl -X POST http://localhost:8080/api/shipments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "cargoType": "Books",
    "cargoWeight": 2.5,
    "originId": "550e8400-e29b-41d4-a716-446655440000",
    "destinationId": "550e8400-e29b-41d4-a716-446655440001",
    "customerName": "Jane Doe",
    "customerContact": "+91-9876543210",
    "receiverName": "John Receiver",
    "receiverContact": "+91-9876543211",
    "estimatedArrival": "2024-04-10T18:00:00"
  }'
```

**4. Update Shipment Location**
```bash
curl -X POST http://localhost:8080/api/shipments/location-update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "shipmentId": "550e8400-e29b-41d4-a716-446655440000",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "statusNote": "Arrived at Delhi Hub"
  }'
```

**5. Get User Management**
```bash
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer $TOKEN"
```

---

## Common Issues & Solutions

### Issue: "Shipment not found" when tracking
**Solution:** 
- Ensure shipment was created with proper tracking number
- Tracking number format: TRK followed by timestamp
- Check shipment exists in database

### Issue: Driver location not updating
**Solution:**
- Ensure driver is assigned to shipment
- Driver must be logged in to share location
- Check browser geolocation permissions
- Verify API endpoint is reachable

### Issue: Role change not reflecting immediately
**Solution:**
- Refresh page or logout/login
- Clear browser cache
- Token might be cached; logout to invalidate

### Issue: Signup showing validation error
**Solution:**
- Password must be at least 6 characters
- Email must be valid format
- Name cannot be empty
- All fields are required

---

## Performance Testing

### Load Test (Simulate Multiple Users)
```bash
# Using Apache Bench
ab -n 100 -c 10 http://localhost:5173/track

# Using wrk
wrk -t4 -c100 -d30s http://localhost:8080/api/shipments/active
```

### Expected Performance
- Page Load: < 2 seconds
- API Response: < 500ms
- Tracking Update: < 1 second
- Admin Dashboard: < 3 seconds (large datasets)

---

## Browser Compatibility

Tested on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Chrome/Safari

---

## Checklist: Feature Verification

- [ ] Landing page loads
- [ ] Signup works, user auto-assigned CUSTOMER
- [ ] Login works with correct credentials
- [ ] Public tracking works without authentication
- [ ] Customer dashboard shows shipments
- [ ] Support page works for authenticated users
- [ ] Admin can view user management
- [ ] Admin can assign roles
- [ ] Company officer can create shipments
- [ ] Driver can see assigned shipments
- [ ] Location updates work
- [ ] Tracking history displays correctly
- [ ] Responsive design works on mobile
- [ ] Navbar navigation works
- [ ] Logout functionality works

---

## Database Seeding

To add sample data:

```bash
# Run SQL script in MySQL
mysql -u root -p track2act < scripts/seed-data.sql
```

Sample data includes:
- 5 Locations (cities)
- 10 Sample shipments
- 3 Pre-configured users

---

## Debugging Tips

### Enable Console Logs
```javascript
// In browser console
localStorage.setItem('DEBUG', 'true')
// Now all API calls will log
```

### Check Auth Token
```javascript
// In browser console
console.log(localStorage.getItem('token'))
```

### Network Inspector
- Open Browser DevTools (F12)
- Go to Network tab
- Watch API calls
- Check response headers for JWT token

---

## Next Steps

After verification:
1. Deploy to staging environment
2. Run performance tests
3. Security audit
4. User acceptance testing
5. Production deployment

For detailed documentation, see **ENTERPRISE_GUIDE.md**
