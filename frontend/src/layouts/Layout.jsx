//import Footer from "../components/Footer/Footer"
import Header from "../header/Header"

import Routers from "../router/Router"
//import { useLocation } from "react-router-dom"

const Layout = () => {
  return (
    <>
      <Header />

      <main>
        <Routers />
      </main>
      {/* <Footer /> */}
    </>
  )
}

export default Layout
