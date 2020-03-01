module.exports = {
  siteMetadata: {
    title: `Seldo.com`,
    description: `Personal site and blog of Laurie Voss, aka @seldo`,
    author: `@seldo`,
    staticHostname: process.env.BASE_HOSTNAME,
    siteUrl: `https://seldo.com/`
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: "UA-1536085-2",
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: false,
        // Delays sending pageview hits on route update (in milliseconds)
        pageTransitionDelay: 0,
      },
    },    
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Lato`,
            subsets: [`latin`],
          },
          {
            family: `Fira Sans`,
            subsets: [`latin`],
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
          rule: {
            include: `${__dirname}/src/images/processed/`
          }
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allBlogPost } }) => {
              console.log(">>>> I'm trying to serialize")
              return allBlogPost.nodes.map( n => {
                console.log("----- it's happpening ------")
                let post = n.postData
                return Object.assign({}, {
                  description: post.excerpt,
                  date: post.created,
                  url: site.siteMetadata.siteUrl + "/posts/" + post.codename,
                  guid: site.siteMetadata.siteUrl + "/posts/" + post.codename,
                  custom_elements: [{ "content:encoded": post.body }],
                })
              })
            },
            query: `
              {
                __typename
                allBlogPost(sort: {order: DESC, fields: postData___created}, limit: 20, filter: {postData: {draft: {eq: 0}}}) {
                  nodes {
                    postData {
                      id
                      title
                      codename
                      body
                      created
                      draft
                      excerpt
                      published
                      updated
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Seldo.com RSS Feed",
          },
        ],
      },
    }
  ],
}
