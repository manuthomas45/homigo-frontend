import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchCategoriesWithTypes } from '../api/userserviceapi';
import Navbar from './Home/Navbar';

const ServicesPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCategoriesWithTypes();
        console.log('API Response:', data); // Debug log
        setCategories(data);
        // Automatically select first category when data loads
        if (data && data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      } catch (error) {
        toast.error('Failed to load service categories');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.id);
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <>
      <Navbar/>
      <section className="relative bg-gradient-to-b from-slate-50 to-blue-50 overflow-hidden min-h-screen py-20">
        {/* Subtle geometric background */}
        <div className="absolute inset-0 opacity-40">
          <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1.5" fill="#3b82f6" opacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-sky-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-blue-500 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="relative container mx-auto px-4">
         

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center px-6 py-3 bg-blue-500 bg-opacity-10 text-blue-700 rounded-full text-lg font-medium border border-blue-200">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                Loading services...
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Service Categories Row */}
              <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categories.map((category, index) => (
                    <div
                      key={category.id}
                      className={`group bg-white bg-opacity-60 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 cursor-pointer overflow-hidden ${
                        selectedCategory === category.id 
                          ? 'border-blue-500 bg-opacity-80' 
                          : 'border-white hover:border-blue-300'
                      }`}
                      onClick={() => handleCategoryClick(category)}
                      style={{ animationDelay: `${0.1 * index}s` }}
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={category.service_image_url || 'https://placehold.co/300x200?text=No+Image'}
                          alt={category.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-white ${
                          selectedCategory === category.id ? 'bg-blue-600' : 'bg-purple-600'
                        }`}>
                          {category.service_types?.length || 0} Services
                        </div>
                        
                        {/* Selection indicator */}
                        {selectedCategory === category.id && (
                          <div className="absolute bottom-4 left-4 bg-blue-500 text-white p-2 rounded-full shadow-lg animate-pulse">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <h3 className={`text-xl font-bold mb-2 ${
                          selectedCategory === category.id ? 'text-blue-600' : 'text-gray-900'
                        }`}>
                          {category.name}
                        </h3>
                        <p className="text-gray-600 text-sm font-light">
                          Professional {category.name?.toLowerCase()} services with certified experts
                        </p>
                        
                        {/* Mini stats for selected category */}
                        {selectedCategory === category.id && (
                          <div className="mt-4 flex items-center space-x-4 text-sm">
                            <div className="flex items-center text-green-600">
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                              Available 24/7
                            </div>
                            <div className="flex items-center text-yellow-600">
                            
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

             {selectedCategoryData && (
  <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
    <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl border border-white p-8">
      <div className="mb-8 text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          {selectedCategoryData.name} Services
        </h3>
        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-sky-400 rounded-full mx-auto"></div>
        <p className="text-gray-600 mt-4 font-light">
          Choose from our professional {selectedCategoryData.name?.toLowerCase()} services
        </p>
      </div>

      <div className="grid gap-6">
        {selectedCategoryData.service_types?.map((type, index) => (
          <div
            key={type.id}
            className={`group bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 border border-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up`}
            style={{ animationDelay: `${0.1 * index}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {type.image_url && (
                  <div className="relative">
                    <img
                      src={type.image_url || 'https://placehold.co/100x100?text=No+Image'}
                      alt={type.name}
                      className="w-20 h-20 object-cover rounded-xl border-2 border-gray-100 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="space-y-2 flex-1">
                  <h4 className="text-xl font-semibold text-gray-900">{type.name}</h4>
                  <p className="text-gray-600 font-light leading-relaxed">
                    {type.description || 'Professional service with quality guarantee and certified experts'}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Certified Professional
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Quality Guaranteed
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Same Day Service
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right space-y-3 ml-6">
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-blue-600">₹{type.rate}</div>
                </div>
                <button
                  onClick={() => navigate('/booking', { state: { serviceType: type, categoryName: selectedCategoryData.name } })}
                  className="bg-blue-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 group"
                >
                  <span className="flex items-center">
                    Book Now
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
              {/* Bottom CTA Section */}
              <div className={`text-center space-y-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-3xl p-12 border border-white shadow-xl">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Need a Custom Service?</h3>
                  <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto font-light">
                    Can't find what you're looking for? Our team can provide customized solutions for your specific needs.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="group bg-blue-500 text-white font-medium px-10 py-4 rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25">
                      <span className="flex items-center justify-center">
                        Contact Us
                        <div className="ml-3 w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </span>
                    </button>
                    <button className="font-medium px-10 py-4 rounded-2xl border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-all duration-300">
                      Call: +91 98765 43210
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
          }
        `}</style>
      </section>
    </>
  );
};

export default ServicesPage;