import React from "react"
import Layout from "./layout"
import SEO from "../components/seo"
import moment from "moment"
import { makeLink } from "../lib/helpers"
import PostEnd from "../components/post-end"

const ArchivePage = ({ pageContext }) => {
  let posts = pageContext.posts

  let archives = []
  let months = {}
  for(let i = 0; i < posts.length; i++) {
    let post = posts[i]
    let published = moment(post.published)
    let year = published.format('YYYY')
    let month = published.format('MM')
    if (!months[year]) {
      months[year] = {}
    }
    if (!months[year][month]) {
      months[year][month] = []
    }
    months[year][month].push(post)
  }

  // index of all years
  let yearsList = Object.keys(months).reverse()
  let yearLinks = yearsList.map( year => {
    return <li><a href={`#archive${year}`}>{year}</a></li>
  })
  let yearsSection = <section className="archiveYears">
    <h1><a name="yearIndex">Archives</a></h1>
    <p>{ posts.length } posts so far. Pick a year to jump to, or just scroll.</p>
    <ul>
    { yearLinks }
    </ul>
  </section>
  archives.push(yearsSection)

  // each year
  for(let year of yearsList) {
    let monthList = Object.keys(months[year])
    let monthLinks = monthList.map( month => {
      return <div className="archiveMonth">
        <h3>{moment(`${year}-${month}`).format('MMMM')}</h3>
        <ul>
          { months[year][month].map( post => {
            return <li><a href={makeLink(post.codename)}>{post.title}</a></li>
          })}
        </ul>
      </div>
    })

    let yearSection = <section className="archiveMonths">
      <h2><a name={`archive${year}`}>{year}</a></h2>
      { monthLinks }
      <p>[<a href="#yearIndex">Back to top</a>]</p>
    </section>

    archives.push(yearSection)
  }

  return <Layout>
    <SEO title="Archives" />
    <div className="archivePage">
      { archives }
      <PostEnd />
    </div>    
  </Layout>
}

export default ArchivePage
