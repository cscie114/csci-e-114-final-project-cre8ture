import React from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import Layout from "../components/layout.js";
const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query {
      allSitePage(filter: {path: {regex: "/study-guide/"}}) {
        nodes {
          path
        }
      }
    }
  `);

  const formatTitle = path => {
    // Assuming the title is the last part of the path, e.g., "/study-guide/Gatsby_(software)"
    const titleSegment = path.split('/').pop(); // gets "Gatsby_(software)"
    return decodeURIComponent(titleSegment.replace(/_/g, ' ')); // Replace underscores with spaces, decode URI encoding
  };

  return (
    <Layout>    <main>
      <h1>Welcome to the Study Guides</h1>
      <ul>
        {data.allSitePage.nodes.map(node => (
          <li key={node.path}>
            <Link to={node.path}>{formatTitle(node.path)}</Link>
          </li>
        ))}
      </ul>
    </main>
    </Layout>

  );
};

export default IndexPage;
