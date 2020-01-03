import { Link } from "gatsby"
import React from "react"
import SVG from "./images/svg"
import Logo from "../images/logos/svg/knockout2.svg"

const Header = ({ siteTitle }) => (
  <header>
    <div>
      <h1>
        <Link to="/"><Logo fill="#78B0E1" className="headerLogo" /></Link>
      </h1>
    </div>
  </header>
)

export default Header
