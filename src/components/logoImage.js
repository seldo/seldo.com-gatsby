import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

const LogoImage = ({number,size,alt}) => {
  const data = useStaticQuery(graphql`
    query {
      allFile(filter: {relativeDirectory: {eq: "logos"}}, sort: {fields: relativePath, order: ASC}) {
        edges {
          node {
            relativePath
            relativeDirectory
            childImageSharp {
              small: fixed(width: 55, height: 65, fit: COVER, cropFocus: CENTER) {
                ...GatsbyImageSharpFixed
              }
              sidePanel: fluid(maxWidth: 500) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  `)

  // gross hack to find the right one
  //return <Img fluid={data.placeholderImage.childImageSharp.fluid} />
  let imgData = data.allFile.edges.find((element) => {
    return (element.node.relativePath === `presidents/${number}.jpg`)
  })
  if(size === 'thumbnail') {
    return <Img alt={alt} fixed={imgData.node.childImageSharp.small}/>
  } else {
    return <Img alt={alt} fluid={imgData.node.childImageSharp.sidePanel}/>
  }
  
}

export default PresidentImage
