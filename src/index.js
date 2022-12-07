import React from 'react';
import ReactDOM from 'react-dom/client';
import { usePromiseTracker } from "react-promise-tracker";
import {TailSpin} from "react-loader-spinner";
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

export default function LoadingIndicator(props) {
    const { promiseInProgress } = usePromiseTracker();
  
       return (
        promiseInProgress && 
           <div
              style={{
                position:"absolute",
                width: "100%",
                height: 100,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "z-index":"0",
                "margin-top":"100px",
              }}
            >
              <TailSpin />
            </div>
     );  
    }
  
  
  root.render(
    <div>
      <LoadingIndicator/>
      <App/>
    </div>
  );
  