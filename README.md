[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/NGGI9_Zk)
# Final Project

Your README.md file should have:

- Detailed instructions to run your site.
- The URL to where you are hosting the site on web.


# Final Project Overview

This project explores the use of Conflict-free Replicated Data Types (CRDTs) and the Yjs library to create a collaborative, real-time application inspired by the great brush/ink artists of Chinese and Japanese traditional brush painting.

# How to Sync Changes Between App Instances

This guide will walk you through the steps to visit [Brush and Poem](https://brushandpoem.netlify.app/) and sync your changes between different app instances. This can be useful if you want to view the same content on multiple devices or browser tabs.

## Step 1: Visit the Website

Open your web browser and visit [https://brushandpoem.netlify.app/](https://brushandpoem.netlify.app/).

## Step 2: Select a Poet

Scroll down to the list menu at the bottom of the page. Here, you will see a list of artists. Click on one of the artists to view their content.

## Step 3: Open a New Tab or Device

Now, open a new tab in your browser or a new browser on a different device. Visit [https://brushandpoem.netlify.app/](https://brushandpoem.netlify.app/) again.

## Step 4: Select the Same Poet

In the new tab or device, scroll down to the list menu at the bottom of the page. Click on the same poet that you selected in the first tab or device.

## Step 5: Sync Changes

Now, any changes you make in one tab or device (like selecting a different poet or viewing different content) will be synced to the other. This allows you to view the same content across multiple devices or browser tabs.

Remember, the syncing feature requires an active internet connection on all devices. If you lose your connection, the changes might not sync until you're online again.

## CRDTs and Yjs

CRDTs are data structures that allow multiple replicas to be updated independently without coordination. The updates can then be merged deterministically, ensuring strong eventual consistency across all replicas. Yjs is a JavaScript library that implements CRDTs, enabling developers to build collaborative applications where users can work together in real-time.

In this project, Yjs is used to allow multiple users to collaboratively create and edit visual representations of poems. Users can work on the same poem simultaneously, with all their changes automatically and deterministically merged.

## Inspiration from Traditional Brush Painting

The visual design of the application is inspired by the great brush/ink artists of Chinese and Japanese traditional brush painting. The application provides a canvas where users can create visual representations of poems using brush strokes that mimic the style of traditional brush painting.

## Visualizing Poems with D3

D3.js, a JavaScript library for creating data-driven documents, is used to create the visual representations of the poems. D3.js allows for a high level of customization and control over the visual elements, enabling the creation of unique and artistic visualizations.

## Natural Language Processing

Natural Language Processing (NLP) is used to analyze the a user's poems and then graph them using d3s. For example, NLP (using compromise js) can be used to identify adjectives, nouns etc, the main themes, etc.

## Running the Project

To run the project locally, use the following command:

```bash
$env:GATSBY_EXPERIMENTAL_DEV_SSR="true"; gatsby develop
```

You can then test the project by sending a POST request to the local server:

## run on server to test locally 
```bash
$env:GATSBY_EXPERIMENTAL_DEV_SSR="true"; gatsby develop
```

## test
```bash
curl.exe -X POST "http://localhost:8888/.netlify/functions/retrieveOffer" -H "Content-Type: application/json" -d '{\"peerId\": \"your-peer-id\"}'
```

# CRDT and Yjs Discussion / Tutorial

## Introduction

Conflict-free Replicated Data Types (CRDTs) are data structures that enable multiple replicas to be updated independently without coordination. The updates can then be merged deterministically, ensuring strong eventual consistency across all replicas.

Yjs is a JavaScript library that implements CRDTs. These allow developers to build collaborative applications where users can work together in real-time.

In my explorations of CDRTs I was curious to understand if I could avoid a backend server entirely. Ultimately, I wound up using the public YJS demo servr (not for production). 

My original plan was to use WebRTC and create a number of manual IDs or peers and each time a user opens an instance of the app, the app randomly chooses an ID and then randomly at intervals searches for another peer nearby (using one of the 10 or so IDs stored). Ulimtinatley, this solution was not performant (too many searches.)

## Yjs Basics

Yjs provides several data types, including Y.Text, Y.Array, Y.Map, and others. These data types can be updated independently on different replicas, and the changes will be merged automatically.

Here's an example of how to create a Yjs document and a Y.Text type:

```javascript
import * as Y from 'yjs';

const ydoc = new Y.Doc();
const ytext = ydoc.getText('text');
```

In this code, `new Y.Doc()` creates a new Yjs document, and `ydoc.getText('text')` creates a new Y.Text type in the document.

## Real-time Collaboration with Yjs

Yjs supports various network providers for syncing changes between different replicas. One of them is the WebsocketProvider, which uses WebSockets for real-time communication.

Here's an example of how to set up a WebsocketProvider:

```javascript
import { WebsocketProvider } from 'y-websocket';

const provider = new WebsocketProvider(
  'wss://demos.yjs.dev/ws',
  'my-room',
  ydoc
);
```

In this code, `new WebsocketProvider('wss://demos.yjs.dev/ws', 'my-room', ydoc)` creates a new WebsocketProvider that connects to the WebSocket server at 'wss://demos.yjs.dev/ws' and syncs changes for the 'my-room' room.

## Observing Changes

Yjs data types emit events when they are changed. You can observe these events to update your application state.

Here's an example of how to observe changes to a Y.Text type:

```javascript
ytext.observe(event => {
  console.log('Text changed:', ytext.toString());
});
```

In this code, `ytext.observe(event => {...})` sets up an observer that logs the new text whenever the Y.Text type is changed.

## Updating Yjs Data Types

You can update Yjs data types using their methods. For example, you can use the `insert` and `delete` methods to update a Y.Text type:

```javascript
ytext.insert(0, 'Hello, world!');
ytext.delete(0, 1);
```

In this code, `ytext.insert(0, 'Hello, world!')` inserts 'Hello, world!' at the beginning of the text, and `ytext.delete(0, 1)` deletes the first character.


## Webpack Configuration

In the `gatsby-node.js` file, the `onCreateWebpackConfig` function is used to extend the default Webpack configuration used by Gatsby. This is done using the `setWebpackConfig` action provided by Gatsby.

```javascript
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
  });
};
```

In this code, the `setWebpackConfig` action is used to enable WebAssembly experiments, add a rule for `.wasm` files, and set performance hints. This was mainly due to my attenpt to run AutoMerge - which uses WASM under the hood. I struggled to get it to run (choosing YJS ultimately).

## Fetching Data from Wikipedia

The `createPages` function is used to fetch data from the Wikipedia API for a list of topics, and create a page for each topic.

```javascript
exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  const fetch = (await import('node-fetch')).default;

  const topics = ['Xu_Wei', 'Tosa_Mitsuoki', 'Ike_no_Taiga', 'Yosa_Buson'];

  const pagesData = await Promise.all(topics.map(async topic => {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${topic}`);
    const data = await response.json();
    const imageUrl = data.thumbnail ? data.thumbnail.source : null;
    return {
      title: data.title,
      summary: data.extract,
      imageUrl: imageUrl,
      author: 'Wikipedia'
    };
  }));

  pagesData.forEach(data => {
    createPage({
      path: `/study-guide/${data.title}`,
      component: path.resolve(`./src/templates/studyGuide.js`),
      context: {
        title: data.title,
        summary: data.summary,
        imageUrl: data.imageUrl,
        author: data.author,
      },
    });
  });
};
```

In this code, the `createPages` function fetches data from the Wikipedia API for each topic, and then uses the `createPage` action to create a page for each topic. The fetched data is passed to the page component via the `context` property.

## GraphQL Usage

While this `gatsby-node.js` file does not directly use GraphQL, Gatsby uses GraphQL extensively for data querying. The data passed to the page component via the `context` property can be queried using GraphQL in the page component. For example, you could use a GraphQL query like the following in your `studyGuide.js` template to access the data:

```javascript
export const query = graphql`
  query($title: String!) {
    markdownRemark(frontmatter: { title: { eq: $title } }) {
      frontmatter {
        title
        summary
        imageUrl
        author
      }
    }
  }
`;
```

In this query, `$title` is a variable that gets its value from the `context` property passed in `createPage`. The query fetches the title, summary, image URL, and author of the markdown file with the matching title.