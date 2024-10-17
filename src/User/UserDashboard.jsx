import { useEffect, useState } from 'react';
import { FaBox, FaBoxes, FaCalendarPlus, FaTimesCircle } from 'react-icons/fa';
import moment from 'moment';
import { UserNavBar } from '../components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../Hooks/Axios';
import { FaSearch } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';


const UserDashboard = () => {
    const [totalProducts, setTotalProducts] = useState(0);
    const [recentProducts, setRecentProducts] = useState([]);
    const [loading, setLoading] = useState(true); // For loading the product
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Default is 5 items per page

    // Filter the products based on searchTerm
    const filteredProducts = recentProducts.filter(product => 
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shelfLocation.toLowerCase().includes(searchTerm.toLowerCase())
    );

     // Handle Pagination
     const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
     const handlePageClick = ({ selected }) => setCurrentPage(selected);
 

    // Get the products for the current page
    const displayProducts = filteredProducts.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    // Fetch total number of products and products added this month
    useEffect(() => {
        const fetchProductsData = async () => {
            try {
                const response = await axiosInstance.get('/products');
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
                <h1 className="text-3xl font-bold text-center mb-8">Welcome,</h1>

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
                <div className="bg-white shadow-md rounded-lg p-6">
            {/* Centered Title */}
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Recently Added Products</h2>

            {/* Search Input */}
            <div className="mb-4 flex justify-center items-center">
                <div className="relative w-1/2">
                    <input
                        type="text"
                        placeholder="Search by product name, part number, or shelf location"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute top-4 right-3 text-gray-400" />
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="mb-4 flex justify-end">
                <label className="mr-2 text-sm font-medium pt-2">Show:</label>
                <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-2 focus:outline-none"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-4 text-center">Product Name</th>
                            <th className="py-3 px-4 text-center">Part Number</th>
                            <th className="py-3 px-4 text-center">Quantity</th>
                            <th className="py-3 px-4 text-center">Price</th>
                            <th className="py-3 px-4 text-center">Shelf Location</th>
                            <th className="py-3 px-4 text-center">Added On</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {displayProducts.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-gray-500">
                                    No products found
                                </td>
                            </tr>
                        ) : (
                            displayProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-100 transition duration-200">
                                    <td className="py-3 px-4 border-b text-center">{product.productName}</td>
                                    <td className="py-3 px-4 border-b text-center">{product.partNumber}</td>
                                    <td className="py-3 px-4 border-b text-center">{product.quantity}</td>
                                    <td className="py-3 px-4 border-b text-center">{product.price}</td>
                                    <td className="py-3 px-4 border-b text-center">{product.shelfLocation}</td>
                                    <td className="py-3 px-4 border-b text-center">
                                        {moment(product.created_at).format('MMMM Do YYYY')}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Component */}
            <div className="flex justify-center mt-4">
            <ReactPaginate
                    previousLabel={'← Previous'}
                    nextLabel={'Next →'}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination flex space-x-2 items-center"}
                    previousLinkClassName={"px-3 py-2 border rounded-md bg-gray-200 hover:bg-gray-300"}
                    nextLinkClassName={"px-3 py-2 border rounded-md bg-gray-200 hover:bg-gray-300"}
                    disabledClassName={"opacity-50 cursor-not-allowed"}
                    activeClassName={"bg-blue-500 text-white rounded-md"}
                    pageClassName={"px-3 py-2 border rounded-md hover:bg-gray-200"}
                    pageLinkClassName={"text-center w-10"}
                />
            </div>
        </div>
            </div>
        </UserNavBar>

    );
};

export default UserDashboard;
