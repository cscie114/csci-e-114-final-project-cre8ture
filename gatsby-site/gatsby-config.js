// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

/*
module.exports = {
  siteMetadata: {
    title: 'brush and poem',
    description: 'Create simple poems inspired by brush painters',
    author: 'Kai Kleinbard', 
  },
  
 
  plugins: [

    'gatsby-plugin-offline',
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

*/

module.exports = {
  siteMetadata: {
    title: 'brush and poem',
    description: 'Create simple poems inspired by brush painters',
    author: 'Kai Kleinbard',
  },
  plugins: [
    'gatsby-plugin-offline',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `articles`,
        path: `${__dirname}/src/articles/`,
      },
    },
    `gatsby-transformer-remark`,
    // other gatsby plugins
  ],
};
