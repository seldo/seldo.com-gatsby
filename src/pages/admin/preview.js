import React, {useState,useEffect} from "react"
import Layout from "../../components/layout"
import SinglePost from "../../components/single-post"
import withLocation from "../../components/withLocation"

const PreviewPage = ({query}) => {

  let [post,setPost] = useState({})
  
  useEffect(() => {
    selectPost('becoming_american')
  }, [])

  /* scripts don't run in preview because they come in on innerHTML so have to reactive them */
  useEffect(() => {
    if (post.id) {
      let scriptTags = document.querySelectorAll('#dangerousHTML script')
      for(let script of scriptTags) {
        let s = document.createElement('script')
        s.type = 'text/javascript'
        if (script.src) {
          s.src = script.src
        }      
        // re-insert the script tag so it executes.
        document.head.appendChild(s)        
      }
    }
  }, [post])

  const selectPost = async (codename) => {
    let res = await fetch(`/.netlify/functions/get_post?codename=${query.codename}`)
    let json = await res.json()
    setPost(json)
  }

  return (  
    <Layout>
      <div id="dangerousHTML">
        <SinglePost post={post} />
      </div>
    </Layout>
  )
}

export default withLocation(PreviewPage)