import React from "react"
import Floof from "../images/processed/floof-with-border.svg"

const PostEnd = ({home}) => {
  return <div className="postEnd">
    { home ? (
      <a href="/"><Floof className="alpaca" /></a>
    ) : (
      <Floof className="alpaca" />
    )}
  </div>
}

export default PostEnd
