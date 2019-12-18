import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({pageContext}) => {

  return (  
    <Layout>
      <SEO title="Seldo.com" />
      {
        pageContext.posts.map( (post) => {
          return (
            <h1>{post.title}</h1>
          )
        })
      }
    </Layout>
  )
}

export default IndexPage
