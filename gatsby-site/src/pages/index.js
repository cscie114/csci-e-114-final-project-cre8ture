import React from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import Layout from "../components/layout"; // Ensure the correct casing in the import

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
  const titleStart = 13; // Length of '/study-guide/'
  const titleEnd = path.length - 1; // Avoid the trailing slash
  return path.substring(titleStart, titleEnd);
};
  console.log("data", data)

  return (
    <Layout>
      <main>
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
