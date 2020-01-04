import React from "react"
import { makeLink } from "../lib/helpers"

const SinglePost = ({ post, permaLink }) => {
  return (
    <div className="singlePost flexyColumn">
      { permaLink ? (
        <h1><a href={makeLink(post.codename)}>{post.title}</a></h1>
      ) : (
        <h1>{post.title}</h1>
      )}
      <div dangerouslySetInnerHTML={{__html: post.body}}></div>
    </div>
  )
}

export default SinglePost
