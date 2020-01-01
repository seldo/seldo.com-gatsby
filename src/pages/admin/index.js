import React, {useState,useReducer,useEffect} from "react"
import Layout from "../../components/layout"
import SEO from "../../components/seo"

const reducer = (state, {field,value}) => {
  return {
    ...state,
    [field]: value
  }
}

const AdminPage = ({pageContext}) => {

  const [user, setUser] = useState(false)
  const [postList, setPostList] = useState([])
  const [post,setPost] = useReducer(reducer,{
    title: '',
    codename: '',
    body: ''
  })
  const [originalCodename,setOriginalCodename] = useState(false)

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
    for(let f in json) {
      setPost({
        field: f,
        value: json[f]
      })
    }
    setOriginalCodename(json.codename)
  }

  const createOrUpdatePost = async (event,draft) => {
    let res = await fetch(
      `/.netlify/functions/save_post`,
      {
        method: "POST",
        body: JSON.stringify({
          ...post,
          draft,
          originalCodename
        })
      }
    )
    let json = await res.json()
    console.log("Save action returned")
    console.log(json)
  }

  const handleChange = (event) => {
    setPost({      
      field: event.target.name,
      value: event.target.value
    })
  }

  return (  
    <Layout>
      <SEO title="Manage posts" />
      { user.username ? (
        <>
          <div className="postForm">
            <p>Title: <input type="text" name="title" value={post.title} onChange={handleChange} /></p>
            <p>Slug: <input type="text" name="codename" value={post.codename} onChange={handleChange} /></p>
            <input type="hidden" name="original_codename" value={originalCodename} />
            <p><textarea name="body" value={post.body} onChange={handleChange} /></p>
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
