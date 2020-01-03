import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import SinglePost from "../components/single-post"

const IndexPage = ({pageContext}) => {

  return (  
    <Layout>
      <SEO title="Seldo.com" />
      {
        pageContext.posts.map( (post) => {
          return (
            <SinglePost post={post} />
          )
        })
      }
    </Layout>
  )
}

export default IndexPage
