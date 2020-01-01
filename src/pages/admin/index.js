import React, {useState,useEffect} from "react"
import Layout from "../../components/layout"
import SEO from "../../components/seo"

const AdminPage = ({pageContext}) => {

  const [user, setUser] = useState(false)
  const [postList, setPostList] = useState([])
  const [post,setPost] = useState({})

  const fetchUserData = async () => {
    let uRes = await fetch("/.netlify/functions/read_userdata")
    let uJson = await uRes.json()
    setUser(uJson)
    let pRes = await fetch("/.netlify/functions/list_posts")
    let pJson = await pRes.json()
    setPostList(pJson.rows)
  }
  
  useEffect(() => {
    fetchUserData()
  }, [])    

  const selectPost = async (codename) => {
    let res = await fetch(`/.netlify/functions/get_post?codename=${codename}`)
    let json = await res.json()
    setPost(json)
  }

  const createOrUpdatePost = async (event,draft) => {
    let res = await fetch(
      `/.netlify/functions/save_post`,
      {
        method: "POST",
        body: JSON.stringify({
          ...post
        })
      }
    )
    let json = await res.json()
    console.log("Save action returned")
    console.log(json)
  }

  return (  
    <Layout>
      <SEO title="Manage posts" />
      { user.username ? (
        <>
          <div className="postForm">
            <p>Title: <input type="text" name="title" value={post.title} /></p>
            <p>Slug: <input type="text" name="codename" value={post.codename} /></p>
            <p><textarea name="body" value={post.body} /></p>
            <p><button onClick={(e) => {createOrUpdatePost(e,true)}}>Publish</button></p>
            <p><button onClick={(e) => {createOrUpdatePost(e,false)}}>Save draft</button></p>
          </div>
          <div className="postList">
            <ul>
            {
              postList.map( (post) => {
                return (
                  <li key={post.codename}><button onClick={ () => {selectPost(post.codename)}}>{post.title}</button></li>
                )
              })
            }
            </ul>
          </div>
        </>
      ) : (
        <>
          <p>If you're not authed you won't see anything.</p>
          <p>Maybe you want to <a href="/login">log in</a>?</p>
        </>
      )}
    </Layout>
  )
}

export default AdminPage
