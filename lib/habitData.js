// C Prompt Solutions Pvt Ltd – Complete Habit Data
// All Departments from Cprompt_Habit_Tracker.xlsx

export const COMPANY = {
  name: "C Prompt Solutions Pvt Ltd",
  short: "CPrompt",
  tagline: "Finance & Operations Team Tracker"
};

export const TEAM_MEMBERS = [
  // ── Inventory Team (names from Excel: Sheet1) ──────────────────────────────
  { uid: "CP-INV1", name: "Laxman Sharma",  role: "INVENTORY_MGR",  dept: "Inventory", color: "#059669" },
  { uid: "CP-INV2", name: "Laxman Ambati",  role: "INVENTORY_EXEC", dept: "Inventory", color: "#10b981" },
  { uid: "CP-INV3", name: "Aryan Sharma",   role: "INVENTORY_EXEC", dept: "Inventory", color: "#34d399" },
  { uid: "CP-INV4", name: "Prasanth",       role: "INVENTORY_EXEC", dept: "Inventory", color: "#6ee7b7" },
  { uid: "CP-INV5", name: "Manoj",          role: "INVENTORY_EXEC", dept: "Inventory", color: "#a7f3d0" },

  // ── F&A Team (add real names below when available) ─────────────────────────
  { uid: "CP-FA01", name: "F&A Executive – Billing",     role: "FA_EXEC_BILLING",  dept: "F&A", color: "#3b82f6" },
  { uid: "CP-FA02", name: "F&A Executive – Collection",  role: "FA_EXEC_AR",       dept: "F&A", color: "#6366f1" },
  { uid: "CP-FA03", name: "F&A Manager",                 role: "FA_MANAGER",       dept: "F&A", color: "#8b5cf6" },
  { uid: "CP-FM01", name: "Finance Manager",             role: "FINANCE_MANAGER",  dept: "F&A", color: "#a855f7" },

  // ── Other Departments ──────────────────────────────────────────────────────
  { uid: "CP-PR01", name: "Purchase Executive",  role: "PURCHASE_EXEC",  dept: "Purchase",    color: "#f59e0b" },
  { uid: "CP-CRM1", name: "CRM Executive",       role: "CRM_EXEC",       dept: "CRM",         color: "#ef4444" },
  { uid: "CP-OPS1", name: "Operations Manager",  role: "OPS_MANAGER",    dept: "Operations",  color: "#f97316" },

  // ── Support & QC (names from Excel: Habit_master) ─────────────────────────
  { uid: "CP-SUP1", name: "Satish",  role: "INVENTORY_EXEC", dept: "Support", color: "#0ea5e9" },
  { uid: "CP-QC01", name: "Kiran",   role: "INVENTORY_EXEC", dept: "QC",      color: "#ec4899" },

  // ── Admin / Director ───────────────────────────────────────────────────────
  { uid: "CP-ADM1", name: "Admin / Director",    role: "ADMIN",          dept: "Management",  color: "#1e3a8a" },
];

