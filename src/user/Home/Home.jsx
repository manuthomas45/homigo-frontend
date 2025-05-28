import Navbar from './Navbar';
import './Home.css';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import api from '../../api';
const Home = () => {
  const user = useSelector((state) => state.user.user);


  return (
    <div className="home-container">
      
      <Navbar />

      {/* Hero Section */}
    
      <section className="hero">
        <div className="hero-content">
          <h1>Simplify Your Life - Let the Experts Handle It!</h1> 
<h1>{user ? `Welcome, ${user.email}` : 'No user logged in'}</h1>       
   <p>From AC servicing to plumbing problems, get skilled professionals at your doorstep. Quick, reliable, and hassle-free!</p>
          <div className="hero-buttons">
            <a href="#" className="cta-btn">Book a Service</a>
            <a href="#" className="secondary-btn">Learn More</a>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://via.placeholder.com/500x400?text=Professional+Service" alt="Professional Service" />
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <h2>Our Services</h2>
        <div className="services-grid">
          {[
            { title: "AC Servicing", img: "https://via.placeholder.com/150x150?text=AC+Servicing" },
            { title: "Plumbing", img: "https://via.placeholder.com/150x150?text=Plumbing" },
            { title: "Cleaning", img: "https://via.placeholder.com/150x150?text=Cleaning" },
            { title: "Painting", img: "https://via.placeholder.com/150x150?text=Painting" },
            { title: "Electrical", img: "https://via.placeholder.com/150x150?text=Electrical" },
            { title: "Carpentry", img: "https://via.placeholder.com/150x150?text=Carpentry" },
          ].map((service, index) => (
            <div key={index} className="service-card">
              <img src={service.img} alt={service.title} />
              <h3>{service.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          {[
            {
              step: "Step 1",
              title: "Choose Your Service",
              desc: "Select the service you need from our wide range of options.",
              img: "https://via.placeholder.com/50x50?text=Step+1",
            },
            {
              step: "Step 2",
              title: "Schedule a Time",
              desc: "Pick a convenient time slot for your service.",
              img: "https://via.placeholder.com/50x50?text=Step+2",
            },
            {
              step: "Step 3",
              title: "Service Delivered",
              desc: "Our experts arrive and complete the job to your satisfaction.",
              img: "https://via.placeholder.com/50x50?text=Step+3",
            },
          ].map((step, index) => (
            <div key={index} className="step">
              <img src={step.img} alt={step.step} />
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust and Security Section */}
      <section className="trust-security">
        <h2>Your Trust & Security</h2>
        <div className="trust-grid">
          {[
            {
              title: "Skilled Professionals",
              desc: "We hire the best experts in every field to ensure top-notch service.",
            },
            {
              title: "100% Satisfaction",
              desc: "We guarantee complete satisfaction with every service you book.",
            },
            {
              title: "Best Rates Available",
              desc: "Competitive pricing with no hidden fees for all our services.",
            },
          ].map((item, index) => (
            <div key={index} className="trust-card">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 >HomiGo</h3>
            <p>Your trusted platform for home services. Book professionals in just a few clicks.</p>
          </div>
          <div className="footer-section">
            <h3>Company</h3>
            <a href="#" className="footer-link">About Us</a>
            <a href="#" className="footer-link">Blog</a>
            <a href="#" className="footer-link">Careers</a>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: support@homigo.com</p>
            <p>Phone: +91 123 456 7890</p>
            <p>Address: 123 HomiGo Street, City</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;