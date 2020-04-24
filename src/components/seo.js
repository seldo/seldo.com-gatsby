/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function SEO({ description, lang, meta, title }) {
  const { site, images } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author,
            staticHostname
          }
        },
        images: allFile(filter: {relativeDirectory: {eq: "processed/headers"}}, sort: {fields: relativePath, order: ASC}) {
          edges {
            node {
              relativePath
              relativeDirectory
              childImageSharp {
                twitter: fixed(width:1000,height:500) {
                  src
                }
              }
            }
          }
        }  
      }
    `
  )

  // deterministically selected from a hash of the metadata
  let hash = (str) => {
    var hash = 0, i, chr;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash
  }
  let modHash = (str,size) => { 
    return Math.abs(hash(str)) % size
  }

  const metaDescription = description || site.siteMetadata.description

  let easyTitle = title ? `${title} | ${site.siteMetadata.title}` : `${site.siteMetadata.title}`
 
  let imgData = images.edges[modHash(easyTitle, images.edges.length-1)]

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={easyTitle}
      titleTemplate={`%s`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `twitter:image`,
          content: site.siteMetadata.staticHostname + imgData.node.childImageSharp.twitter.src
        },
        {
          property: `twitter:image:alt`,
          content: `A beautiful photograph`
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:site`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: easyTitle,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta)}
    />
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default SEO
