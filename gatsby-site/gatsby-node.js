const path = require(`path`)
const fetch = require('node-fetch')

exports.createPages = async ({ actions }) => {
  const { createPage } = actions

  // Define the list of topics you want to fetch from Wikipedia
  const topics = ['Gatsby_(software)', 'React_(JavaScript_library)', 'JavaScript']

  // Fetch data for each topic
  const pagesData = await Promise.all(topics.map(async topic => {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${topic}`)
    const data = await response.json()
    return data
  }))

  // Create a page for each topic
  pagesData.forEach(data => {
    createPage({
      path: `/study-guide/${data.title}`,
      component: path.resolve(`./src/templates/studyGuide.js`),
      context: {
        title: data.title,
        summary: data.extract,
        author: `Wikipedia`,
      },
    })
  })
}
