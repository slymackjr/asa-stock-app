import { useEffect, useState } from 'react';
import { FaPlus, FaTimesCircle, FaBoxes, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { UserNavBar } from '../components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../Hooks/Axios';
import ReactPaginate from 'react-paginate';

const UserProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Default to 5 items per page
    const navigate = useNavigate();

    // Fetch products from the API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get('/products');
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
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter the products based on searchTerm
    const filteredProducts = products.filter(product =>
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

    // Navigate to Add Product Page
    const handleAddProduct = () => {
        navigate('/add-product');
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <FaBoxes className="text-indigo-500 text-4xl animate-spin" />
            </div>
        );
    }

    return (
        <UserNavBar activeLink={'products'}>
            <div className="bg-white shadow-lg rounded-lg flex flex-col flex-grow p-6">
                <ToastContainer autoClose={5000} hideProgressBar={true} newestOnTop={true} closeOnClick pauseOnHover draggable />
                
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Products</h1>
                    <button 
                        onClick={handleAddProduct} 
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                    >
                        <FaPlus className="mr-2" /> Add Product
                    </button>
                </div>

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

                <div className="">
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-4 text-left">Product Name</th>
                                    <th className="py-3 px-4 text-left">Part Number</th>
                                    <th className="py-3 px-4 text-left">Quantity</th>
                                    <th className="py-3 px-4 text-left">Price</th>
                                    <th className="py-3 px-4 text-left">Shelf Location</th>
                                    <th className="py-3 px-4 text-left">Added On</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {displayProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-gray-500">
                                            No products available
                                        </td>
                                    </tr>
                                ) : (
                                    displayProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-100 transition duration-200">
                                            <td className="py-3 px-4 border-b">{product.productName}</td>
                                            <td className="py-3 px-4 border-b">{product.partNumber}</td>
                                            <td className="py-3 px-4 border-b">{product.quantity}</td>
                                            <td className="py-3 px-4 border-b">{product.price}</td>
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

export default UserProducts;
