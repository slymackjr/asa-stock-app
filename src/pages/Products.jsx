import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrashAlt, FaTimesCircle, FaCheckCircle, FaBoxes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { NavBar } from '../components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // For loading the product
    const navigate = useNavigate();

    // Fetch products from the API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/products');
                setProducts(response.data.data);
                setLoading(false);
            } catch (error) {
                toast.error(
                    <div className="flex items-center">
                        <FaTimesCircle className="text-white bg-red-500 rounded-full mr-2 p-1" />
                        Failed to load product details.
                    </div>,
                    { position: 'top-center' }
                );
                setLoading(false)
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
                toast.success(
                    <div className="flex items-center">
                        <FaCheckCircle className="text-white bg-green-500 rounded-full mr-2 p-1" />
                        Product deleted successfully!
                    </div>,
                    { position: 'top-center' }
                );
            } catch (error) {
                // Show error message
            toast.error(
                <div className="flex items-center">
                    <FaTimesCircle className="text-white bg-red-500 rounded-full mr-2 p-1" />
                    Failed to update product. Please try again.
                </div>,
                { position: 'top-center' }
            );
            }
        }
    };

    if(loading){
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <FaBoxes className="text-indigo-500 text-4xl animate-spin" />
            </div>
        );
    }

    return (
        <NavBar activeLink={'products'}>
            <div className="flex flex-col flex-grow">
            <ToastContainer autoClose={5000} hideProgressBar={true} newestOnTop={true} closeOnClick pauseOnHover draggable />   
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
                <div className="overflow-x-auto">
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
                                        <div className="flex space-x-8">
                                            <button
                                                onClick={() => handleEditProduct(product.id)}
                                                className="text-blue-600 hover:text-blue-800 transition duration-300"
                                            >
                                                <FaEdit className="text-2xl"/>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="text-red-600 hover:text-red-800 transition duration-300"
                                            >
                                                <FaTrashAlt className="text-2xl" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                </div>
                
            </div>
            </div>
            
        </NavBar>
    );
};

export default Products;
