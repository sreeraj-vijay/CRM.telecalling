import SiteVisit from "../../pages/common/SiteVisit"

const stafftasksRoutes = [
  { path: "/staff/tasks/signup-customer", title: "SignUp Customer" },
  { path: "/staff/tasks/productMerge", title: "Product Merge" },

  {
    path: "/staff/tasks/productAllocation-Pending",
    title: "Product Allocation Pending"
  },
  {
    path: "/staff/tasks/leaveApproval-pending",
    title: "Leave Approval Pending"
  },
  { path: "/staff/tasks/workAllocation", title: "Work Allo{cation" },
  { path: "/staff/tasks/location", component: SiteVisit}
]

export default stafftasksRoutes
