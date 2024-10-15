import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AddProduct, Dashboard, EditProduct, Login, Products } from './pages';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Define routes here */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/product/:id/edit" element={<EditProduct />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
