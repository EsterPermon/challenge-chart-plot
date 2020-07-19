import React, { useState, useRef, useEffect } from 'react';

import './UserInput.css'

const UserInput = React.memo(props => {

  const [enteredInput, setEnteredInput] = useState('');
  const inputRef = useRef();
  const {sendInput} = props;

  useEffect(() => {
    const timer = setTimeout(() => {
      if(enteredInput === inputRef.current.value){
        sendInput(enteredInput);
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
    }
  }, [enteredInput, sendInput]);

  return(
    <div className="user-input">
      <textarea
        className="text-area"
        onChange={event => setEnteredInput(event.target.value)} 
        ref={inputRef}>
      </textarea>
    </div>
  )
});

export default UserInput;