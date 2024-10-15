import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBox, FaCalendarPlus } from 'react-icons/fa';
import moment from 'moment';
import { NavBar } from '../components';

const Dashboard = () => {
    const [totalProducts, setTotalProducts] = useState(0);
    const [recentProducts, setRecentProducts] = useState([]);

    // Fetch total number of products and products added this month
    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/products');
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
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProductsData();
    }, []);

    return (
        <NavBar activeLink={'dashboard'}>
            <h1 className="text-3xl font-bold text-center mb-8">Product Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                {/* Total Products Card */}
                <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
                    <div className="flex items-center mb-2">
                        <FaBox className="text-4xl text-blue-600 mr-2" />
                        <h2 className="text-xl font-semibold">Total Products</h2>
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
                        <h2 className="text-xl font-semibold">Products Added This Month</h2>
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

        </NavBar>

    );
};

export default Dashboard;
