import React, { useState, useEffect } from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import Layout from "../components/layout"
import { storeUsername, retrieveUsername } from "../libs/store/usernames"

// const IndexPage = () => {
//   const [username, setUsername] = useState("")

//   // Initialize username from localStorage on client side only
//   useEffect(() => {
//     const storedUsername = retrieveUsername()
//     setUsername(storedUsername)
//   }, [])

//   // Update local storage whenever the username changes
//   useEffect(() => {
//     storeUsername(username)
//   }, [username])

const IndexPage = () => {
  const [username, setUsername] = useState(() => {
    if (typeof window !== 'undefined') {
      return retrieveUsername();
    }
    return '';
  });

  // Update local storage whenever the username changes
  useEffect(() => {
    if (username !== '') {
      storeUsername(username);
    }
  }, [username]);

  const data = useStaticQuery(graphql`
    query {
      allSitePage(filter: { path: { regex: "/study-guide/" } }) {
        nodes {
          path
        }
      }
    }
  `)

  const formatTitle = path => {
    const titleStart = 13 // Length of '/study-guide/'
    const titleEnd = path.length - 1 // Avoid the trailing slash
    return path.substring(titleStart, titleEnd)
  }

  const poem1 = `送别, 王维 (“Farewell”, by Wang Wei)
下马饮君酒
问君何所之
君言不得意
归卧南山垂
但去莫复问
白云无尽时`
    .split("\n")
    .map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ))

  const poem2 = `Dismounted, we drank to bid you farewell.
I asked, “My friend, where are you heading?”
You said, “Oh, nothing is working my way,
So be back to the crags of Nanshan, retiring.”
“Go then!  You’ll ask of the world no more!
Ah, days of endless white clouds, unending!”`
    .split("\n")
    .map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ))

  return (
    <Layout>
      <main>
        <h1>Welcome to Collaborative Brushes and Poems</h1>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Korea-Kang_Sehwang-Yeongtong_donggudo.jpg"
          alt="Korea-Kang_Sehwang-Yeongtong_donggudo"
        />
        <article>{poem1}</article>
        <br></br>
        <hr />
        <br></br>
        <article>{poem2}</article>
        <br />
        <hr></hr>
        <br />
        <form>
          <label>
            Enter a username to remember you across devices (Experimental):
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter a username"
            />
          </label>
        </form>
        <h2>Write poems inspired by paintings</h2>

        <h3>How to do this?</h3>
        <ul>
          <li>Enter a username in the input above</li>
          <li>Click an artist below</li>
          <li>Open the same artist link in a new device or browser tab</li>
          <li>Type into the editor and watch your edits sync</li>
        </ul>
        <br />
        <ul>
          <h3>Artists</h3>
          {data.allSitePage.nodes.map(node => (
            <li style={{marginLeft: '25px'}} key={node.path}>
              <Link to={node.path}>{formatTitle(node.path)}</Link>
            </li>
          ))}
        </ul>
      </main>
    </Layout>
  )
}

export default IndexPage
