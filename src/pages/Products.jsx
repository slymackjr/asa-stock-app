import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { NavBar } from '../components';

const Products = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    // Fetch products from the API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/products');
                setProducts(response.data.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    // Navigate to Add Product Page
    const handleAddProduct = () => {
        navigate('/add-product');
    };

    // Navigate to Edit Product Page
    const handleEditProduct = (id) => {
        navigate(`/product/${id}/edit`);
    };

    // Delete Product
    const handleDeleteProduct = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8000/api/product/${id}/delete`);
                setProducts(products.filter(product => product.id !== id)); // Remove deleted product from list
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    return (
        <NavBar activeLink={'products'}>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Products</h1>
                <button 
                    onClick={handleAddProduct} 
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 mt-3"
                >
                    <FaPlus className="mr-2" /> Add Product
                </button>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Product Name</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Part Number</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Shelf Location</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Added On</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">No products available</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-100">
                                    <td className="py-3 px-4 border-b">{product.productName}</td>
                                    <td className="py-3 px-4 border-b">{product.partNumber}</td>
                                    <td className="py-3 px-4 border-b">{product.shelfLocation}</td>
                                    <td className="py-3 px-4 border-b">
                                        {moment(product.created_at).format('MMMM Do YYYY')}
                                    </td>
                                    <td className="py-3 px-4 border-b">
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => handleEditProduct(product.id)}
                                                className="text-blue-600 hover:text-blue-800 transition duration-300"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="text-red-600 hover:text-red-800 transition duration-300"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </NavBar>
    );
};

export default Products;
