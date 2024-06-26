const path = require(`path`);
const fetch = import('node-fetch');
// const webpack = require('webpack'); // Add this line to import webpack
// const CopyWebpackPlugin = require('copy-webpack-plugin');

// exports.onCreateWebpackConfig = ({ stage, actions }) => {
//   actions.setWebpackConfig({
//     experiments: {
//       asyncWebAssembly: true,
//     },
//   });
 
// };
// In your gatsby-node.js
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    experiments: {
      asyncWebAssembly: true,
      syncWebAssembly: true
    },
    module: {
      rules: [
        {
          test: /\.wasm$/,
          type: "webassembly/async",
        },
      ],
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    // plugins: [
    //   new CopyWebpackPlugin({
    //     patterns: [
    //       { from: 'path_to_automerge_wasm/automerge_wasm_bg.wasm', to: 'public/' }
    //     ]
    //   })
    // ]
  });
};




exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  const fetch = (await import('node-fetch')).default;

  // Define the list of topics you want to fetch from Wikipedia
  const topics = ['Xu_Wei', 'Tosa_Mitsuoki', 'Ike_no_Taiga', 'Yosa_Buson'];

  // Fetch data for each topic
  const pagesData = await Promise.all(topics.map(async topic => {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${topic}`);
    const data = await response.json();
    // Check if an image is available and get its URL
    const imageUrl = data.thumbnail ? data.thumbnail.source : null;
    return {
      title: data.title,
      summary: data.extract,
      imageUrl: imageUrl, // Include the image URL in the returned data
      author: 'Wikipedia'
    };
  }));

console.log("pagesData", pagesData); // Check the fetched data array

  // Create a page for each topic
  pagesData.forEach(data => {
    createPage({
      path: `/study-guide/${data.title}`,
      component: path.resolve(`./src/templates/studyGuide.js`),
      context: {
        title: data.title,
        summary: data.summary,
        imageUrl: data.imageUrl, // Pass the image URL to the context
        author: data.author,
      },
    });
  });
};

