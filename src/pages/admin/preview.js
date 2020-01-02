import React, {useState,useEffect} from "react"
import Layout from "../../components/layout"
import SinglePost from "../../components/single-post"
import withLocation from "../../components/withLocation"

const PreviewPage = ({query}) => {

  let [post,setPost] = useState({})
  
  useEffect(() => {
    selectPost('becoming_american')
  }, [])    

  const selectPost = async (codename) => {
    let res = await fetch(`/.netlify/functions/get_post?codename=${query.codename}`)
    let json = await res.json()
    setPost(json)
  }

  return (  
    <Layout>
      <SinglePost post={post} />
    </Layout>
  )
}

export default withLocation(PreviewPage)