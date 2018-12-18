import React from 'react';
import AppFinal from './AppFinal'

class App extends React.Component {
  render(){
    return(
      <AppFinal dataFile="striatum_f410_traces.json" contourFile="striatum_f410_contours.json"></AppFinal>
    );
  }  
}

export default App;
