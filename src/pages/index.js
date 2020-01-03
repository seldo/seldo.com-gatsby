import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import SinglePost from "../components/single-post"
import Floof from "../images/processed/floof-blue.svg"

const IndexPage = ({pageContext}) => {

  return (  
    <Layout>
      <SEO title="Seldo.com" />
      {
        pageContext.posts.map( (post) => {
          return (
            <>
              <section className="frontPagePost">
                <SinglePost post={post} permaLink={true} />              
              </section>
              <div className="postSeparator"><Floof className="alpaca" /></div>              
            </>
          )
        })
      }
    </Layout>
  )
}

export default IndexPage
