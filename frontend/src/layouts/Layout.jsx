//import Footer from "../components/Footer/Footer"
import Header from "../header/Header"

import Mainrouter from "../router/Mainrouter.jsx"

import { useLocation } from "react-router-dom"

const Layout = () => {
  let location = useLocation()

  let adminHeader = location.pathname.startsWith("/admin")

  return (
    <>
      {adminHeader ? <Header /> : ""}
      <main>
        <Mainrouter />
      </main>
      {/* <Footer /> */}
    </>
  )
}

export default Layout
