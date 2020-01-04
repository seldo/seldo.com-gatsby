import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <div className="mainContainer">
        <main>{children}</main>
      </div>
      <footer>
        <div>© {new Date().getFullYear()} Laurie Voss.</div>
        <div><a href="/">Home</a> | <a href="/about">About me</a> | <a href="/archive">Archive</a></div>        
      </footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
