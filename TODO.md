# Modernize Role Dashboard UIs
Track2Act Frontend - Dashboard UI Standardization

## Task Overview
Make all 6 role dashboards (Admin, Driver, Customer, CompanyOfficer, Analyst, Port Manager) have **similar modern UI structure**:
- Gradient animated header (motion.div, text-4xl bg-gradient)
- Stats grid (4 motion Cards with icons/gradients like AdminDashboard)
- Main content with hovers/animations (motion.list/grid stagger)
- Consistent buttons (RefreshCw icons, variants)
- Features/buttons **role-specific** (no functional changes)

**Port Manager & Company Officer**: Enhance with more features/nav items like DashboardLayout.

Current: DashboardRouter.jsx renders raw components without Layout → add wrapping.

## Steps (Logical Breakdown from Plan)

### 1. ✅ Confirm Files & Routing (Done)
   - Files: AdminDashboard.jsx, AnalystDashboard.jsx, CompanyOfficerDashboard.jsx, CustomerDashboard.jsx, DriverDashboard.jsx
   - Note: Port_Manager uses CompanyOfficerDashboard.jsx
   - DashboardRouter.jsx: Wrap `<DashboardComponent />` in `<DashboardLayout>`

### 2. Update DashboardRouter.jsx (Priority 1)
   - Import DashboardLayout
   - Wrap: `<DashboardLayout><DashboardComponent /></DashboardLayout>`
   - Remove pt-20 bg-gray-50 (Layout handles)

### 3. Modernize Basic Dashboards (Parallel)
   | Role | File | Status | Changes |
   |------|------|--------|---------|
   | Driver | DriverDashboard.jsx | Basic → Modern | Gradient header, stats motion cards (Active/Pending/Delivered/Live), enhanced shipment cards w/ progress/hover |
   | Analyst | AnalystDashboard.jsx | Basic → Modern | Read first, add analytics stats (OTD%, Delays, etc.), charts placeholders |
   | Company Officer/Port Manager | CompanyOfficerDashboard.jsx | Basic → Modern | Gradient header, shipment mgmt stats, enhanced forms/buttons (NewShipment ref), nav links |
   | Admin | AdminDashboard.jsx | Modern → Consistent | Minor: Ensure header matches template |
   | Customer | CustomerDashboard.jsx | Modern → Consistent | Minor: Header/refresh consistency |

### 4. Read Remaining Files
   - `frontend/src/pages/dashboard/AnalystDashboard.jsx`
   - `frontend/src/pages/dashboard/CompanyOfficerDashboard.jsx`

### 5. Create Edits (edit_file multi-diffs)
   - DashboardRouter.jsx first
   - Then basics: Driver → Analyst → CompanyOfficer
   - Consistency: Admin/Customer if needed

### 6. Test & Complete
   - `cd frontend && npm run dev`
   - Verify all roles (login switch), responsive, no breaks
   - Update TODO progress
   - attempt_completion

## Progress
- [x] Analysis & Planning
- [x] Step 2: Router + Layout
- [x] DriverDashboard.jsx modernized
- [ ] Step 3: Continue modernizations (Analyst, CompanyOfficer, etc.)

- [ ] Step 6: Testing

**Next Action:** Modernize AnalystDashboard.jsx and CompanyOfficerDashboard.jsx (add stats/motions/gradients), then Admin/Customer consistency, test.

