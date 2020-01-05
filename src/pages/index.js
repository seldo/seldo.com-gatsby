import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import SinglePost from "../components/single-post"
import Floof from "../images/processed/floof-blue.svg"
import HeaderImage from "../components/images/headerImage"

const IndexPage = ({pageContext}) => {

  let customHeader = <HeaderImage className="frontPageHeader">
    <h1>
      <a href="/"><span>Seldo.com</span></a>
    </h1>
  </HeaderImage>

  return (  
    <Layout customHeader={customHeader}>
      <SEO title="" />
      <div className="hiddenLogin">
        <a href="/admin"></a>
      </div>      
      <div className="frontPage">        
      {
        pageContext.recentPosts.map( (post) => {
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
      <div className="finalWord">
        <p>More posts are available <a href="/archive/">in the archive</a>.</p>
      </div>              
      </div>
    </Layout>
  )
}

export default IndexPage
