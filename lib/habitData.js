// C Prompt Solutions Pvt Ltd – Complete Habit Data
// Source: Cprompt_Habit_Tracker.xlsx (ALL 165 habits, all departments)

export const COMPANY = {
  name: "C Prompt Solutions Pvt Ltd",
  short: "CPrompt",
  tagline: "Finance & Operations Team Tracker"
};

export const TEAM_MEMBERS = [
  // ── Inventory Team ──────────────────────────────────────────────────────────
  { uid: "CP-001", name: "Laxman Sharma",  role: "INVENTORY_MGR",  dept: "Inventory",   color: "#059669", password: "cprompt123" },
  { uid: "CP-002", name: "Laxman Ambati",  role: "INVENTORY_EXEC", dept: "Inventory",   color: "#10b981", password: "cprompt123" },
  { uid: "CP-003", name: "Aryan Sharma",   role: "INVENTORY_EXEC", dept: "Inventory",   color: "#34d399", password: "cprompt123" },
  { uid: "CP-004", name: "Prasanth",       role: "SUPPORT_ENG",    dept: "Support",     color: "#3b82f6", password: "cprompt123" },
  { uid: "CP-005", name: "Manoj",          role: "SUPPORT_MGR",    dept: "Support",     color: "#6366f1", password: "cprompt123" },
  { uid: "CP-006", name: "Satish",         role: "SUPPORT_ENG",    dept: "Support",     color: "#8b5cf6", password: "cprompt123" },
  { uid: "CP-007", name: "Kiran",          role: "QC_EXEC",        dept: "QC",          color: "#ec4899", password: "cprompt123" },
  // ── F&A / Finance Team (Real Names) ──────────────────────────────────────
  { uid: "CP-PRD1", name: "Pradeep",  role: "FINANCE_HEAD",    dept: "F&A", color: "#1d4ed8", canAssign: true,  assignTo: ["CP-SH01","CP-MN01","CP-MSW1","CP-VSW1","CP-AB01","CP-MOD1"], password: "cprompt123" },
  { uid: "CP-SH01", name: "Shashi",   role: "BILLING_SPEC",    dept: "F&A", color: "#2563eb", canAssign: true,  assignTo: ["CP-MN01","CP-MSW1"], password: "cprompt123" },
  { uid: "CP-MN01", name: "Mounika",  role: "BILLING_EXEC",    dept: "F&A", color: "#7c3aed", canAssign: false, assignTo: [], password: "cprompt123" },
  { uid: "CP-MSW1", name: "M Swathi", role: "BILLING_EXEC",    dept: "F&A", color: "#a855f7", canAssign: false, assignTo: [], password: "cprompt123" },
  { uid: "CP-VSW1", name: "V Swathi", role: "COLLECTION_EXEC", dept: "F&A", color: "#0891b2", canAssign: false, assignTo: [], password: "cprompt123" },
  { uid: "CP-AB01", name: "Abhishek", role: "COLLECTION_EXEC", dept: "F&A", color: "#0284c7", canAssign: false, assignTo: [], password: "cprompt123" },
  { uid: "CP-MOD1", name: "Modi",     role: "TAXATION_EXEC",   dept: "F&A", color: "#059669", canAssign: false, assignTo: [], password: "cprompt123" },
  // ── CRM Team ─────────────────────────────────────────────────────────────
  { uid: "CP-CRM1", name: "CRM Executive",              role: "CRM_EXEC",         dept: "CRM",       color: "#ef4444", password: "cprompt123" },
  { uid: "CP-CRM2", name: "Collection Executive",       role: "COLLECTION_EXEC",  dept: "CRM",       color: "#f97316", password: "cprompt123" },
  { uid: "CP-CRM3", name: "Calling Executive",          role: "CALLING_EXEC",     dept: "CRM",       color: "#f59e0b", password: "cprompt123" },
  // ── Sales & Delivery ──────────────────────────────────────────────────────
  { uid: "CP-SAL1", name: "Sales Executive",            role: "SALES_EXEC",       dept: "Sales",     color: "#06b6d4", password: "cprompt123" },
  { uid: "CP-SAL2", name: "Sales Manager",              role: "SALES_MGR",        dept: "Sales",     color: "#0ea5e9", password: "cprompt123" },
  { uid: "CP-DEL1", name: "Delivery Executive",         role: "DELIVERY_EXEC",    dept: "Delivery",  color: "#84cc16", password: "cprompt123" },
  { uid: "CP-DEL2", name: "Delivery Manager",           role: "DELIVERY_MGR",     dept: "Delivery",  color: "#65a30d", password: "cprompt123" },
  // ── Purchase ─────────────────────────────────────────────────────────────
  { uid: "CP-PR01", name: "Purchase Executive",         role: "PURCHASE_EXEC",    dept: "Purchase",  color: "#d97706", password: "cprompt123" },
  // ── Operations & IT ──────────────────────────────────────────────────────
  { uid: "CP-OPS1", name: "Operations Manager",         role: "OPS_MANAGER",      dept: "Operations",color: "#dc2626", password: "cprompt123" },
  { uid: "CP-IT01", name: "IT Executive",               role: "IT_EXEC",          dept: "IT/Admin",  color: "#475569", password: "cprompt123" },
  // ── Admin / Director ─────────────────────────────────────────────────────
  { uid: "CP-ADM1", name: "Admin / Director",           role: "ADMIN",            dept: "Management",color: "#1e3a8a", password: "cprompt123" },
];

