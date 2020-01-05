import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Self from "../components/images/self"
import PostEnd from "../components/post-end"

const AboutPage = () => (
  <Layout>
    <SEO title="About me" />
    <div className="aboutPage flexyColumn">
      <h1>Hello.</h1>
      
      <div className="selfie"><Self /></div>      
      
      <p>I'm Laurie Voss. I've been a web developer since 1996, with occasional breaks to found companies like <a href="https://www.crunchbase.com/organization/snowball-factory">awe.sm</a> (2010) and <a href="https://npmjs.com">npm</a> (2014). I like making websites, and I like making the web bigger and better. I think one of the best ways to do that is to encourage more people to do web development, by teaching them existing techniques and by building tools and services that make web development easier, so they don't have to learn so much.</p>

      <h2>Selected work</h2>

      <p>I enjoy writing and speaking; here are some of my favorites.</p>

      <ul>
        <li>Stuff Everybody Knows Except You (<a href="https://www.youtube.com/watch?v=JIJZnF_L5KI">part 1</a> and <a href="https://www.youtube.com/watch?v=4H8VTCSbYQg">part 2</a>), a marathon, 2-hour overview of professional web development given to graduates of Hack Reactor regularly since 2014.</li>
        <li><a href="https://www.youtube.com/watch?v=gChULw-uEjY">JavaScript - Who, What, Where, Why and Next</a> (JSConf EU Opening Keynote 2019).</li>
        <li><a href="https://slides.com/seldo/professional-javascript-2019">Professional JavaScript in 2019</a>  (FinJS London, New York, Stockholm 2019)</li>
        <li><a href="https://www.youtube.com/watch?v=mSQh0gcDXkc">npm and the Future of JavaScript</a> (JSConf US 2018)</li>
        <li><a href="https://www.youtube.com/watch?v=FJByltoGnA8">Solving Imaginary Scaling Issues, At Scale</a> (Dinosaur JS 2017)</li>
        <li><a href="https://gimletmedia.com/shows/reply-all/xjhe54">Disappeared</a> (Reply All podcast July 2016)</li>
        <li><a href="http://seldo.com/weblog/2014/08/26/you_suck_at_technical_interviews">You Suck At Technical Interviews</a>, a guide to hiring (2014)</li>
        <li><a href="http://seldo.com/weblog/2013/09/04/why_i_am_a_web_developer">Why I Am A Web Developer</a> (2013)</li>
        <li><a href="http://seldo.com/weblog/2012/08/30/software_developers_can_save_the_economy">Blue Collar Knowledge Workers Will Save The Economy</a> (2012)</li>
        <li><a href="http://seldo.com/weblog/2011/06/15/orm_is_an_antipattern">ORM is an antipattern</a> (2011)</li>
        <li><a href="http://seldo.com/weblog/2010/07/12/in_defence_of_sql">In defence of SQL</a> (2011)</li>
      </ul>

      <h2>Contacting me</h2>
      <p>If you'd like to contact me, the fastest way is <a href="https://twitter.com/seldo">@seldo</a> on Twitter. I also exist on <a href="https://www.linkedin.com/in/seldo/">LinkedIn</a> and my email is not hard to guess.</p>
      <p>If for some reason you need it, my <a href="/downloads/resume.2019.10.public.pdf">resume</a> is available.</p>

      <PostEnd />
      
    </div>
  </Layout>
)

export default AboutPage
