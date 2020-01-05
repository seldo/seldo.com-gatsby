import React from "react"
import Layout from "./layout"
import SinglePost from "./single-post"
import SEO from "../components/seo"
import PostEnd from "../components/post-end"
import striptags from "striptags"

const PostPage = ({ pageContext }) => {
  let post = pageContext.post
  return <Layout>
    <SEO title={post.title} description={striptags(post.excerpt)} />
    <div class="postPage">
      <SinglePost post={post} permaLink={false} />
      <PostEnd home={true} />
    </div>    
  </Layout>
}

export default PostPage
