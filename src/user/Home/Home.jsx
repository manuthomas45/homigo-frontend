import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  CheckCircle,
  Star,
  Users,
  Shield,
  Clock,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import Navbar from './Navbar';
import { fetchServices } from '../../api/servicesapi';
import api from '../../api';

const Home = () => {
  const user = useSelector((state) => state.user.user);
  console.log(user);
  const [isVisible, setIsVisible] = useState(false);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoadingServices(true);
      const servicesData = await fetchServices();
      setServices(servicesData);
      console.log(servicesData)
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  const steps = [
    {
      step: "01",
      title: "Choose Your Service",
      desc: "Select the service you need from our wide range of options.",
      icon: <CheckCircle className="w-12 h-12 text-purple-600" />,
    },
    {
      step: "02",
      title: "Schedule a Time",
      desc: "Pick a convenient time slot for your service.",
      icon: <Clock className="w-12 h-12 text-purple-600" />,
    },
    {
      step: "03",
      title: "Service Delivered",
      desc: "Our experts arrive and complete the job to your satisfaction.",
      icon: <Star className="w-12 h-12 text-purple-600" />,
    },
  ];

  const trustFeatures = [
    {
      title: "Skilled Professionals",
      desc: "We hire the best experts in every field to ensure top-notch service.",
      icon: <Users className="w-16 h-16 text-purple-600" />,
      stats: "500+ Experts"
    },
    {
      title: "100% Satisfaction",
      desc: "We guarantee complete satisfaction with every service you book.",
      icon: <Shield className="w-16 h-16 text-purple-600" />,
      stats: "99.9% Rating"
    },
    {
      title: "Best Rates Available",
      desc: "Competitive pricing with no hidden fees for all our services.",
      icon: <Star className="w-16 h-16 text-purple-600" />,
      stats: "50% Savings"
    },
  ];

  return (
    <>
      <Navbar />
      <div className="pt-4 min-h-screen bg-gray-50">

        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-slate-50 to-blue-50 overflow-hidden min-h-screen flex items-center">
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

          <div className="relative container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Content */}
              <div className={`space-y-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                {user && (
                  <div className="inline-flex items-center px-4 py-2 bg-blue-500 bg-opacity-10 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    {/* Hello, {user.email.split('@')[0]},{user.firstName} */}
                  </div>
                )}

                <div className="space-y-4">
                  <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-none">
                    Home
                    <br />
                    <span className="text-blue-500">Services</span>
                  </h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-sky-400 rounded-full"></div>
                </div>

                <p className="text-xl text-gray-600 leading-relaxed font-light max-w-lg">
                  Connect with trusted professionals for all your home maintenance needs.
                  Quality work, transparent pricing, guaranteed results.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="group bg-blue-500 text-white font-medium px-10 py-4 rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25">
                    <span className="flex items-center justify-center">
                      Get Started
                      <div className="ml-3 w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </span>
                  </button>
                  <button className="font-medium px-10 py-4 rounded-2xl border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-all duration-300">
                    Learn More
                  </button>
                </div>

                {/* Stats with modern cards */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-3xl font-bold text-gray-900 mb-1">15K+</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">Services</div>
                  </div>
                  <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-3xl font-bold text-gray-900 mb-1">4.9</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">Rating</div>
                  </div>
                  <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
                    <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">Support</div>
                  </div>
                </div>
              </div>

              {/* Visual */}
              <div className={`relative ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
                <div className="relative">
                  {/* Main visual container */}
                  <div className="relative bg-gradient-to-br from-white to-blue-50 p-8 rounded-3xl shadow-2xl border border-white">
                    <img
                      src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=400&fit=crop&crop=center"
                      alt="Professional service"
                      className="rounded-2xl w-full h-80 object-cover"
                    />

                    {/* Overlay elements */}
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                      Available Now
                    </div>
                  </div>

                  {/* Floating testimonial */}
                  <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-xs">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                        alt="Customer"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">Sarah M.</div>
                        <div className="flex text-yellow-400">
                          {'★'.repeat(5)}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">"Excellent service! Quick, professional, and reliable."</p>
                  </div>

                  {/* Background blur effect */}
                  <div className="absolute -top-4 -right-4 w-80 h-80 bg-blue-300 rounded-full opacity-10 blur-3xl -z-10"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

    {/* Services Section */}
<section className="relative bg-gradient-to-b from-blue-50 to-white py-20 overflow-hidden">
  {/* Subtle background pattern */}
  <div className="absolute inset-0 opacity-30">
    <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="service-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="0.8" fill="#3b82f6" opacity="0.08" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#service-grid)" />
    </svg>
  </div>

  {/* Floating accent elements */}
  <div className="absolute top-20 right-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-40 animate-pulse"></div>
  <div className="absolute bottom-20 left-1/6 w-1 h-1 bg-sky-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <div className="text-center mb-16">
      <div className="inline-flex items-center px-4 py-2 bg-blue-500 bg-opacity-10 text-blue-700 rounded-full text-sm font-medium border border-blue-200 mb-6">
        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
        Our Services
      </div>
      <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
        What We <span className="text-blue-500">Offer</span>
      </h2>
      <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-sky-400 rounded-full mx-auto mb-6"></div>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
        Professional home services delivered by verified experts you can trust
      </p>
    </div>

    {/* Content */}
    {loadingServices ? (
      <div className="flex justify-center items-center py-16">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
          <div className="absolute inset-0 rounded-full bg-blue-100 opacity-20"></div>
        </div>
      </div>
    ) : services.length > 0 ? (
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl">
          {services.slice(0, 3).map((service, index) => (
            <div
              key={service.id || index}
              className="group relative bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-xl border border-white transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              {/* Service image */}
              <div className="aspect-square mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                  src={service.service_image || '/api/placeholder/200/200'}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              {/* Service name */}
              <h3 className="text-lg font-semibold text-gray-900 text-center leading-tight group-hover:text-blue-600 transition-colors duration-200">
                {service.name}
              </h3>

              {/* Subtle hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10"></div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="text-center py-16">
        <div className="relative inline-block">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-xs text-blue-600">0</span>
          </div>
        </div>
        <p className="text-gray-500 font-medium">No services available at the moment</p>
        <p className="text-sm text-gray-400 mt-1">Check back soon for new offerings</p>
      </div>
    )}

    {/* Call to action */}
    {services.length > 0 && (
      <div className="text-center mt-12">
        <button className="group inline-flex items-center px-8 py-3 bg-white bg-opacity-80 backdrop-blur-sm text-blue-600 font-medium rounded-xl border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md">
          Explore All Services
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    )}
  </div>
</section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get your home service needs fulfilled in just three simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-purple-200 transition-colors duration-300">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gray-300">
                        <div className="absolute right-0 top-0 w-2 h-2 bg-purple-600 rounded-full transform translate-x-1 -translate-y-0.5"></div>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust and Security Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Trust & Security</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We're committed to providing you with the best service experience, backed by our guarantee.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trustFeatures.map((item, index) => (
                <div key={index} className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-all duration-300 group">
                  <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mb-2">{item.stats}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust HomiGo for their home service needs.
            </p>
            <button className="bg-white text-purple-600 font-bold px-12 py-4 rounded-xl hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105">
              Book Your First Service
            </button>
          </div>
        </section> */}

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-purple-400">HomiGo</h3>
                <p className="text-gray-300 leading-relaxed">
                  Your trusted platform for home services. Book professionals in just a few clicks.
                </p>
                <div className="flex space-x-4">
                  <Facebook className="w-6 h-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
                  <Twitter className="w-6 h-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
                  <Instagram className="w-6 h-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
                  <Linkedin className="w-6 h-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Company</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-300 hover:text-purple-400 transition-colors">About Us</a>
                  <a href="#" className="block text-gray-300 hover:text-purple-400 transition-colors">Blog</a>
                  <a href="#" className="block text-gray-300 hover:text-purple-400 transition-colors">Careers</a>
                  <a href="#" className="block text-gray-300 hover:text-purple-400 transition-colors">Privacy Policy</a>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Services</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-300 hover:text-purple-400 transition-colors">AC Servicing</a>
                  <a href="#" className="block text-gray-300 hover:text-purple-400 transition-colors">Plumbing</a>
                  <a href="#" className="block text-gray-300 hover:text-purple-400 transition-colors">Cleaning</a>
                  <a href="#" className="block text-gray-300 hover:text-purple-400 transition-colors">Electrical</a>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-300">support@homigo.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-300">+91 123 456 7890</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-300">123 HomiGo Street, City</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-12 pt-8 text-center">
              <p className="text-gray-400">
                © 2025 HomiGo. All rights reserved. Made with ❤️ for better home services.
              </p>
            </div>
          </div>
        </footer>
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
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Home;