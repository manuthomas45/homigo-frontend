import { useSelector } from 'react-redux';
import Navbar from '../user/Home/Navbar';


const TechnicianHome = () => {
    const user = useSelector((state) => state.user.user);

    return (
        <>
            <Navbar />
            <div className="pt-16 min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Welcome, {user?.firstName || 'Technician'}!
                    </h1>
                    <p className="text-gray-600 mb-6">
                        You have successfully registered as a technician. Start managing your services and bookings here.
                    </p>
                    <div className="space-y-4">
                        <button
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                            onClick={() => alert('Feature coming soon!')}
                        >
                            View Bookings
                        </button>
                        <button
                            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
                            onClick={() => alert('Feature coming soon!')}
                        >
                            Update Availability
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TechnicianHome;