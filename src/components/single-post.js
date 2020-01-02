import React from "react"

const SinglePost = ({ post }) => {
  return (
    <div className="singlePost">
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{__html: post.body}}></div>
    </div>
  )
}

export default SinglePost
