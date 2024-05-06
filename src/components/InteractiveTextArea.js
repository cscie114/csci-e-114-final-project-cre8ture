import React, { useState, useEffect, useRef } from "react"
import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket"
import nlp from "compromise"
import { updateGraph } from "../libs/createGraph"
import html2canvas from "html2canvas"

const InteractiveTextAnalysis = () => {
  const [inputText, setInputText] = useState("")
  const editorRef = useRef(null)
  const svgRef = useRef(null)
  const ydocRef = useRef(new Y.Doc()) // Use ref to persist Y.Doc instance during  re-renders
  const ytextRef = useRef(null)

  // useEffect(() => {
  //   if (typeof window !== "undefined" && editorRef.current) {
  //     const provider = new WebsocketProvider(
  //       "wss://demos.yjs.dev/ws",
  //       "kai-demo-doog",
  //       // 'ws://localhost:1234', // my backend that I have not deployed to cloud
  //       // 'nlp-demo-room', // Random Room name
  //       ydocRef.current
  //     )

  //     ytextRef.current = ydocRef.current.getText("text")

  //     // Bind textarea to Yjs
  //     ytextRef.current.observe(event => {
  //       setInputText(ytextRef.current.toString())
  //     })

  //     // Setup initial value if empty
  //     if (!ytextRef.current.toString()) {
  //       ytextRef.current.insert(0, "Start writing your poem here...")
  //     }

  //     // Cleanup
  //     return () => {
  //       provider.disconnect()
  //     }
  //   }
  // }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && editorRef.current) {
      const roomName = window.location.pathname;
      const provider = new WebsocketProvider(
        "wss://demos.yjs.dev/ws",
        roomName,
        ydocRef.current
      )
  
      ytextRef.current = ydocRef.current.getText("text")
  
      // Bind textarea to Yjs
      ytextRef.current.observe(event => {
        setInputText(ytextRef.current.toString())
      })
  
      // Setup initial value if empty
      if (!ytextRef.current.toString()) {
        ytextRef.current.insert(0, "Start writing your poem here...")
      }
  
      // Cleanup
      return () => {
        provider.disconnect()
      }
    }
  }, [])

  const handleInputChange = event => {
    const newText = event.target.value
    setInputText(newText)

    // Correctly update the shared Yjs text document
    if (ytextRef.current) {
      ytextRef.current.delete(0, ytextRef.current.length)
      ytextRef.current.insert(0, newText)
    }
  }

  // Analyze text using 'compromise' NLP library
  useEffect(() => {
    if (inputText) {
      analyzeText(inputText)
    }
  }, [inputText])

  const analyzeText = text => {
    const doc = nlp(text)
    const nouns = doc.nouns().out("array")
    const adjectives = doc.adjectives().out("array")
    const verbs = doc.verbs().out("array")

    console.log("Nouns:", nouns)
    console.log("Adjectives:", adjectives)
    console.log("Verbs:", verbs)

    updateGraph({ nouns, adjectives, verbs, svgRef })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inputText).then(() => {
      alert("Text copied to clipboard!")
    })
  }

  const downloadText = () => {
    const element = document.createElement("a")
    const file = new Blob([inputText], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "poem.txt"
    document.body.appendChild(element) // Required for this to work in FireFox
    element.click()
    document.body.removeChild(element)
  }

  const captureScreenshot = () => {
    html2canvas(document.body).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      let link = document.createElement('a');
      link.href = imgData;
      link.download = 'screenshot.png';
      link.click();
    });
  };

  const shareText = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Poem",
          text: inputText,
          url: document.location.href,
        })
      } catch (err) {
        console.error("Error sharing the text: ", err)
      }
    } else {
      alert("Share not supported on this browser.")
    }
  }

  return (
    <div>
      <textarea
        ref={editorRef}
        onChange={handleInputChange}
        value={inputText}
        style={{
          width: "100%",
          height: "200px",
          color: "white",
          padding: "10px",
          backgroundColor: "#212121",
        }}
      />
      <svg ref={svgRef} style={{ width: "100%" }} />
      <div style={{ textAlign: "right" }}>
        <div>
          <button
            onClick={copyToClipboard}
            title="Copy"
            style={{ color: "white", border: "none" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
              />
            </svg>
          </button>
          <button
            onClick={downloadText}
            title="Download"
            style={{ color: "white", border: "none" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
              />
            </svg>
          </button>

          <button
            onClick={captureScreenshot}
            title="Screenshot"
            style={{ color: "white", border: "none" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
              />
            </svg>
          </button>

          <button
            onClick={shareText}
            title="Share"
            style={{ color: "white", border: "none" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default InteractiveTextAnalysis
