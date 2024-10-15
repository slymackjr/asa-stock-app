import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaBarcode, FaTag, FaLocationArrow, FaDollarSign, FaBoxes, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { NavBar } from '../components';

const EditProduct = () => {
    const { id } = useParams(); // Get product ID from URL parameters
    const [formData, setFormData] = useState({
        productName: '',
        partNumber: '',
        shelfLocation: '',
        price: '',
        quantity: '',
    });
    const [loading, setLoading] = useState(true); // For loading the product

    // Fetch product data when the component mounts
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/product/${id}/update`,{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                      },
                });
                const product = response.data.data;
                
                setFormData({
                    productName: product.productName || '',
                    partNumber: product.partNumber || '',
                    shelfLocation: product.shelfLocation || '',
                    price: product.price || '',
                    quantity: product.quantity || '',
                });
                setLoading(false);
            } catch (error) {
                toast.error(
                    <div className="flex items-center">
                        <FaTimesCircle className="text-white bg-red-500 rounded-full mr-2 p-1" />
                        Failed to load product details.
                    </div>,
                    { position: 'top-center' }
                );
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.put(`http://localhost:8000/api/product/${id}/update`, formData);

            // Show success message
            toast.success(
                <div className="flex items-center">
                    <FaCheckCircle className="text-white bg-green-500 rounded-full mr-2 p-1" />
                    Product updated successfully!
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
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <FaBoxes className="text-indigo-500 text-4xl animate-spin" />
            </div>
        );
    }

    return (
        <NavBar activeLink={'products'}>
            <div className="flex items-center justify-center">
            {/* Toast Container for displaying messages */}
            <ToastContainer autoClose={5000} hideProgressBar={true} newestOnTop={true} closeOnClick pauseOnHover draggable />

            <div className="bg-white p-2 rounded-lg shadow-lg max-w-lg w-full">
                <h1 className="text-2xl font-bold mb-6 text-center">Edit Product</h1>
                <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
                    {/* Product Name */}
                    <div>
                        <label className="block text-gray-700">Product Name</label>
                        <div className="relative">
                            <FaTag className="absolute top-3 left-3 text-gray-400" />
                            <input
                                type="text"
                                name="productName"
                                value={formData.productName}
                                onChange={handleInputChange}
                                className="w-full pl-10 p-2 border rounded-md mt-1 focus:ring focus:ring-indigo-200"
                                placeholder="Enter product name"
                                required
                            />
                        </div>
                    </div>

                    {/* Part Number */}
                    <div>
                        <label className="block text-gray-700">Part Number</label>
                        <div className="relative">
                            <FaBarcode className="absolute top-3 left-3 text-gray-400" />
                            <input
                                type="text"
                                name="partNumber"
                                value={formData.partNumber}
                                onChange={handleInputChange}
                                className="w-full pl-10 p-2 border rounded-md mt-1 focus:ring focus:ring-indigo-200"
                                placeholder="Enter part number"
                                required
                            />
                        </div>
                    </div>

                    {/* Shelf Location */}
                    <div>
                        <label className="block text-gray-700">Shelf Location</label>
                        <div className="relative">
                            <FaLocationArrow className="absolute top-3 left-3 text-gray-400" />
                            <input
                                type="text"
                                name="shelfLocation"
                                value={formData.shelfLocation}
                                onChange={handleInputChange}
                                className="w-full pl-10 p-2 border rounded-md mt-1 focus:ring focus:ring-indigo-200"
                                placeholder="Enter shelf location"
                                required
                            />
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-gray-700">Price</label>
                        <div className="relative">
                            <FaDollarSign className="absolute top-3 left-3 text-gray-400" />
                            <input
                                type="text"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full pl-10 p-2 border rounded-md mt-1 focus:ring focus:ring-indigo-200"
                                placeholder="Enter price"
                                required
                            />
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-gray-700">Quantity</label>
                        <div className="relative">
                            <FaBoxes className="absolute top-3 left-3 text-gray-400" />
                            <input
                                type="text"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className="w-full pl-10 p-2 border rounded-md mt-1 focus:ring focus:ring-indigo-200"
                                placeholder="Enter quantity"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300"
                    >
                        Update Product
                    </button>
                </form>
            </div>
        </div>
        </NavBar>
    );
};

export default EditProduct;
