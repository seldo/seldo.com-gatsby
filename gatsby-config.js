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
  ],
}
