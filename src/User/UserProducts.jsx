import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaTimesCircle, FaBoxes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { UserNavBar } from '../components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // For loading the product
    const navigate = useNavigate();

    // Fetch products from the API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/products',{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                      },
                });
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

    if(loading){
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <FaBoxes className="text-indigo-500 text-4xl animate-spin" />
            </div>
        );
    }

    return (
        <UserNavBar activeLink={'products'}>
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
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                </div>
                
            </div>
            </div>
            
        </UserNavBar>
    );
};

export default UserProducts;
