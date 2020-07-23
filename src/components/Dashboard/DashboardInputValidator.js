import { useRef, useCallback } from "react";

 const EVENT_PROPERTIES_LENGTH = Object.freeze({
  SPAN: 4,
  START: 4,
  STOP: 2
});

class DashboardInputValidator {
  
  dataEventPropertiesLength = useRef();
  
  constructor(setStartEvent, setSpanEvent, setDataEvent, 
    setStopEvent, setInvalidInput, setIgnoredInput, setEndOfInputHandling) {
    this.setStartEvent = setStartEvent;
    this.setSpanEvent = setSpanEvent;
    this.setDataEvent = setDataEvent;
    this.setStopEvent = setStopEvent;
    this.setInvalidInput = setInvalidInput;
    this.setIgnoredInput = setIgnoredInput;
    this.setEndOfInputHandling = setEndOfInputHandling;
  }

  checkObjectPropertiesLength = (obj, propertiesLength, lineNumber) => {
    if(Object.keys(obj).length < propertiesLength){
      this.setIgnoredInput(prev => prev.length ? prev : 'Missing property at line '.concat(lineNumber));
      return false;
    }
    return true;
  };

  newSpanEventHandler = useCallback((obj, lineNumber) =>{
    if(obj.hasOwnProperty('begin') && 
      obj.hasOwnProperty('end') && 
      obj.begin <= obj.end) {
        this.setSpanEvent({...obj});
    } else {
      this.setIgnoredInput(prev => prev.length ? prev : 'Invalid span event at line '.concat(lineNumber));
    }
  },[]);

  newDefaultEventHandler = useCallback((obj, eventPropertiesLength, started, stopped, lineNumber, isData) => {
    if(this.checkObjectPropertiesLength(obj, eventPropertiesLength, lineNumber)){
      if(started){
        if(isData) {
          this.setDataEvent(prevData => [...prevData, {...obj}])
        } else {
          this.newSpanEventHandler(obj, lineNumber);
        }
      } else if(stopped){
        this.setIgnoredInput(prev => prev.length ? prev : 'Inputs after stop event ignored at line '.concat(lineNumber));
      } else{
        this.setIgnoredInput(prev => prev.length ? prev : 'Inputs before start event ignored at line '.concat(lineNumber));
      }
    }
    return false;
  },[this.newSpanEventHandler]);

  newStartEventHandler = (obj) => {
    this.dataEventPropertiesLength.current = 2 + obj.select.length + obj.group.length;
    this.setDataEvent([]);
    this.setStartEvent({...obj});
  };

  /*
     * Adding double quotes to the keys and replacing
     * single quotes for double quotes in the values
     * to enable the JSON.parse usage
     */
  inputParse = (input) => {
    const regex = /(\w+):/g;
    input = input.replace(regex, (a, b) => "\"" + b + "\":" );
    input = input.replace(/'/g, '"');
    return input.split("\n");
  };

  hasMandatoryPros = (obj) => obj.hasOwnProperty('type') && obj.hasOwnProperty('timestamp');


  readDataFromInput = useCallback((input) => { 
    let started = false;
    let stopped = false;
    let interrupted = false;
    let obj;
    const inputLines = this.inputParse(input);

    for(let i=0; i<inputLines.length; i++ ) {
      try {
        obj = JSON.parse(inputLines[i]);
      //Events without the mandatory props are ignored
        if(this.hasMandatoryPros(obj)){
          switch (obj.type) {
            // Start events clean possible old data sets and allow new events handling
            case 'start':
              if(!started){
                if(!this.checkObjectPropertiesLength(obj, EVENT_PROPERTIES_LENGTH.START, i+1)){
                  break;
                }
                this.newStartEventHandler(obj);
                started = true
              } else {
                this.setIgnoredInput(prev => prev.length ? prev : 'New start event before stop event ignored at line '.concat(i+1));
              }
              break;
            // Stop events turn the started flag false therefore new events will be ignored
            case 'stop':
              if(started){
                if(this.checkObjectPropertiesLength(obj, EVENT_PROPERTIES_LENGTH.STOP, i+1)){
                  this.setStopEvent({...obj});
                  started = false;
                  stopped = true;
                }
              } else {
                this.setIgnoredInput(prev => prev.length ? prev : 'Inputs before start event ignored at line '.concat(i+1));
              }
              break;
            // Span and data events are processed only if a start event was already inputted
            case 'span':
              this.newDefaultEventHandler(obj, EVENT_PROPERTIES_LENGTH.SPAN, started, stopped, i+1, false);
              break;
            case 'data':
              this.newDefaultEventHandler(obj, this.dataEventPropertiesLength.current, started, stopped, i+1, true);
              break;
            default:
              this.setIgnoredInput(prev => prev.length ? prev : 'Invalid event type at line '.concat(i+1));
              break;
          }
        } else {
          this.setInvalidInput(prev => prev.length ? prev : 'Missing mandatory property at line '.concat(i+1));
          interrupted = true;
          break;
        }
      }
      catch (e) {
        this.setInvalidInput(prev => prev.length ? prev : 'Malformed input at line '.concat(i+1));
        console.log(e);
        interrupted = true;
        break;
      }
    }
    if(!started && !stopped && !interrupted){
      this.setInvalidInput(prev => prev.length ? prev : 'Start event not found');
    }
    this.setEndOfInputHandling(prev => !prev);
  },[this.newDefaultEventHandler]);
}

export default DashboardInputValidator;