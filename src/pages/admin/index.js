import React, {useState,useEffect} from "react"
import Layout from "../../components/layout"
import SEO from "../../components/seo"
import slugify from "@sindresorhus/slugify"
import "../main.css"

const AdminPage = ({pageContext}) => {

  let [user, setUser] = useState(false)
  let [postList, setPostList] = useState([])
  let [post,setPost] = useState({
    id: '',
    title: '',
    codename: '',
    body: ''
  })
  let [postResult,setPostResult] = useState('')
  let [originalCodename,setOriginalCodename] = useState(false)
  let [previewCount,setPreviewCount] = useState(0)

  const updatePostList = async () => {
    let pRes = await fetch("/.netlify/functions/list_posts")
    let pJson = await pRes.json()
    setPostList(pJson.rows)
  }

  const fetchUserData = async () => {
    let uRes = await fetch("/.netlify/functions/read_userdata")
    let uJson = await uRes.json()
    setUser(uJson)
  }
  
  useEffect(() => {
    fetchUserData()
    updatePostList()
  }, [])    
  
  const selectPost = async (codename) => {
    let res = await fetch(`/.netlify/functions/get_post?codename=${codename}`)
    let json = await res.json()
    setPost(json)
    setOriginalCodename(json.codename)
    setPostResult(false)
  }

  const clearEditor = async (event) => {
    setPost({
      id: '',
      title: '',
      codename: '',
      body: ''
    })
    setOriginalCodename(false)
    setPostResult(false)
  }

  const deletePost = async (event) => {
    if (post.id) {
      let res = await fetch(
        `/.netlify/functions/delete_post`,
        {
          method: "POST",
          body: JSON.stringify(post)
        }
      )
      if (res.status === 200) {
        let result = await res.json()
        if (result.action === "deleted") {
          postResult = "Post deleted."
        } else {
          postResult = "Something happend but I dunno what?"
        }
        // this completely resets the editor because no spread "...post"
        post = {
          id: '',
          title: '',
          codename: '',
          body: ''
        }        
      }
    } else {
      postResult = "No post selected to delete"
    }
    setPost(post)
    setOriginalCodename(false)
    setPostResult(postResult)
    updatePostList()
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
    if (res.status === 200) {
      let result = await res.json()
      if (result.action === "created") {
        postResult = "New post created!"
      } else if (result.action === "updated") {
        postResult = "Post updated!"
      } else {
        postResult = "Something good happend but I dunno what?"
      }
      post = result.post
    } else {
      let result = await res.json()
      if (result && result.error) {
        postResult = result.error
      }
    }
    setPost(post)
    setOriginalCodename(post.codename)
    setPostResult(postResult)
    updatePostList()
    setPreviewCount(previewCount+1)
  }

  const handleChange = (event) => {
    if (event.target.name === "title") {
      post.codename = slugify(event.target.value)
    }

    setPost({      
      ...post,
      [event.target.name]: event.target.value
    })
  }

  return (  
    <Layout>
      <SEO title="Manage posts" />
      { user.username ? (
        <>
          { postResult ? (
            <div className="postResult">{postResult}</div>
          ) : (
            <></>
          )}
          <div className="editingArea">
            <div className="postForm">
              <input type="hidden" name="id" value={post.id} />
              <p>Title: <input type="text" name="title" value={post.title} onChange={handleChange} /></p>
              <p>Slug: <input type="text" name="codename" value={post.codename} onChange={handleChange} /></p>
              <input type="hidden" name="original_codename" value={originalCodename} />
              <p><textarea name="body" value={post.body} onChange={handleChange} /></p>
              <div className="controls">
                <button id="saveBtn" onClick={(e) => {createOrUpdatePost(e,true)}}>Save draft</button>
                <button id="publishBtn" onClick={(e) => {createOrUpdatePost(e,false)}}>Publish</button>
                <button id="deleteBtn" onClick={(e) => {deletePost(e)}} disabled={post.id ? false : true}>Delete</button>
                <button id="clearBtn" onClick={(e) => {clearEditor(e)}} disabled={post.id ? false : true}>New post</button>
              </div>
            </div>
            { originalCodename ? (
              <div className="preview">
                <iframe title="preview" src={`/admin/preview?codename=${originalCodename}&previewCount=${previewCount}`} />
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="postList">
            <h2>Recent posts</h2>
            <ul>
            {
              postList.map( (post) => {
                return (
                  <li key={post.codename}><a href={post.codename} onClick={ (e) => {selectPost(post.codename);e.preventDefault()}}>{post.title}</a></li>
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
