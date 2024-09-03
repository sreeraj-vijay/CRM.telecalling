import CallRegistration from "../../../pages/primaryUser/register/CallRegistration"
const transactionsRoutes = [
  { path: "/admin/transaction/lead", title: "Lead" },
  { path: "/admin/transaction/call-registration", component: CallRegistration },
  { path: "/admin/transaction/leave-application", title: "Leave Application" }
]

export default transactionsRoutes
