import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AddProduct, Dashboard, EditProduct, Login, Products } from './Admin';
import { ProtectedRoutes } from './Auth';
import { UserAddProduct, UserDashboard, UserProducts } from './User';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Define routes here */}
          <Route path="/" element={<Login />} />
          <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoutes>
                            <Dashboard />
                        </ProtectedRoutes>
                    }
                />
          <Route
                    path="/products"
                    element={
                        <ProtectedRoutes>
                            <Products />
                        </ProtectedRoutes>
                    }
                />
          <Route
                    path="/add-product"
                    element={
                        <ProtectedRoutes>
                            <AddProduct />
                        </ProtectedRoutes>
                    }
                />
          <Route
                    path="/product/:id/edit"
                    element={
                        <ProtectedRoutes>
                            <EditProduct />
                        </ProtectedRoutes>
                    }
                />
          <Route
                    path="/user-dashboard"
                    element={
                        <ProtectedRoutes>
                            <UserDashboard />
                        </ProtectedRoutes>
                    }
                />
          <Route
                    path="/user-add-product"
                    element={
                        <ProtectedRoutes>
                            <UserAddProduct />
                        </ProtectedRoutes>
                    }
                />
          <Route
                    path="/user-products"
                    element={
                        <ProtectedRoutes>
                            <UserProducts />
                        </ProtectedRoutes>
                    }
                />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
