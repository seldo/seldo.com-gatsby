import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Floof from "../images/processed/floof-with-border.svg"
import HeaderImage from "../components/images/headerImage"
import { makeLink } from "../lib/helpers"

const IndexPage = ({pageContext}) => {

  return (  
    <Layout showHeader={false}>
      <SEO title="" />
      <HeaderImage className="frontPageHeader">
        <h1>
          <a href="/"><span>Seldo.com</span></a>
        </h1>
      </HeaderImage> 
      <div className="hiddenLogin">
        <a href="/admin"><span>.</span></a>
      </div>
      <div className="frontPage">
        <div className="content">
          <div className="introduction">
            <div className="centered">
              <p>I'm Laurie Voss, and this is my personal website.</p>
              <p>You can read some recent posts, or <a href="/archive/">explore the archive</a>. I have maintained this website for more than 20 years so there is quite a lot of stuff!</p>
              <p>You can also learn a bit more <a href="/about">about me</a>, including how to contact me, or a tiny bit more <a href="/colophon/">about this site</a> and what I used to build it.</p>
            </div>
          </div>  
          <div className="recentPosts">
            <h2>Recent posts</h2>
            <ul>
            {
              pageContext.recentPosts.map( (post) => {
                return (
                  <li><a href={makeLink(post.codename)}>{post.title}</a></li>
                )
              })
            }
            </ul>
          </div>
        </div>
        <div className="finial"><Floof /></div>           
      </div>
    </Layout>
  )
}

export default IndexPage
