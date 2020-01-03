import { Link } from "gatsby"
import React from "react"
import SVG from "./images/svg"
import logo from "../images/logos/svg/knockout.svg"

const Header = ({ siteTitle }) => (
  <header>
    <div>
      <h1>
        <Link to="/"><SVG path={logo} fill="#78B0E1" /></Link>
      </h1>
    </div>
  </header>
)

export default Header
