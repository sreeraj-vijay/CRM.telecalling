import CallRegistration from "../../pages/primaryUser/register/CallRegistration"
const stafftransactionsRoutes = [
  { path: "/staff/transaction/lead", title: "Lead" },
  { path: "/staff/transaction/call-registration", component: CallRegistration },
  { path: "/staff/transaction/leave-application", title: "Leave Application" }
]

export default stafftransactionsRoutes
