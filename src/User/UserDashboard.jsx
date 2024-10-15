import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBox, FaBoxes, FaCalendarPlus, FaTimesCircle } from 'react-icons/fa';
import moment from 'moment';
import { UserNavBar } from '../components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserDashboard = () => {
    const [totalProducts, setTotalProducts] = useState(0);
    const [recentProducts, setRecentProducts] = useState([]);
    const [loading, setLoading] = useState(true); // For loading the product

    // Fetch total number of products and products added this month
    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/products',{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                      },
                });
                const allProducts = response.data.data;

                // Total number of products
                setTotalProducts(allProducts.length);

                // Filter products added this month
                const currentMonth = moment().month();
                const productsThisMonth = allProducts.filter(product => {
                    const productDate = moment(product.created_at);
                    return productDate.month() === currentMonth;
                });

                setRecentProducts(productsThisMonth);
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

        fetchProductsData();
    }, []);

    if(loading){
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <FaBoxes className="text-indigo-500 text-4xl animate-spin" />
            </div>
        ); 
    }

    return (
        <UserNavBar activeLink={'dashboard'}>
            <div className="flex flex-col flex-grow">
            <ToastContainer autoClose={5000} hideProgressBar={true} newestOnTop={true} closeOnClick pauseOnHover draggable />
                <h1 className="text-3xl font-bold text-center mb-8">Product Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    {/* Total Products Card */}
                    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
                        <div className="flex items-center mb-2">
                            <FaBox className="text-4xl text-blue-600 mr-2" />
                            <h2 className="text-xl font-semibold">Products</h2>
                        </div>
                        <div className="flex items-center">
                            <FaBox className="text-2xl text-blue-600 mr-2" />
                            <p className="text-3xl font-bold text-gray-700">{totalProducts}</p>
                        </div>
                    </div>

                    {/* Products Added This Month Card */}
                    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
                        <div className="flex items-center mb-2">
                            <FaCalendarPlus className="text-4xl text-orange-600 mr-3" />
                            <h2 className="text-xl font-semibold">This Month</h2>
                        </div>
                        <div className="flex items-center">
                            <FaCalendarPlus className="text-2xl text-orange-600 mr-2" />
                            <p className="text-3xl font-bold text-gray-700">{totalProducts}</p>
                        </div>
                    </div>
                </div>

                {/* Recent Products Table */}
                <div className="bg-white shadow-md rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Recently Added Products</h2>
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
                                {recentProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-gray-500">No products added this month</td>
                                    </tr>
                                ) : (
                                    recentProducts.map((product) => (
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

export default UserDashboard;
