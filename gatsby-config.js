module.exports = {
  siteMetadata: {
    title: `Seldo.com`,
    description: `Personal site and blog of Laurie Voss, aka Seldo`,
    author: `@seldo`,
  },
  plugins: [
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
  ],
}
