import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <div className="app-root">
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<div>About Page</div>} />
          <Route path="/contact" element={<div>Contact Page</div>} />
          <Route path="/upload" element={<div>Upload Page</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;