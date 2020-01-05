import React, {useState} from "react"
import { useStaticQuery, graphql } from "gatsby"
import BackgroundImage from 'gatsby-background-image'

/*
 * This component is built using `gatsby-image` to automatically serve optimized
 * images with lazy loading and reduced file sizes. The image is loaded using a
 * `useStaticQuery`, which allows us to load the image from directly within this
 * component, rather than having to pass the image data down from pages.
 *
 * For more information, see the docs:
 * - `gatsby-image`: https://gatsby.dev/gatsby-image
 * - `useStaticQuery`: https://www.gatsbyjs.org/docs/use-static-query/
 */

const HeaderImage = ({children,className,alt}) => {
  const data = useStaticQuery(graphql`
    query {
      allFile(filter: {relativeDirectory: {eq: "processed/headers"}}, sort: {fields: relativePath, order: ASC}) {
        edges {
          node {
            relativePath
            relativeDirectory
            childImageSharp {
              bigHero: fluid(maxWidth: 1500) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  `)

  let [picIndex,setPicIndex] = useState(Math.round(Math.random()*data.allFile.edges.length))

  const nextPic = () => {
      const total = data.allFile.edges.length
      let next = picIndex + 1
      if (next >= total) {
          next = 0
      }
      setPicIndex(next)
  }

  // just pick one at random
  let imgData = data.allFile.edges[picIndex]

  return (
    <BackgroundImage
      Tag="section"
      className={className}
      fluid={imgData.node.childImageSharp.bigHero}
      backgroundColor={`#040e18`}
    >
        {children}
        <div className="advancePicture">
            <button onClick={nextPic}>📸</button>
        </div>
    </BackgroundImage>
  )

}

export default HeaderImage
