import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setUser } from '../store/userSlice';
import api from '../api';
import Navbar from '../user/Home/Navbar';



const TechnicianRegister = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        category: '',
        aadhaar_number: '',
        aadhaar_card_picture: null,
        certificate_picture: null,
        city: '',
    });

    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/technician/services/');
                setCategories(response.data);
            } catch (error) {
                toast.error('Failed to fetch service categories. Please try again.');
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.aadhaar_number) {
            newErrors.aadhaar_number = 'Aadhaar number is required';
        } else if (!/^\d{12}$/.test(formData.aadhaar_number)) {
            newErrors.aadhaar_number = 'Aadhaar number must be 12 digits';
        }
        if (!formData.aadhaar_card_picture) newErrors.aadhaar_card_picture = 'Aadhaar card picture is required';
        if (!formData.certificate_picture) newErrors.certificate_picture = 'Certificate picture is required';
        if (!formData.city) newErrors.city = 'City is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please fix the errors in the form.');
            return;
        }

        setLoading(true);
        const formDataToSend = new FormData();
        formDataToSend.append('category', formData.category);
        formDataToSend.append('aadhaar_number', formData.aadhaar_number);
        formDataToSend.append('aadhaar_card_picture', formData.aadhaar_card_picture);
        formDataToSend.append('certificate_picture', formData.certificate_picture);
        formDataToSend.append('city', formData.city);

        try {
            const response = await api.post('/technician/technician-register/', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/login');
            dispatch(setUser({ ...response.data.user, role: 'technician' }));
            toast.success('Successfully registered as a technician!');
        } catch (error) {
            const errorData = error.response?.data;
            if (errorData && !errorData.success) {
                if (errorData.details) {
                    // Join the error details into a single string to prevent character splitting
                    const errorMessage = typeof errorData.details === 'string'
                        ? errorData.details
                        : Object.values(errorData.details).flat().join(' ');
                    toast.error(errorMessage);
                } else {
                    toast.error(errorData.error || 'Registration failed. Please try again.');
                }
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Become a Technician
                        </h1>
                        <p className="text-gray-600 mt-2">Fill in the details to register as a technician</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Service Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                        </div>

                        <div>
                            <label htmlFor="aadhaar_number" className="block text-sm font-medium text-gray-700">
                                Aadhaar Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="aadhaar_number"
                                name="aadhaar_number"
                                value={formData.aadhaar_number}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Enter 12-digit Aadhaar number"
                            />
                            {errors.aadhaar_number && <p className="mt-1 text-sm text-red-600">{errors.aadhaar_number}</p>}
                        </div>

                        <div>
                            <label htmlFor="aadhaar_card_picture" className="block text-sm font-medium text-gray-700">
                                Aadhaar Card Picture <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                id="aadhaar_card_picture"
                                name="aadhaar_card_picture"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {errors.aadhaar_card_picture && <p className="mt-1 text-sm text-red-600">{errors.aadhaar_card_picture}</p>}
                        </div>

                        <div>
                            <label htmlFor="certificate_picture" className="block text-sm font-medium text-gray-700">
                                Certificate Picture <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                id="certificate_picture"
                                name="certificate_picture"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {errors.certificate_picture && <p className="mt-1 text-sm text-red-600">{errors.certificate_picture}</p>}
                        </div>

                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                City <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Enter your city"
                            />
                            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                                    loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                {loading ? 'Registering...' : 'Register as Technician'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default TechnicianRegister;