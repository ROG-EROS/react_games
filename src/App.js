import React from "react";  
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
import "./App.css";  
import Game from "./components/game";  

function App() {  
  return (  
    <div className="App">  
      <Game />  
    </div>  
  );  
}  

export default App;