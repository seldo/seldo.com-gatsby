import React from "react"
import Layout from "./layout"
import SinglePost from "./single-post"
import SEO from "../components/seo"
import PostEnd from "../components/post-end"

const PostPage = ({ pageContext }) => {
  let post = pageContext.post
  return <Layout>
    <SEO title={post.title} />
    <div class="postPage">
      <SinglePost post={post} permaLink={false} />
      <PostEnd />
    </div>    
  </Layout>
}

export default PostPage
