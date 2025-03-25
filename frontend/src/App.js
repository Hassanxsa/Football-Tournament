import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
    <div>
        <Routes>
            <Route path="/" element={<div>hello world</div>} />
        </Routes>
    </div>
</Router>

  );
}

export default App;