export const DEPT_COLORS = {
  "F&A":         { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", dot: "#3b82f6" },
  "Purchase":    { bg: "#fffbeb", border: "#fde68a", text: "#b45309", dot: "#f59e0b" },
  "Inventory":   { bg: "#ecfdf5", border: "#a7f3d0", text: "#065f46", dot: "#10b981" },
  "CRM":         { bg: "#fef2f2", border: "#fecaca", text: "#991b1b", dot: "#ef4444" },
  "Sales":       { bg: "#ecfeff", border: "#a5f3fc", text: "#0e7490", dot: "#06b6d4" },
  "Delivery":    { bg: "#f7fee7", border: "#bbf7d0", text: "#166534", dot: "#84cc16" },
  "Support":     { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", dot: "#3b82f6" },
  "QC":          { bg: "#fdf4ff", border: "#f5d0fe", text: "#86198f", dot: "#ec4899" },
  "Operations":  { bg: "#fff7ed", border: "#fed7aa", text: "#c2410c", dot: "#f97316" },
  "IT/Admin":    { bg: "#f8fafc", border: "#e2e8f0", text: "#334155", dot: "#475569" },
  "Management":  { bg: "#f5f3ff", border: "#ddd6fe", text: "#4c1d95", dot: "#8b5cf6" },
};

export const FREQUENCY_META = {
  "Daily":           { color: "#3b82f6", bg: "#eff6ff", label: "Daily",     icon: "🔁" },
  "Weekly":          { color: "#10b981", bg: "#ecfdf5", label: "Weekly",    icon: "📅" },
  "Fortnightly":     { color: "#f59e0b", bg: "#fffbeb", label: "15 Days",   icon: "🗓️" },
  "Monthly":         { color: "#8b5cf6", bg: "#f5f3ff", label: "Monthly",   icon: "📆" },
  "Monthly ":        { color: "#8b5cf6", bg: "#f5f3ff", label: "Monthly",   icon: "📆" },
  "Quarterly":       { color: "#ef4444", bg: "#fef2f2", label: "Quarterly", icon: "🏛️" },
  "Yearly":          { color: "#6b7280", bg: "#f9fafb", label: "Yearly",    icon: "🎯" },
  "When Delayed":    { color: "#f97316", bg: "#fff7ed", label: "On Delay",  icon: "⚠️" },
  "As Required":     { color: "#ec4899", bg: "#fdf2f8", label: "As Reqd",   icon: "🔔" },
  "Daily (Until Closure)": { color: "#3b82f6", bg: "#eff6ff", label: "Until Close", icon: "🔁" },
};

export const STATUS_CONFIG = {
  "Done ✅":    { color: "#16a34a", bg: "#dcfce7", border: "#86efac", emoji: "✅", short: "Done" },
  "Partial 🔶": { color: "#ca8a04", bg: "#fef9c3", border: "#fde047", emoji: "🔶", short: "Partial" },
  "Pending ⏳": { color: "#dc2626", bg: "#fee2e2", border: "#fca5a5", emoji: "⏳", short: "Pending" },
  "N/A ➖":      { color: "#6b7280", bg: "#f1f5f9", border: "#cbd5e1", emoji: "➖", short: "N/A" },
};

export const STATUS_OPTIONS = Object.keys(STATUS_CONFIG);

// ─── ALL HABITS BY ROLE ────────────────────────────────────────────────────────

export const HABITS = {

  // ════════════════════════════════════════════════════════════════════════════
  // INVENTORY
  // ════════════════════════════════════════════════════════════════════════════

  INVENTORY_EXEC: [
    { id:"INV01", habit:"Perform daily physical & system stock check", frequency:"Daily", sop:"Inventory", uom:"Asset Batch", priority:"high" },
    { id:"INV02", habit:"Update inventory for new assets Purchased within 24 hrs", frequency:"Daily", sop:"Inventory", uom:"Per GRN", priority:"high" },
    { id:"INV03", habit:"Prepare Challan for each asset Inward or Outward Movement", frequency:"Daily", sop:"Inventory", uom:"Serial Entry", priority:"high" },
    { id:"INV04", habit:"Update asset status after return QC / Support as per Category A, B, C, D", frequency:"Daily", sop:"Inventory", uom:"System Entry", priority:"high" },
    { id:"INV05", habit:"Record Quality Check / Upgrade / Repair details in software (Service History, Battery/RAM changes)", frequency:"Weekly", sop:"Inventory", uom:"Per Asset", priority:"medium" },
    { id:"INV06", habit:"Store assets in library-style format for easy traceability & proper protection for Durability of the assets", frequency:"Daily", sop:"Inventory", uom:"Per Asset", priority:"medium" },
    { id:"INV07", habit:"Reconcile & Update Stock Software with inventory changes (Quantity/Value) 5 days before billing cycle", frequency:"Monthly", sop:"Ticketing", uom:"Per Cycle", priority:"high" },
  ],

  INVENTORY_MGR: [
    { id:"IVM01", habit:"Reconcile physical stock with system records. Highlight overload situation and ask for additional support if required. Circulate weekly report every Saturday for Assets in Stock based on category", frequency:"Weekly", sop:"Inventory", uom:"Per Audit", priority:"high" },
    { id:"IVM02", habit:"Maintain Physical Register for all assets moving In/Out of storage (Gate Pass) using security appointed", frequency:"Daily", sop:"Inventory", uom:"Per Movement", priority:"medium" },
    { id:"IVM03", habit:"At the end of the day, one round to ensure that the assets like charger, mouse given for Quality or Support Check are returned back to Inventory", frequency:"Daily", sop:"Inventory", uom:"Per Internal Issue", priority:"high" },
    { id:"IVM04", habit:"Prioritize issuance of laptops that are currently under warranty & A Category", frequency:"Daily", sop:"Inventory", uom:"Per Asset", priority:"high" },
    { id:"IVM05", habit:"Release upcoming warranty expiry report 2 months in advance to Support for Addressing warranty claim issues proactively (D-Category Laptops)", frequency:"Monthly", sop:"Inventory", uom:"Per Asset", priority:"high" },
    { id:"IVM06", habit:"Sales Price Estimation and Rental recovery to be calculated based on request received from Management", frequency:"Weekly", sop:"Inventory", uom:"Per Asset", priority:"medium" },
    { id:"IVM07", habit:"Prepare for Audit by External Agency", frequency:"Monthly", sop:"Inventory", uom:"Per Asset", priority:"medium" },
    { id:"IVM08", habit:"Highlight overload situation and ask for additional support if required", frequency:"Weekly", sop:"Inventory", uom:"Per Review", priority:"medium" },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  // QC
  // ════════════════════════════════════════════════════════════════════════════

  QC_EXEC: [
    { id:"QC01", habit:"Verify asset condition using checklist (Pre-delivery / Post Receipt)", frequency:"Daily", sop:"QC", uom:"Per Asset", priority:"high" },
    { id:"QC02", habit:"Record damages noticed during internal checks into Stock Software or by sharing information with Inventory / Support team", frequency:"Daily", sop:"QC", uom:"Per Asset", priority:"high" },
    { id:"QC03", habit:"Test returned devices & record findings and raise request for back charging if asset outside Warranty to stakeholders – Sales, Inventory, CRM & Finance", frequency:"Daily", sop:"QC", uom:"Asset Count", priority:"high" },
    { id:"QC04", habit:"Decide refurbishment / Scrap / sale / A, B, C & D category and give Input to Inventory", frequency:"Weekly", sop:"QC", uom:"Per Asset", priority:"high" },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  // SUPPORT
  // ════════════════════════════════════════════════════════════════════════════

  SUPPORT_ENG: [
    { id:"SUP01", habit:"Prepare systems as per customer requirement given in Ticketing System Full Kit Information Sheet", frequency:"Daily", sop:"New Order Processing", uom:"Per Asset", priority:"high" },
    { id:"SUP02", habit:"Document photos of refurbished systems (Top, Bottom, Keyboard, Screen, System Info)", frequency:"Daily", sop:"New Order Processing", uom:"Per Asset", priority:"medium" },
    { id:"SUP03", habit:"Send laptops for OEM repair for stock assets under warranty prior to warranty expiry", frequency:"Daily", sop:"Support", uom:"Per Asset", priority:"high" },
    { id:"SUP04", habit:"Provide initial response on technical issues to CRM within SLA", frequency:"Daily", sop:"Support", uom:"Per Ticket", priority:"high" },
    { id:"SUP05", habit:"Track resolution process and update CRM on every ticket raised", frequency:"Daily", sop:"Support", uom:"Per Ticket", priority:"high" },
    { id:"SUP06", habit:"Maintain 200–400 Assets ready in stock per month", frequency:"Weekly", sop:"Support", uom:"Per Asset", priority:"high" },
  ],

  SUPPORT_MGR: [
    { id:"SMG01", habit:"Identify chronic issues and root causes for systemic correction", frequency:"Monthly", sop:"Support", uom:"Per Issue Type", priority:"high" },
    { id:"SMG02", habit:"Provide training to Staff on Chronic Issues, New Products etc. and maintain training record for Staff. Also develop appropriate training material", frequency:"Monthly", sop:"Support", uom:"Per Issue Type", priority:"medium" },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  // F&A
  // ════════════════════════════════════════════════════════════════════════════

  FINANCE_EXEC: [
    { id:"FEX01", habit:"Physical visit & camp at customer place if payment not released after repeated calls (3 missed payment promises)", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"high" },
  ],

  FA_EXEC_BILLING: [
    { id:"FAB01", habit:"Check Billing Reminder Sheet / Software (Download Customer Master Report) every Saturday to plan upcoming week's invoicing and review open tickets. Communicate to Customer through CRM for Invoice Delays due to Active Ticket issues", frequency:"Weekly", sop:"Billing", uom:"Per Sheet", priority:"high" },
    { id:"FAB02", habit:"Obtain Customer confirmation for amendments in billing (Rental Value/Qty changes) by raising proforma Invoice, prior to raising invoice", frequency:"Daily", sop:"Billing", uom:"Per Billing Cycle", priority:"high" },
    { id:"FAB03", habit:"Generate invoices as per billing reminder plan", frequency:"Daily", sop:"Billing", uom:"Per Billing Cycle", priority:"high" },
    { id:"FAB04", habit:"Obtain Finance Head approval on 100% Invoice before sending", frequency:"Daily", sop:"Billing", uom:"Per Invoice", priority:"high" },
    { id:"FAB05", habit:"Create Invoice in Accounting System (Tally and Stock Software)", frequency:"Daily", sop:"Billing", uom:"Per Invoice", priority:"medium" },
    { id:"FAB06", habit:"Send invoice to customer as per the email format for 100% customers", frequency:"Daily", sop:"Billing", uom:"Per Invoice", priority:"high" },
    { id:"FAB07", habit:"Generate Delay Payment Report for customers defaulting >3 consecutive months and share with Directors", frequency:"Monthly", sop:"Billing", uom:"Per Report", priority:"high" },
    { id:"FAB08", habit:"Reconcile bank statements & Issue receipts upon payment (Thanks Acknowledgement)", frequency:"Daily", sop:"Billing", uom:"Per Receipt", priority:"medium" },
    { id:"FAB09", habit:"Reconcile customer ledgers (Amount and Qty)", frequency:"Quarterly", sop:"Billing", uom:"Account Set", priority:"medium" },
    { id:"FAB10", habit:"Enter/Verify Order details (PO, Asset Serial Nos, Billing Dates) in Stock Software", frequency:"Daily", sop:"New Order Processing", uom:"Per Order", priority:"high" },
    { id:"FAB11", habit:"Define Billing Cycles (Monthly/Quarterly) in system", frequency:"Weekly", sop:"New Order Processing", uom:"Per Customer", priority:"medium" },
    { id:"FAB12", habit:"Decide & set invoice frequency (Monthly / Quarterly / Pro-rata) on rental schedule receipt", frequency:"Weekly", sop:"New Order Processing", uom:"Per Customer", priority:"medium" },
    { id:"FAB13", habit:"Check these 3 billing parameters for every new order: Advance/End, Frequency, Start date", frequency:"Weekly", sop:"New Order Processing", uom:"Per Order", priority:"high" },
    { id:"FAB14", habit:"Confirm quantity & rate change closure before 3rd week of Billing Cycle", frequency:"Weekly", sop:"Ticketing", uom:"Per Billing Cycle", priority:"high" },
    { id:"FAB15", habit:"Raise separate invoice for Back Charges (Short supply/Damage) after internal confirmation from Sales and information sent to client for confirmation", frequency:"Daily", sop:"Returns", uom:"Per Incidence", priority:"medium" },
  ],

  FA_EXEC_AR: [
    { id:"FAR01", habit:"Update Software with payment receipt details", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"high" },
    { id:"FAR02", habit:"Generate Over Due Collections Report and proactively share with Collections Team", frequency:"Weekly", sop:"Collection", uom:"Per Customer", priority:"high" },
    { id:"FAR03", habit:"Track revenue generated per asset, Track expense per asset, Conduct Profitability/Break-Even Analysis for assets", frequency:"Monthly", sop:"Finance", uom:"Per Asset Batch", priority:"medium" },
    { id:"FAR04", habit:"Maintain daily bookkeeping records and expense tracking", frequency:"Daily", sop:"Finance", uom:"Per Day", priority:"high" },
    { id:"FAR05", habit:"Prepare revenue generated per asset, Expense per asset, Profitability/Break-Even Analysis for assets and give feedback to Sales Head, Directors", frequency:"Fortnightly", sop:"Finance", uom:"Per Asset Batch", priority:"medium" },
  ],

  FA_MANAGER: [
    { id:"FAM01", habit:"Randomly Review invoice accuracy (Qty / Rate / GST)", frequency:"Daily", sop:"Billing", uom:"Invoice Count", priority:"high" },
    { id:"FAM02", habit:"Review 100% of Invoice where tickets raised with either Qty or pricing changes before invoicing", frequency:"Daily", sop:"Billing", uom:"Per Account", priority:"high" },
    { id:"FAM03", habit:"Resolve issues of Grey category customers and get agreement from customer finance counterpart. Convert Grey customers to Cyan", frequency:"Weekly", sop:"Collection", uom:"Per Grey Customer", priority:"high" },
    { id:"FAM04", habit:"Analyse revenue generated per asset, Expense per asset, Profitability/Break-Even Analysis for assets and give feedback to Sales Head, Directors", frequency:"Monthly", sop:"Finance", uom:"Per Asset Batch", priority:"medium" },
    { id:"FAM05", habit:"Track validity of Warranty and trigger renewal reminders along with Justification based on Revenue generated per asset", frequency:"Monthly", sop:"Finance", uom:"Per Agreement", priority:"medium" },
    { id:"FAM06", habit:"Review and Maintain Calendar for Routine Payments – electricity, mobile, AMC, servicing of Movable assets like EV etc. and ensure payments are made as per calendar or usage", frequency:"Weekly", sop:"Finance", uom:"Per Billing Cycle", priority:"high" },
    { id:"FAM07", habit:"Prepare Annual Expense Capex Budget for the Year in February", frequency:"Yearly", sop:"Finance", uom:"Per Year", priority:"high" },
    { id:"FAM08", habit:"Analyse Budget V/s Actual Expense for defined parameters like repair, travel, interest, capex purchases etc.", frequency:"Monthly", sop:"Finance", uom:"Per Category", priority:"high" },
    { id:"FAM09", habit:"Track closure of Rental Accounts and communicate revenue impact to management and Sales Head", frequency:"Monthly", sop:"Finance", uom:"Per Category", priority:"medium" },
  ],

  FINANCE_MANAGER: [
    { id:"FMG01", habit:"Ensure latest PO, KYC Documents, Rental Agreement & Rental Schedule are always available in common repository for every order/amendment", frequency:"Weekly", sop:"Operations", uom:"Per Review", priority:"high" },
    { id:"FMG02", habit:"Verify correct billing frequency is defined in Billing Date Calculator / Stock Software for every new order / amendment", frequency:"Weekly", sop:"Operations", uom:"Per Order", priority:"high" },
    { id:"FMG03", habit:"Weekly review report on "Timely Invoices Released" and check Billing Date Calculator sheet", frequency:"Weekly", sop:"Operations", uom:"Per Report", priority:"high" },
    { id:"FMG04", habit:"100% maker-checker verification on new orders / amendments / returns / replacements (quantity, dates, challans, software updation)", frequency:"Daily", sop:"Operations", uom:"Per Change", priority:"high" },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  // CRM
  // ════════════════════════════════════════════════════════════════════════════

  COLLECTION_EXEC: [
    { id:"COL01", habit:"Maintain the Calling Calendar, right person to contact and make call for each client as per calendar and overdue amount. Follow the 80/20 rule", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"high" },
    { id:"COL02", habit:"Call Yellow category customers every 15 days", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"high" },
    { id:"COL03", habit:"Call Red category customers every 3 days", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"high" },
    { id:"COL04", habit:"Call Black / Purple / Cyan category customers daily", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"high" },
    { id:"COL05", habit:"Maintain last call reminder sheet and record the discussions date wise", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"high" },
    { id:"COL06", habit:"Evaluate customer relationships & risk before aggressive follow-up for collection recovery", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"medium" },
    { id:"COL07", habit:"Track payment status in system", frequency:"Daily", sop:"Collection", uom:"Per Invoice", priority:"high" },
    { id:"COL08", habit:"Explain consequences of non-payment (higher charges, interest, legal, credit rating)", frequency:"When Delayed", sop:"Collection", uom:"Per Customer", priority:"medium" },
    { id:"COL09", habit:"Fix one permanent calling time/day for each customer (e.g., every Monday 11 am)", frequency:"Weekly", sop:"Collection", uom:"Per Customer", priority:"medium" },
  ],

  CALLING_EXEC: [
    { id:"CAL01", habit:"Identify all stakeholders & map exact payment workflow inside customer organisation (right person to be contacted)", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"high" },
    { id:"CAL02", habit:"Find out customer's fixed weekly payment release day and feed into CRM after 1 or 2 months of Customer Onboarding", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"high" },
    { id:"CAL03", habit:"Use standard call script & record details (introduction → invoice reminder → due date → next steps → Discussion Notes)", frequency:"Daily", sop:"Collection", uom:"Per Call", priority:"high" },
    { id:"CAL04", habit:"Maintain complete communication trail (emails, call logs, visit records) for Black/Red customers", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"high" },
    { id:"CAL05", habit:"Insist on 2 payments in the same month whenever dues are pending for few months (Ongoing + Due Payment)", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"high" },
    { id:"CAL06", habit:"Focus first on top 20% value customers for collections for making the collection plan", frequency:"Weekly", sop:"Collection", uom:"Per Review", priority:"high" },
    { id:"CAL07", habit:"Ensure that the team has made calls as per the calling calendar and discussion records for each call have been recorded", frequency:"Weekly", sop:"Collection", uom:"Per Review", priority:"high" },
  ],

  CRM_EXEC: [
    { id:"CRM01", habit:"Close billing-related open tickets before 3rd week of the billing month", frequency:"Daily", sop:"Billing", uom:"Per Cycle", priority:"high" },
    { id:"CRM02", habit:"Acknowledge customer complaints via email/phone immediately prior to raising ticket. Collect all full kit details for raising ticket", frequency:"Daily", sop:"Customer Complaints", uom:"Per Complaint", priority:"high" },
    { id:"CRM03", habit:"Communicate finding/next steps to customer regarding complaint", frequency:"Daily", sop:"Customer Complaints", uom:"Per Update", priority:"high" },
    { id:"CRM04", habit:"Request feedback from customer after complaint resolution", frequency:"Daily", sop:"Customer Complaints", uom:"Per Ticket", priority:"medium" },
    { id:"CRM05", habit:"Collect Feedback at defined stages (Post-Order, Delivery, Mid-Rental, End-Rental)", frequency:"Daily", sop:"Customer Feedback", uom:"Per Stage", priority:"high" },
    { id:"CRM06", habit:"Update all customer stakeholder details in CRM/Stock Software upon order receipt. Capture contact nos for CEO, Finance head, IT head, Purchase Head etc.", frequency:"Daily", sop:"New Order Processing", uom:"Per Customer", priority:"high" },
    { id:"CRM07", habit:"Maintain folder structure for documentation", frequency:"Daily", sop:"New Order Processing", uom:"Document Set", priority:"medium" },
    { id:"CRM08", habit:"Ensure For new customers: KYC Documents, PO stored in server/Software, Rental Agreement duly signed and Onboarding email sent to customer", frequency:"Daily", sop:"New Order Processing", uom:"Per Customer", priority:"high" },
    { id:"CRM09", habit:"Verify Full Kit (Contact, Time, Authority, Dismantling, Packing) before scheduling dispatch", frequency:"Daily", sop:"New Order Processing", uom:"Per Dispatch", priority:"high" },
    { id:"CRM10", habit:"Send Order Confirmation email with Rental Agreement to customer", frequency:"Daily", sop:"New Order Processing", uom:"Per Order", priority:"high" },
    { id:"CRM11", habit:"Provide Alias Name to new branches of existing customers in system", frequency:"Daily", sop:"New Order Processing", uom:"Per Customer", priority:"medium" },
    { id:"CRM12", habit:"Prepare Rental Agreement based on Customer Category and get Legal/internal clearance", frequency:"Daily", sop:"New Order Processing", uom:"Per Contract", priority:"high" },
    { id:"CRM13", habit:"Prepare Rental Agreement and get it signed before asset dispatch", frequency:"Daily", sop:"New Order Processing", uom:"Per Contract", priority:"high" },
    { id:"CRM14", habit:"Check Return Window Guidelines (e.g., before 15th) before accepting return request", frequency:"Daily", sop:"Returns", uom:"Per Request", priority:"high" },
    { id:"CRM15", habit:"Send Return Confirmation email with Billing Stoppage Date & Pickup Window", frequency:"Daily", sop:"Returns", uom:"Per Request", priority:"high" },
    { id:"CRM16", habit:"Raise separate invoice for Back Charges (Short supply/Damage) after internal confirmation from Sales and information sent to client for confirmation", frequency:"Daily", sop:"Returns", uom:"Per Incidence", priority:"medium" },
    { id:"CRM17", habit:"Send pre-return PPT/Instructions to customer for taking photos of assets (Top, Bottom, Screen, etc.)", frequency:"Daily", sop:"Returns", uom:"Per Return", priority:"medium" },
    { id:"CRM18", habit:"Check backlog workload before confirming delivery dates to customer", frequency:"Daily", sop:"Ticketing", uom:"Per Order", priority:"high" },
    { id:"CRM19", habit:"Raise tickets for customer requests (billing/asset issues/returns/replacements/new requirements)", frequency:"Daily", sop:"Ticketing", uom:"Per Ticket", priority:"high" },
    { id:"CRM20", habit:"Check Full Kit before assigning tasks", frequency:"Daily", sop:"Ticketing", uom:"Per Ticket", priority:"high" },
    { id:"CRM21", habit:"Assign sub-tasks based on priority", frequency:"Daily", sop:"Ticketing", uom:"Per Ticket", priority:"medium" },
    { id:"CRM22", habit:"Conduct morning ticket assignment meeting (10:30 am) – review closure of yesterday's task and discuss new ticket assignments", frequency:"Daily", sop:"Ticketing", uom:"Per Meeting", priority:"high" },
    { id:"CRM23", habit:"Review Active/Waiting/Completed tickets", frequency:"Weekly", sop:"Ticketing", uom:"Ticket Review Batch", priority:"medium" },
    { id:"CRM24", habit:"Close billing-related open points before billing end period so that Invoice can be raised", frequency:"Weekly", sop:"Ticketing", uom:"Per Billing Cycle", priority:"high" },
    { id:"CRM25", habit:"Get customer confirmation email for asset returns", frequency:"Daily", sop:"Ticketing", uom:"Per Asset", priority:"high" },
    { id:"CRM26", habit:"Ensure billing stoppage date agreed while accepting returns", frequency:"Daily", sop:"Ticketing", uom:"Per Asset", priority:"high" },
    { id:"CRM27", habit:"Send return confirmation email & pickup window", frequency:"Daily", sop:"Ticketing", uom:"Per Asset", priority:"high" },
    { id:"CRM28", habit:"Maintain discrepancy documentation from delivery team", frequency:"Daily", sop:"Ticketing", uom:"Per Pickup", priority:"medium" },
    { id:"CRM29", habit:"Log complaint & acknowledge to customer", frequency:"Daily", sop:"Ticketing", uom:"Per Ticket", priority:"high" },
    { id:"CRM30", habit:"Communicate updates to customer on complaint status", frequency:"Daily (Until Closure)", sop:"Ticketing", uom:"Per Complaint", priority:"high" },
    { id:"CRM31", habit:"Take complaint resolution confirmation", frequency:"Daily", sop:"Ticketing", uom:"Per Ticket", priority:"medium" },
    { id:"CRM32", habit:"Request feedback after complaint closure", frequency:"Daily", sop:"Ticketing", uom:"Per Ticket", priority:"medium" },
    { id:"CRM33", habit:"Alias name creation for multi-branch customers", frequency:"Daily", sop:"Ticketing", uom:"Per Customer", priority:"low" },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  // SALES
  // ════════════════════════════════════════════════════════════════════════════

  SALES_EXEC: [
    { id:"SAE01", habit:"Check real-time inventory availability in Stock Software while sitting with customer", frequency:"Daily", sop:"New Order Processing", uom:"Per Order", priority:"high" },
    { id:"SAE02", habit:"Check inventory availability for requested models/quantities with Inventory Team and lock / release the requirement", frequency:"Daily", sop:"New Order Processing", uom:"Per Order", priority:"high" },
    { id:"SAE03", habit:"Share Full Kit information, PO, KYC Docs, Lease Start Date, Qty, Rate etc. as per format decided to CRM for creating Tickets", frequency:"Daily", sop:"New Order Processing", uom:"Per Order", priority:"high" },
    { id:"SAE04", habit:"Raise Indent for new laptops if stock is unavailable (post Director approval)", frequency:"Daily", sop:"New Order Processing", uom:"Per Indent", priority:"medium" },
    { id:"SAE05", habit:"Obtain Customer's signature on Rental Contract", frequency:"Daily", sop:"New Order Processing", uom:"Per Contract", priority:"high" },
    { id:"SAE06", habit:"Review Rental Expiry Report to identify contracts expiring in next 2 months", frequency:"Monthly", sop:"Sales", uom:"Per Report", priority:"high" },
  ],

  SALES_MGR: [
    { id:"SAM01", habit:"If 3 times customer promises for payments have failed, ensure physical visit and signing of MOM and collection of PDC from customer", frequency:"Weekly", sop:"Collection", uom:"Per Review", priority:"high" },
    { id:"SAM02", habit:"Prepare & Share Weekly Collection Plan to Stakeholders and Check Actual Collection of Last week wrt to plan", frequency:"Weekly", sop:"Collection", uom:"Per Review", priority:"high" },
    { id:"SAM03", habit:"Evaluate long-term relationship & possible negative fallout before aggressive follow-up and inform to CRM", frequency:"Weekly", sop:"Collection", uom:"Per Customer", priority:"medium" },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  // DELIVERY
  // ════════════════════════════════════════════════════════════════════════════

  DELIVERY_EXEC: [
    { id:"DEL01", habit:"Create route plan from tickets workload", frequency:"Daily", sop:"Delivery", uom:"Route Plan", priority:"high" },
    { id:"DEL02", habit:"Document discrepancies with signature during Pickup (Local)", frequency:"Daily", sop:"Delivery", uom:"Per Pickup", priority:"high" },
    { id:"DEL03", habit:"Communicate to Customer through CRM, if customer not available for Pickup, or if assets serial nos not as per the Inward Challan", frequency:"Daily", sop:"Delivery", uom:"Per Pickup", priority:"high" },
    { id:"DEL04", habit:"Communicate to Customer through CRM, if Assets received in damaged conditions by sharing photos (Local – immediately at pickup, Outstation – immediately upon receipt)", frequency:"Daily", sop:"Delivery", uom:"Per Pickup", priority:"high" },
    { id:"DEL05", habit:"Send notification emails to customer at different stages of Pickup/Delivery through CRM team", frequency:"Daily", sop:"Delivery", uom:"Per Stage", priority:"medium" },
    { id:"DEL06", habit:"Verify ID and obtain signature on Delivery Challan / LR Receipt / Courier Docket Receipt / POD", frequency:"Daily", sop:"New Order Processing", uom:"Per Delivery", priority:"high" },
  ],

  DELIVERY_MGR: [
    { id:"DEM01", habit:"Ensure Delivery / Pickup assets as per serial numbers provided in Ticketing Information", frequency:"Daily", sop:"Delivery", uom:"Per Pickup", priority:"high" },
    { id:"DEM02", habit:"Track pending pickups for replacement laptops and ensure they are picked up in reasonable time provided to customer (max 7 days)", frequency:"Daily", sop:"Delivery", uom:"Per Pickup", priority:"high" },
    { id:"DEM03", habit:"Review the Courier partner delivery performance and deduct payment based on color Orange and Red", frequency:"Daily", sop:"Delivery", uom:"Per Delivery", priority:"medium" },
    { id:"DEM04", habit:"Ensure Pending pickups / Backlog orders are closed within reasonable time", frequency:"Weekly", sop:"Delivery", uom:"Per Pickup", priority:"high" },
    { id:"DEM05", habit:"Report discrepancies/short supplies during pickup to CRM/Inventory immediately upon receiving the information", frequency:"Daily", sop:"Returns", uom:"Per Pickup", priority:"high" },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  // PURCHASE
  // ════════════════════════════════════════════════════════════════════════════

  PURCHASE_EXEC: [
    { id:"PUR01", habit:"Place purchase order for new assets only after Director-approved indent", frequency:"Daily", sop:"New Order Processing", uom:"Per Purchase", priority:"high" },
    { id:"PUR02", habit:"Attach bid tab (for new vendor or new products) for approvals to PO", frequency:"Daily", sop:"Purchase", uom:"Document Set", priority:"high" },
    { id:"PUR03", habit:"Take Approval / Digital Signature as per Approval Matrix", frequency:"Daily", sop:"Purchase", uom:"Document Set", priority:"high" },
    { id:"PUR04", habit:"Perform Bid Tab comparison (3 quotes) for new items or new vendors", frequency:"Daily", sop:"Purchase", uom:"Per Quote Set", priority:"high" },
    { id:"PUR05", habit:"Submit Vendor Invoices & Challans to Accounts for payment (Submit documents as per Full Kit for Payment Release)", frequency:"Daily", sop:"Purchase", uom:"Per Invoice", priority:"high" },
    { id:"PUR06", habit:"Rate Vendor Performance (Delivery/Quality)", frequency:"Daily", sop:"Purchase", uom:"Per PO", priority:"medium" },
    { id:"PUR07", habit:"Update/Review Procurement Dashboard", frequency:"Weekly", sop:"Purchase", uom:"Per Dashboard", priority:"medium" },
    { id:"PUR08", habit:"Track Vendor Payments and Release plan to Finance for Upcoming vendor pending payments", frequency:"Weekly", sop:"Purchase", uom:"Per Dashboard", priority:"high" },
    { id:"PUR09", habit:"Review Warranty Expiry date of purchased items for extension decisions and share with Stakeholders", frequency:"Weekly", sop:"Purchase", uom:"Per Asset Batch", priority:"medium" },
    { id:"PUR10", habit:"Update Price List of frequently purchased items and create master with last purchase date", frequency:"Monthly", sop:"Purchase", uom:"Per List", priority:"medium" },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  // OPERATIONS MANAGER
  // ════════════════════════════════════════════════════════════════════════════

  OPS_MANAGER: [
    { id:"OPS01", habit:"Daily end-of-day update from CRM ticketing system on workload", frequency:"Daily", sop:"Operations", uom:"Per EOD Update", priority:"high" },
    { id:"OPS02", habit:"Weekly review open tickets, ageing, workload trends & unresolved tickets", frequency:"Weekly", sop:"Operations", uom:"Per Review", priority:"high" },
    { id:"OPS03", habit:"Ensure no ticket once started is ever halted. Priority can change only in waiting list", frequency:"Daily", sop:"Operations", uom:"Per Incident", priority:"high" },
    { id:"OPS04", habit:"Attend weekly Operations Review without fail (even while on OD)", frequency:"Weekly", sop:"Operations", uom:"Per Meeting", priority:"high" },
    { id:"OPS05", habit:"Review all reports one day before weekly meeting & come prepared with focus areas", frequency:"Weekly", sop:"Operations", uom:"Per Meeting", priority:"high" },
    { id:"OPS06", habit:"Quarterly review Key Parameters Sheet for risk profile, bad-debt reserves, inventory ageing", frequency:"Quarterly", sop:"Operations", uom:"Per Quarter", priority:"high" },
    { id:"OPS07", habit:"After any problem, conduct separate root-cause meeting using 5-Why technique & update SOP", frequency:"Weekly", sop:"Operations", uom:"Per Incident", priority:"medium" },
    { id:"OPS08", habit:"Ensure Sales does not over-commit delivery dates beyond actual Support/Inventory capacity", frequency:"Weekly", sop:"Operations", uom:"Per Commitment", priority:"high" },
    { id:"OPS09", habit:"Issue Concern Card after 3+ repeated SOP violations by same person", frequency:"Weekly", sop:"Operations", uom:"Per Violation", priority:"medium" },
    { id:"OPS10", habit:"Monthly Analyse all Negative Tickets (Asset Returns, Replacements, Working Issues, Billing errors, etc.) and develop CAPA", frequency:"Monthly", sop:"Customer Complaints", uom:"Per Ticket", priority:"high" },
    { id:"OPS11", habit:"Periodically review & update all SOPs for relevance", frequency:"Quarterly", sop:"Operations", uom:"Per Review", priority:"medium" },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  // IT / ADMIN
  // ════════════════════════════════════════════════════════════════════════════

  IT_EXEC: [
    { id:"IT001", habit:"Review gaps and Ensure staff training on Stock Software / updates", frequency:"Fortnightly", sop:"Software", uom:"Per Update", priority:"high" },
    { id:"IT002", habit:"Perform regular software backups before major updates", frequency:"As Required", sop:"Software", uom:"Per Update", priority:"high" },
    { id:"IT003", habit:"Perform regular Audits for data entry across all departments: Customer Data, Documents, Billing, Pricing, Inventory Stock, Payment Tracking, Returns, and Software Updates", frequency:"Fortnightly", sop:"Software", uom:"Per Update", priority:"high" },
  ],

  // ════════════════════════════════════════════════════════════════════════════
  // ADMIN / DIRECTOR
  // ════════════════════════════════════════════════════════════════════════════

  ADMIN: [
    { id:"ADM01", habit:"Review all team EOD reports and highlight critical issues", frequency:"Daily", sop:"Management", uom:"Per Review", priority:"high" },
    { id:"ADM02", habit:"Weekly Operations Review Meeting – attend, review, document action items", frequency:"Weekly", sop:"Operations", uom:"Per Meeting", priority:"high" },
    { id:"ADM03", habit:"Personally approve any rare exception/violation of SOP (in writing & signed)", frequency:"Daily", sop:"Operations", uom:"Per Exception", priority:"high" },
    { id:"ADM04", habit:"Before approving purchase of new assets, verify lead is genuinely Hot with customer confirmation", frequency:"Daily", sop:"Operations", uom:"Per Purchase", priority:"high" },
    { id:"ADM05", habit:"Treat Stock Software as single source of truth. Never accept Excel data for inventory/stock", frequency:"Daily", sop:"Operations", uom:"Always", priority:"high" },
    { id:"ADM06", habit:"Quarterly review Key Parameters Sheet for risk profile, bad-debt reserves, revenue & sales metrics", frequency:"Quarterly", sop:"Operations", uom:"Per Quarter", priority:"high" },
    { id:"ADM07", habit:"Review F&A team collection efficiency and billing accuracy", frequency:"Weekly", sop:"Management", uom:"Per Review", priority:"high" },
    { id:"ADM08", habit:"Verify monthly receipts include Purple/Red recovery along with current payments", frequency:"Monthly", sop:"Operations", uom:"Per Month", priority:"high" },
  ],
};

// ─── NEW FINANCE TEAM ROLES ────────────────────────────────────────────────────

// Pradeep — Finance Head (sees everything, manages all)
HABITS.FINANCE_HEAD = [
  { id:"FH001", habit:"Review billing accuracy — check invoices raised by Mounika & M Swathi", frequency:"Daily", sop:"Billing", uom:"Per Review", priority:"high" },
  { id:"FH002", habit:"Review collection status — check Abhishek & V Swathi follow-ups", frequency:"Daily", sop:"Collection", uom:"Per Review", priority:"high" },
  { id:"FH003", habit:"Attend billing & collection team meeting", frequency:"Weekly", sop:"Operations", uom:"Per Meeting", priority:"high" },
  { id:"FH004", habit:"Resolve CRM escalations related to billing or collection", frequency:"Daily", sop:"Customer Complaints", uom:"Per Issue", priority:"high" },
  { id:"FH005", habit:"Review overdue customer list and take action on Red / Purple accounts", frequency:"Weekly", sop:"Collection", uom:"Per Review", priority:"high" },
  { id:"FH006", habit:"Assign & track tasks for entire F&A team", frequency:"Daily", sop:"Management", uom:"Per Assignment", priority:"high" },
  { id:"FH007", habit:"100% maker-checker on new orders, amendments, returns", frequency:"Daily", sop:"Operations", uom:"Per Change", priority:"high" },
  { id:"FH008", habit:"Weekly review report on Timely Invoices Released", frequency:"Weekly", sop:"Operations", uom:"Per Report", priority:"high" },
];

// Shashi — Billing Specialist (assigns to Mounika & M Swathi, handles escalations)
HABITS.BILLING_SPEC = [
  { id:"BS001", habit:"Review and plan week's billing schedule every Saturday", frequency:"Weekly", sop:"Billing", uom:"Per Sheet", priority:"high" },
  { id:"BS002", habit:"Assign billing tasks to Mounika & M Swathi based on customer allocation", frequency:"Daily", sop:"Billing", uom:"Per Assignment", priority:"high" },
  { id:"BS003", habit:"Resolve customer billing disputes and escalations", frequency:"Daily", sop:"Billing", uom:"Per Issue", priority:"high" },
  { id:"BS004", habit:"Customer meeting for billing issue resolution", frequency:"As Required", sop:"Billing", uom:"Per Meeting", priority:"medium" },
  { id:"BS005", habit:"Customer visit for billing or collection purpose", frequency:"As Required", sop:"Collection", uom:"Per Visit", priority:"medium" },
  { id:"BS006", habit:"Internal banking transactions (rare)", frequency:"As Required", sop:"Banking", uom:"Per Transaction", priority:"low" },
  { id:"BS007", habit:"Obtain Finance Head approval on invoices before sending", frequency:"Daily", sop:"Billing", uom:"Per Invoice", priority:"high" },
  { id:"BS008", habit:"Verify billing parameters for every new order: Advance/End, Frequency, Start date", frequency:"Weekly", sop:"New Order Processing", uom:"Per Order", priority:"high" },
  { id:"BS009", habit:"Check open billing tickets and expedite closure before 3rd week of billing month", frequency:"Weekly", sop:"Ticketing", uom:"Per Cycle", priority:"high" },
];

// Mounika & M Swathi — Billing Executives (own allocated customers)
HABITS.BILLING_EXEC = [
  { id:"BE001", habit:"Generate invoices for allocated customers as per billing reminder plan", frequency:"Daily", sop:"Billing", uom:"Per Invoice", priority:"high" },
  { id:"BE002", habit:"Obtain customer confirmation for billing amendments (Rental Value/Qty changes)", frequency:"Daily", sop:"Billing", uom:"Per Billing Cycle", priority:"high" },
  { id:"BE003", habit:"Create invoice in Tally and Stock Software", frequency:"Daily", sop:"Billing", uom:"Per Invoice", priority:"high" },
  { id:"BE004", habit:"Send invoice to customer as per email format", frequency:"Daily", sop:"Billing", uom:"Per Invoice", priority:"high" },
  { id:"BE005", habit:"Reconcile bank statements & issue payment receipts (Thanks Acknowledgement)", frequency:"Daily", sop:"Billing", uom:"Per Receipt", priority:"medium" },
  { id:"BE006", habit:"Enter/Verify Order details (PO, Asset Serial Nos, Billing Dates) in Stock Software", frequency:"Daily", sop:"New Order Processing", uom:"Per Order", priority:"high" },
  { id:"BE007", habit:"Check billing date calculator for allocated customers every Saturday", frequency:"Weekly", sop:"Billing", uom:"Per Sheet", priority:"high" },
  { id:"BE008", habit:"Confirm quantity & rate change closure before 3rd week of Billing Cycle", frequency:"Weekly", sop:"Ticketing", uom:"Per Billing Cycle", priority:"high" },
  { id:"BE009", habit:"Generate Delay Payment Report for defaulting customers (>3 months) — share with Shashi", frequency:"Monthly", sop:"Billing", uom:"Per Report", priority:"high" },
  { id:"BE010", habit:"Reconcile customer ledgers (Amount and Qty)", frequency:"Quarterly", sop:"Billing", uom:"Account Set", priority:"medium" },
];

// V Swathi & Abhishek — Collection Executives
HABITS.COLLECTION_EXEC = [
  { id:"CE001", habit:"Call allocated customers as per calling calendar and follow 80/20 rule", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"high" },
  { id:"CE002", habit:"Call Yellow category customers every 15 days", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"high" },
  { id:"CE003", habit:"Call Red category customers every 3 days", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"high" },
  { id:"CE004", habit:"Call Black / Purple / Cyan category customers daily", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"high" },
  { id:"CE005", habit:"Update payment receipts in software", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"high" },
  { id:"CE006", habit:"Maintain last call reminder sheet with discussion notes date-wise", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"high" },
  { id:"CE007", habit:"Resolve billing vs collection mismatches for allocated customers", frequency:"Daily", sop:"Billing", uom:"Per Issue", priority:"high" },
  { id:"CE008", habit:"Customer visit for amount collection (when required)", frequency:"As Required", sop:"Collection", uom:"Per Visit", priority:"medium" },
  { id:"CE009", habit:"Prepare & share Weekly Collection Plan to Pradeep", frequency:"Weekly", sop:"Collection", uom:"Per Review", priority:"high" },
  { id:"CE010", habit:"Manage & report collection meeting outcomes to management", frequency:"Weekly", sop:"Collection", uom:"Per Meeting", priority:"medium" },
  { id:"CE011", habit:"Track overdue amount customer-wise and flag to Pradeep", frequency:"Weekly", sop:"Collection", uom:"Per Report", priority:"high" },
];

// Modi — Taxation & Accounts Executive
HABITS.TAXATION_EXEC = [
  { id:"TX001", habit:"GST filing — prepare and submit monthly GST returns", frequency:"Monthly", sop:"Taxation", uom:"Per Filing", priority:"high" },
  { id:"TX002", habit:"TDS calculation and deposit before due date", frequency:"Monthly", sop:"Taxation", uom:"Per Filing", priority:"high" },
  { id:"TX003", habit:"PF / PT / ESI payment and filing", frequency:"Monthly", sop:"Taxation", uom:"Per Filing", priority:"high" },
  { id:"TX004", habit:"Internal audit — review entries and flag discrepancies", frequency:"Monthly", sop:"Audit", uom:"Per Audit", priority:"high" },
  { id:"TX005", habit:"Add purchase invoice to system when received", frequency:"Daily", sop:"Purchase", uom:"Per Invoice", priority:"high" },
  { id:"TX006", habit:"Bank loan EMI payment as per schedule", frequency:"Monthly", sop:"Banking", uom:"Per Payment", priority:"high" },
  { id:"TX007", habit:"Vendor payment processing and entry in system", frequency:"Daily", sop:"Banking", uom:"Per Payment", priority:"high" },
  { id:"TX008", habit:"Incoming payment entry in system", frequency:"Daily", sop:"Banking", uom:"Per Entry", priority:"high" },
  { id:"TX009", habit:"Bank reconciliation — match system entries with bank statement", frequency:"Weekly", sop:"Banking", uom:"Per Account", priority:"high" },
  { id:"TX010", habit:"Prepare and submit TDS returns quarterly", frequency:"Quarterly", sop:"Taxation", uom:"Per Filing", priority:"high" },
  { id:"TX011", habit:"Annual audit preparation — compile all documents", frequency:"Yearly", sop:"Audit", uom:"Per Year", priority:"high" },
];
