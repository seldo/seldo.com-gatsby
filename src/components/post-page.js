import React from "react"
import Layout from "./layout"
import SinglePost from "./single-post"
import SEO from "../components/seo"

import Floof from "../images/processed/floof-blue.svg"

const PostPage = ({ pageContext }) => {
  let post = pageContext.post
  return <Layout>
    <SEO title={post.title} />
    <div class="postPage">
      <SinglePost post={post} permaLink={false} />
      <div className="postEnd"><Floof className="alpaca" /></div>
    </div>    
  </Layout>
}

export default PostPage
