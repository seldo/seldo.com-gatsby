import React from "react"
import { makeLink } from "../lib/helpers"
import dayjs from "dayjs"

const SinglePost = ({ post, permaLink }) => {
  let d = dayjs(post.published)
  let prettyDate = d.format('D MMMM, YYYY')
  return (
    <div className="singlePost flexyColumn">
      <div className="postDate">{ prettyDate }</div>
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
