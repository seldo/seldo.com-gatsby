import React, {useState,useEffect} from "react"
import Layout from "../../components/layout"
import SEO from "../../components/seo"

const AdminPage = ({pageContext}) => {

  const [user, setUser] = useState(false)

  const fetchUserData = async () => {
    const res = await fetch("/.netlify/functions/read_userdata")
    const json = await res.json()
    setUser(json)
  }
  
  useEffect(() => {
    fetchUserData()
  }, [])    

  return (  
    <Layout>
      <SEO title="Admin Page" />
      { user ? (
        <>
          <p>Hello {user.username}</p>
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
