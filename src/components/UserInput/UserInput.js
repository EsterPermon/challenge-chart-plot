import React, { useState, useRef, useEffect } from 'react';


import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import '../../assets/prism-vsc-dark-plus.css';

import './UserInput.css'

const UserInput = React.memo(props => {
  const [enteredInput, setEnteredInput] = useState('');
  const editorRef = useRef();
  const editorContainerRef = useRef();
  const {sendInput, sendResizeEvent} = props;

  useEffect(() => {
    const timer = setTimeout(() => {
      if(enteredInput === editorRef.current.props.value){
        sendInput(enteredInput);
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
    }
  }, [enteredInput, sendInput, editorRef]);

  //Listening input area resize in order to resize chart
  useEffect(() => {
    const resizeObserver = new ResizeObserver(sendResizeEvent).observe(editorContainerRef.current);
    return () => {
      resizeObserver.disconnect();
    }
  }, [editorContainerRef, sendResizeEvent])

  const hightlightWithLineNumbers = (input, language) =>
  highlight(input, language)
    .split("\n")
    .map((line, i) => `<span class='editorLineNumber'>${i + 1}.</span>${line}`)
    .join("\n");

  return(
    <div 
      className="editor-container" 
      ref={editorContainerRef}
    >
      <Editor
        className="editor"
        value={enteredInput}
        highlight={code => hightlightWithLineNumbers(code, languages.js)}
        textareaId="textArea"
        onValueChange={code => setEnteredInput(code)}
        ref={editorRef}
      />
    </div>
  )
});

export default UserInput;