export const DEPT_COLORS = {
  "F&A":         { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", dot: "#3b82f6" },
  "Purchase":    { bg: "#fffbeb", border: "#fde68a", text: "#b45309", dot: "#f59e0b" },
  "Inventory":   { bg: "#ecfdf5", border: "#a7f3d0", text: "#065f46", dot: "#10b981" },
  "CRM":         { bg: "#fef2f2", border: "#fecaca", text: "#991b1b", dot: "#ef4444" },
  "Operations":  { bg: "#fff7ed", border: "#fed7aa", text: "#c2410c", dot: "#f97316" },
  "Management":  { bg: "#f5f3ff", border: "#ddd6fe", text: "#4c1d95", dot: "#8b5cf6" },
};

export const FREQUENCY_META = {
  "Daily":        { color: "#3b82f6", bg: "#eff6ff", label: "Daily", icon: "🔁" },
  "Weekly":       { color: "#10b981", bg: "#ecfdf5", label: "Weekly", icon: "📅" },
  "Fortnightly":  { color: "#f59e0b", bg: "#fffbeb", label: "15 Days", icon: "🗓️" },
  "Monthly":      { color: "#8b5cf6", bg: "#f5f3ff", label: "Monthly", icon: "📆" },
  "Quarterly":    { color: "#ef4444", bg: "#fef2f2", label: "Quarterly", icon: "🏛️" },
  "Yearly":       { color: "#6b7280", bg: "#f9fafb", label: "Yearly", icon: "🎯" },
  "When Delayed": { color: "#f97316", bg: "#fff7ed", label: "On Delay", icon: "⚠️" },
  "As Required":  { color: "#ec4899", bg: "#fdf2f8", label: "As Reqd", icon: "🔔" },
};

export const STATUS_CONFIG = {
  "Done ✅":     { color: "#16a34a", bg: "#dcfce7", border: "#86efac", emoji: "✅", short: "Done" },
  "Partial 🔶":  { color: "#ca8a04", bg: "#fef9c3", border: "#fde047", emoji: "🔶", short: "Partial" },
  "Pending ⏳":  { color: "#dc2626", bg: "#fee2e2", border: "#fca5a5", emoji: "⏳", short: "Pending" },
  "N/A ➖":       { color: "#6b7280", bg: "#f1f5f9", border: "#cbd5e1", emoji: "➖", short: "N/A" },
};

export const STATUS_OPTIONS = Object.keys(STATUS_CONFIG);

// ─── ALL HABITS BY ROLE ────────────────────────────────────────────────────────

export const HABITS = {

  FA_EXEC_BILLING: [
    { id:"FAB01", habit:"Check Billing Reminder Sheet / Software every Saturday to plan upcoming week's invoicing", frequency:"Weekly", sop:"Billing", uom:"Per Sheet", priority:"high" },
    { id:"FAB02", habit:"Obtain customer confirmation for amendments in billing (Rental Value/Qty changes) by raising proforma invoice before actual invoice", frequency:"Daily", sop:"Billing", uom:"Per Billing Cycle", priority:"high" },
    { id:"FAB03", habit:"Generate invoices as per billing reminder plan", frequency:"Daily", sop:"Billing", uom:"Per Billing Cycle", priority:"high" },
    { id:"FAB04", habit:"Obtain Finance Head approval on 100% Invoice before sending", frequency:"Daily", sop:"Billing", uom:"Per Invoice", priority:"high" },
    { id:"FAB05", habit:"Create Invoice in Accounting System (Tally and Stock Software)", frequency:"Daily", sop:"Billing", uom:"Per Invoice", priority:"medium" },
    { id:"FAB06", habit:"Send invoice to customer as per the email format for 100% customers", frequency:"Daily", sop:"Billing", uom:"Per Invoice", priority:"high" },
    { id:"FAB07", habit:"Generate Delay Payment Report for customers defaulting >3 consecutive months and share with Directors", frequency:"Monthly", sop:"Billing", uom:"Per Report", priority:"high" },
    { id:"FAB08", habit:"Reconcile bank statements & Issue receipts upon payment (Thanks Acknowledgement)", frequency:"Daily", sop:"Billing", uom:"Per Receipt", priority:"medium" },
    { id:"FAB09", habit:"Reconcile customer ledgers (Amount and Qty)", frequency:"Quarterly", sop:"Billing", uom:"Account Set", priority:"medium" },
    { id:"FAB10", habit:"Enter/Verify Order details (PO, Asset Serial Nos, Billing Dates) in Stock Software", frequency:"Daily", sop:"New Order Processing", uom:"Per Order", priority:"high" },
    { id:"FAB11", habit:"Define Billing Cycles (Monthly/Quarterly) in system", frequency:"Weekly", sop:"New Order Processing", uom:"Per Customer", priority:"medium" },
    { id:"FAB12", habit:"Check 3 billing parameters for every new order: Advance/End, Frequency, Start date", frequency:"Weekly", sop:"New Order Processing", uom:"Per Order", priority:"high" },
    { id:"FAB13", habit:"Confirm quantity & rate change closure before 3rd week of Billing Cycle", frequency:"Weekly", sop:"Ticketing", uom:"Per Billing Cycle", priority:"high" },
    { id:"FAB14", habit:"Raise separate invoice for Back Charges (Short supply/Damage) after internal confirmation", frequency:"Daily", sop:"Returns", uom:"Per Incidence", priority:"medium" },
    { id:"FAB15", habit:"Close billing-related open tickets before 3rd week of the billing month", frequency:"Daily", sop:"Billing", uom:"Per Cycle", priority:"high" },
  ],

  FA_EXEC_AR: [
    { id:"FAR01", habit:"Update Software with payment receipt details", frequency:"Daily", sop:"Collection", uom:"Per Customer", priority:"high" },
    { id:"FAR02", habit:"Generate Over Due Collections Report and proactively share with Collections Team", frequency:"Weekly", sop:"Collection", uom:"Per Customer", priority:"high" },
    { id:"FAR03", habit:"Resolve issues of Grey category customers. Convert Grey customers to Cyan", frequency:"Weekly", sop:"Collection", uom:"Per Grey Customer", priority:"high" },
    { id:"FAR04", habit:"Track revenue generated per asset, Track expense per asset, Conduct Profitability/Break-Even Analysis", frequency:"Monthly", sop:"Finance", uom:"Per Asset Batch", priority:"medium" },
    { id:"FAR05", habit:"Maintain daily bookkeeping records and expense tracking", frequency:"Daily", sop:"Finance", uom:"Per Day", priority:"high" },
    { id:"FAR06", habit:"Prepare revenue/expense/profitability per asset and give feedback to Sales Head, Directors", frequency:"Fortnightly", sop:"Finance", uom:"Per Asset Batch", priority:"medium" },
    { id:"FAR07", habit:"Reconcile bank statements & Issue receipts upon payment", frequency:"Daily", sop:"Billing", uom:"Per Receipt", priority:"high" },
  ],

  FA_MANAGER: [
    { id:"FAM01", habit:"Randomly Review invoice accuracy (Qty / Rate / GST)", frequency:"Daily", sop:"Billing", uom:"Invoice Count", priority:"high" },
    { id:"FAM02", habit:"Review 100% of Invoices where tickets raised with Qty or pricing changes before invoicing", frequency:"Daily", sop:"Billing", uom:"Per Account", priority:"high" },
    { id:"FAM03", habit:"Resolve issues of Grey category customers. Convert Grey to Cyan", frequency:"Weekly", sop:"Collection", uom:"Per Grey Customer", priority:"high" },
    { id:"FAM04", habit:"Analyse revenue/expense/profitability per asset and give feedback to Directors", frequency:"Monthly", sop:"Finance", uom:"Per Asset Batch", priority:"medium" },
    { id:"FAM05", habit:"Track validity of Warranty and trigger renewal reminders based on Revenue per asset", frequency:"Monthly", sop:"Finance", uom:"Per Agreement", priority:"medium" },
    { id:"FAM06", habit:"Review and Maintain Calendar for Routine Payments (electricity, mobile, AMC, EV)", frequency:"Weekly", sop:"Finance", uom:"Per Billing Cycle", priority:"high" },
    { id:"FAM07", habit:"Prepare Annual Expense Capex Budget for the Year in February", frequency:"Yearly", sop:"Finance", uom:"Per Year", priority:"high" },
    { id:"FAM08", habit:"Analyse Budget V/s Actual Expense for repair, travel, interest, capex", frequency:"Monthly", sop:"Finance", uom:"Per Category", priority:"high" },
    { id:"FAM09", habit:"Track closure of Rental Accounts and communicate revenue impact to management", frequency:"Monthly", sop:"Finance", uom:"Per Category", priority:"medium" },
  ],

  FINANCE_MANAGER: [
    { id:"FMG01", habit:"Ensure latest PO, KYC, Rental Agreement & Rental Schedule in common repository", frequency:"Weekly", sop:"Operations", uom:"Per Review", priority:"high" },
    { id:"FMG02", habit:"Verify correct billing frequency in Billing Date Calculator / Stock Software for every new order", frequency:"Weekly", sop:"Operations", uom:"Per Order", priority:"high" },
    { id:"FMG03", habit:"Weekly review report on Timely Invoices Released and check Billing Date Calculator sheet", frequency:"Weekly", sop:"Operations", uom:"Per Report", priority:"high" },
    { id:"FMG04", habit:"100% maker-checker verification on new orders/amendments/returns/replacements", frequency:"Daily", sop:"Operations", uom:"Per Change", priority:"high" },
    { id:"FMG05", habit:"Analyse Budget V/s Actual Expense for defined parameters monthly", frequency:"Monthly", sop:"Finance", uom:"Per Category", priority:"medium" },
    { id:"FMG06", habit:"Review and approve all invoices before dispatch", frequency:"Daily", sop:"Billing", uom:"Per Invoice", priority:"high" },
    { id:"FMG07", habit:"Track closure of Rental Accounts and communicate impact to management", frequency:"Monthly", sop:"Finance", uom:"Per Category", priority:"medium" },
  ],

  PURCHASE_EXEC: [
    { id:"PUR01", habit:"Place purchase order for new assets only after Director-approved indent", frequency:"Daily", sop:"New Order Processing", uom:"Per Purchase", priority:"high" },
    { id:"PUR02", habit:"Attach bid tab (for new vendor or new products) for approvals to PO", frequency:"Daily", sop:"Purchase", uom:"Document Set", priority:"high" },
    { id:"PUR03", habit:"Take Approval / Digital Signature as per Approval Matrix", frequency:"Daily", sop:"Purchase", uom:"Document Set", priority:"high" },
    { id:"PUR04", habit:"Perform Bid Tab comparison (3 quotes) for new items or new vendors", frequency:"Daily", sop:"Purchase", uom:"Per Quote Set", priority:"high" },
    { id:"PUR05", habit:"Submit Vendor Invoices & Challans to Accounts for payment (Full Kit for Payment Release)", frequency:"Daily", sop:"Purchase", uom:"Per Invoice", priority:"high" },
    { id:"PUR06", habit:"Rate Vendor Performance (Delivery/Quality)", frequency:"Daily", sop:"Purchase", uom:"Per PO", priority:"medium" },
    { id:"PUR07", habit:"Update/Review Procurement Dashboard", frequency:"Weekly", sop:"Purchase", uom:"Per Dashboard", priority:"medium" },
    { id:"PUR08", habit:"Track Vendor Payments and Release plan to Finance for upcoming vendor pending payments", frequency:"Weekly", sop:"Purchase", uom:"Per Dashboard", priority:"high" },
    { id:"PUR09", habit:"Review Warranty Expiry date of purchased items and share with Stakeholders", frequency:"Weekly", sop:"Purchase", uom:"Per Asset Batch", priority:"medium" },
    { id:"PUR10", habit:"Update Price List of frequently purchased items and create master with last purchase date", frequency:"Monthly", sop:"Purchase", uom:"Per List", priority:"medium" },
  ],

  INVENTORY_EXEC: [
    { id:"INV01", habit:"Perform daily physical & system stock check", frequency:"Daily", sop:"Inventory", uom:"Asset Batch", priority:"high" },
    { id:"INV02", habit:"Update inventory for new assets Purchased within 24 hrs", frequency:"Daily", sop:"Inventory", uom:"Per GRN", priority:"high" },
    { id:"INV03", habit:"Prepare Challan for each asset Inward or Outward Movement", frequency:"Daily", sop:"Inventory", uom:"Serial Entry", priority:"high" },
    { id:"INV04", habit:"Update asset status after return QC / Support as per Category A,B,C,D", frequency:"Daily", sop:"Inventory", uom:"System Entry", priority:"high" },
    { id:"INV05", habit:"Record Quality Check / Upgrade / Repair details in software (Service History, Battery/RAM changes)", frequency:"Weekly", sop:"Inventory", uom:"Per Asset", priority:"medium" },
    { id:"INV06", habit:"Store assets in library-style format for easy traceability & proper protection", frequency:"Daily", sop:"Inventory", uom:"Per Asset", priority:"medium" },
    { id:"INV07", habit:"Reconcile & Update Stock Software with inventory changes (Qty/Value) 5 days before billing cycle", frequency:"Monthly", sop:"Ticketing", uom:"Per Cycle", priority:"high" },
  ],

  INVENTORY_MGR: [
    { id:"IVM01", habit:"Reconcile physical stock with system records. Circulate weekly report every Saturday for Assets in Stock by category", frequency:"Weekly", sop:"Inventory", uom:"Per Audit", priority:"high" },
    { id:"IVM02", habit:"Maintain Physical Register for all assets moving In/Out of storage (Gate Pass)", frequency:"Daily", sop:"Inventory", uom:"Per Movement", priority:"medium" },
    { id:"IVM03", habit:"End of day round – ensure assets given for QC or Support Check are returned back to Inventory", frequency:"Daily", sop:"Inventory", uom:"Per Internal Issue", priority:"high" },
    { id:"IVM04", habit:"Prioritize issuance of laptops that are currently under warranty & A Category", frequency:"Daily", sop:"Inventory", uom:"Per Asset", priority:"high" },
    { id:"IVM05", habit:"Release upcoming warranty expiry report 2 months in advance to Support (D-Category Laptops)", frequency:"Monthly", sop:"Inventory", uom:"Per Asset", priority:"high" },
    { id:"IVM06", habit:"Sales Price Estimation and Rental recovery calculation based on Management request", frequency:"Weekly", sop:"Inventory", uom:"Per Asset", priority:"medium" },
    { id:"IVM07", habit:"Prepare for Audit by External Agency", frequency:"Monthly", sop:"Inventory", uom:"Per Asset", priority:"medium" },
    { id:"IVM08", habit:"Highlight overload situation and ask for additional support if required", frequency:"Weekly", sop:"Inventory", uom:"Per Review", priority:"medium" },
  ],

  CRM_EXEC: [
    { id:"CRM01", habit:"Acknowledge customer complaints via email/phone immediately prior to raising ticket", frequency:"Daily", sop:"Customer Complaints", uom:"Per Complaint", priority:"high" },
    { id:"CRM02", habit:"Communicate finding/next steps to customer regarding complaint", frequency:"Daily", sop:"Customer Complaints", uom:"Per Update", priority:"high" },
    { id:"CRM03", habit:"Request feedback from customer after complaint resolution", frequency:"Daily", sop:"Customer Complaints", uom:"Per Ticket", priority:"medium" },
    { id:"CRM04", habit:"Collect Feedback at defined stages (Post-Order, Delivery, Mid-Rental, End-Rental)", frequency:"Daily", sop:"Customer Feedback", uom:"Per Stage", priority:"high" },
    { id:"CRM05", habit:"Update all customer stakeholder details in CRM/Stock Software upon order receipt", frequency:"Daily", sop:"New Order Processing", uom:"Per Customer", priority:"high" },
    { id:"CRM06", habit:"Raise tickets for customer requests (billing/asset issues/returns/replacements/new requirements)", frequency:"Daily", sop:"Ticketing", uom:"Per Ticket", priority:"high" },
    { id:"CRM07", habit:"Check Full Kit before assigning tasks", frequency:"Daily", sop:"Ticketing", uom:"Per Ticket", priority:"high" },
    { id:"CRM08", habit:"Conduct morning ticket assignment meeting (10:30 am) – review yesterday & discuss new assignments", frequency:"Daily", sop:"Ticketing", uom:"Per Meeting", priority:"high" },
    { id:"CRM09", habit:"Review Active/Waiting/Completed tickets", frequency:"Weekly", sop:"Ticketing", uom:"Ticket Review Batch", priority:"medium" },
    { id:"CRM10", habit:"Close billing-related open points before billing end period so Invoice can be raised", frequency:"Weekly", sop:"Ticketing", uom:"Per Billing Cycle", priority:"high" },
    { id:"CRM11", habit:"Get customer confirmation email for asset returns", frequency:"Daily", sop:"Ticketing", uom:"Per Asset", priority:"high" },
    { id:"CRM12", habit:"Check Return Window Guidelines (e.g., before 15th) before accepting return request", frequency:"Daily", sop:"Returns", uom:"Per Request", priority:"high" },
    { id:"CRM13", habit:"Send Return Confirmation email with Billing Stoppage Date & Pickup Window", frequency:"Daily", sop:"Returns", uom:"Per Request", priority:"high" },
  ],

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
    { id:"OPS10", habit:"Periodically review & update all SOPs for relevance", frequency:"Quarterly", sop:"Operations", uom:"Per Review", priority:"medium" },
  ],

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
