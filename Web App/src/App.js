import logo from './mushcute.gif';
import './App.css';

function uploadImage(e){

}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Please upload an image.
        </p>
        <button className = "upload-button" onClick={uploadImage}>
          Upload
        </button>
      </header>
    </div>
  );
}

export default App;
