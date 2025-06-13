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

import api from '../../api';

const Home = () => {
  const user = useSelector((state) => state.user.user);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    { 
      title: "AC Servicing", 
      img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop&crop=center",
      description: "Professional AC repair and maintenance",
      price: "Starting at ₹299"
    },
    { 
      title: "Plumbing", 
      img: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&h=300&fit=crop&crop=center",
      description: "Expert plumbing solutions",
      price: "Starting at ₹199"
    },
    { 
      title: "Cleaning", 
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center",
      description: "Deep cleaning services",
      price: "Starting at ₹399"
    },
    { 
      title: "Painting", 
      img: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&h=300&fit=crop&crop=center",
      description: "Interior & exterior painting",
      price: "Starting at ₹499"
    },
    { 
      title: "Electrical", 
      img: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&h=300&fit=crop&crop=center",
      description: "Electrical repairs & installation",
      price: "Starting at ₹149"
    },
    { 
      title: "Carpentry", 
      img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=300&fit=crop&crop=center",
      description: "Custom woodwork & repairs",
      price: "Starting at ₹249"
    },
  ];

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
      <div className="pt-3 min-h-screen bg-gray-50">
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0), 
                               radial-gradient(circle at 75px 75px, white 2px, transparent 0)`,
              backgroundSize: '100px 100px'
            }}></div>
          </div>
          
          <div className="relative container mx-auto px-4 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className={`space-y-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                {user && (
                  <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-10 rounded-full backdrop-blur-sm border border-white border-opacity-20">
                    {/* <span className="text-sm">Welcome back, {user.email.split('@')[0]}! 👋</span> */}
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Simplify Your Life - 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                    {" "}Let the Experts Handle It!
                  </span>
                </h1>
                <p className="text-xl text-purple-100 leading-relaxed">
                  From AC servicing to plumbing problems, get skilled professionals at your doorstep. 
                  Quick, reliable, and hassle-free!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105">
                    <span className="flex items-center justify-center">
                      Book a Service
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  <button className="border-2 border-white border-opacity-30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:bg-opacity-10 transition-all duration-300 backdrop-blur-sm">
                    Learn More
                  </button>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white border-opacity-20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">10K+</div>
                    <div className="text-sm text-purple-200">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">500+</div>
                    <div className="text-sm text-purple-200">Expert Technicians</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">50+</div>
                    <div className="text-sm text-purple-200">Cities Covered</div>
                  </div>
                </div>
              </div>
              
              <div className={`relative ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
                <div className="relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=500&fit=crop&crop=center" 
                    alt="Professional Service" 
                    className="rounded-2xl shadow-2xl"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">4.9/5</div>
                        <div className="text-sm text-gray-600">2000+ Reviews</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 left-4 w-72 h-72 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Professional home services at your fingertips. Choose from our wide range of expert services.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={service.img} 
                      alt={service.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {service.price}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors duration-300">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
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