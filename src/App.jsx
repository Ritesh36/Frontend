import { useState, useEffect, use } from 'react'
import './App.css'
import "prismjs/themes/prism-okaidia.css"
import prism from 'prismjs'
import Editor from "react-simple-code-editor"
import axios from 'axios'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/atom-one-dark.css'

function App() {
  const [count, setCount] = useState(0)
  const [code, setCode] = useState(`function App() {
  return 1+2
}`)

const [review, setReview] = useState('');

useEffect(() => {
  prism.highlightAll()
}, [])

async function reviewCode() {
  try {
    const response = await axios.post('https://ai-code-reviewer-kl4u.onrender.com/get-review', { code });
    setReview(response.data);
  } catch (error) {
    console.error('Error reviewing code:', error);
  }
}



  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={code => prism.highlight(code, prism.languages.javascript, 'javascript')}
              padding={10}
              className="editor"
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                backgroundColor: '#282c34',
                color: '#abb2bf',
                height: '100%',
                width: '100%',
              }}
            />
          </div>
          <div className="review" onClick={reviewCode}>Review</div>
        </div>
        <div className="right">
          <Markdown
            rehypePlugins={[rehypeHighlight]}
            >{review}</Markdown>
        </div>
      </main>
    </>
  )
}


export default App
