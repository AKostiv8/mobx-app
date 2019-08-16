import React from 'react';
// import logo from './logo.svg';
import ReactDOM from 'react-dom';
import {TableCustom, Appstore} from './TableCustom';
// import TableStore from './tableStore';
import './App.css';

ReactDOM.render(<TableCustom store={Appstore}/>, document.getElementById('custom-table'));

function App() {
  return (
    <div className="App">

    </div>
  );
}

export default App;
