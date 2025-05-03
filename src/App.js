import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FileUpload from './pages/FileUpload';
import UpdateSetting from './pages/UpdateSetting';

function App() {
  return (
    <div className="app-root">
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<div>About Page</div>} />
          <Route path="/contact" element={<div>Contact Page</div>} />
          <Route path="/upload" element={<FileUpload/>} />
          <Route path="/setting" element={<UpdateSetting/>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;