import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import PostEnd from "../components/post-end"

const Colophon = () => (
  <Layout>
    <SEO title="Colophon" />
    <div className="colophon flexyColumn">
      <h1>About this site</h1>
      
      <p>If you're a web developer and you care about how the work is done, here are some details. The site's not open source but it might be one day.</p>

      <ul>
        <li>The site is primarily <a href="https://gatsbyjs.org">Gatsby</a>, a framework for building websites in <a href="https://reactjs.org/">React</a>. I enjoy the reusable component model of React, and Gatsby takes care of the tiresome routing, transpiling, and hot-reloading that can make it annoying to get started with React.</li>
        <li>All the bits of the site that you see are almost totally static, rendered at build time (another Gatsby feature) and served as plain HTML for speed, SEO and accessibility.</li>
        <li>The site is hosted on <a href="https://www.netlify.com/">Netlify</a>. When I push an update to <a href="https://github.com/seldo">GitHub</a> a webhook triggers a rebuild of the site, which is then pushed to Netlify's CDN.</li>
        <li>The site has a (barely) hidden admin screen which lets me create, update and delete posts. The admin screen is a single-page React app, powered by an API composed of <a href="https://www.netlify.com/products/functions/">Netlify Functions</a>, which are mostly <a href="https://aws.amazon.com/lambda/">AWS Lambda</a> functions. The functions are part of the same repo as the rest of the website and get built and deployed in the same way, which is a lot more convenient than regular Lambda.</li>
        <li>The admin screen is secured first by using <a href="https://developer.twitter.com/">Twitter</a> for authentication (the <a href="https://www.npmjs.com/package/twitter-lite">twitter-lite</a> package) and then checking the database for authorization (there is currently exactly 1 user authorized to do anything: me). This is clearly overkill but it was fun to build.</li>
        <li>Ultimately all the data is stored in <a href="https://mariadb.org/">MariaDB</a>, on the cheapest possible <a href="https://aws.amazon.com/rds/">AWS RDS</a> plan I could find. This is also overkill because the database really only needs to exist at build time, a big JSON file somewhere would work almost as well. But I like databases, so the site has a database.</li>
      </ul>

      <PostEnd home={true} />
      
    </div>
  </Layout>
)

export default Colophon
