module.exports = {
  siteMetadata: {
    title: 'Your Site Title',
    description: 'Your site description',
    author: 'Author Name', // Add this line
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `articles`,
        path: `${__dirname}/src/articles/`,
      },
    },
    `gatsby-transformer-remark`,
  ],
}
