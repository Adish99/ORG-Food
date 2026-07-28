import "./Contact.css";
import { toast } from "react-toastify";
import { useState } from "react";

export const Contact = () => {

    const [contactData, setContactData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleChange = (e) => {

        setContactData({
            ...contactData,
            [e.target.name]: e.target.value
        });

    };

const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        const res = await fetch(

            "http://localhost:8000/api/contact",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(contactData)

            }

        );

        const data = await res.json();

        if (res.ok) {

            toast.success(data.message);

            setContactData({

                name: "",

                email: "",

                subject: "",

                message: ""

            });

        } else {

            toast.error(data.message);

        }

    } catch (error) {

        console.log(error);

        toast.error("Something went wrong.");

    }

};

    return (

        <div className="contact-page">

            {/* Hero */}

            <div className="contact-hero">

                <h1>Contact Org-Khana 🌱</h1>

                <p>
                    Have questions, suggestions, or need help with your order?
                    We'd love to hear from you.
                </p>

            </div>

            {/* Contact + Form */}

            <div className="contact-container">

                {/* Contact Information */}

                <div className="contact-info">

                    <h2>Get in Touch</h2>

                    <div className="info-card">

                        <h3>📍 Address</h3>

                        <p>
                            Kathmandu, Nepal
                        </p>

                        <small>Khadaghari, Force Park</small>

                    </div>

                    <div className="info-card">

                        <h3>📞 Phone</h3>

                        <p>+977 9741810104</p>

                    </div>

                    <div className="info-card">

                        <h3>📧 Email</h3>

                        <p>karkiadish999@gmail.com</p>

                    </div>

                    <div className="info-card">

                        <h3>🕒 Business Hours</h3>

                        <p>Monday - Friday</p>

                        <p>9:00 AM - 6:00 PM</p>

                    </div>

                </div>

                {/* Contact Form */}

                <form
                    className="contact-form"
                    onSubmit={handleSubmit}
                >

                    <h2>Send us a Message</h2>

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={contactData.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={contactData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject"
                        value={contactData.subject}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        rows="6"
                        name="message"
                        placeholder="Write your message..."
                        value={contactData.message}
                        onChange={handleChange}
                        required
                    />

                    <button>

                        Send Message

                    </button>

                </form>

            </div>

            {/* Why Choose */}

            <div className="why-choose">

                <h2>Why Choose Org-Khana?</h2>

                <div className="feature">

                    <span>🌱</span>

                    <div>

                        <h4>100% Organic Products</h4>

                        <p>
                            Fresh, natural, and chemical-free products sourced directly from trusted local farmers.
                        </p>

                    </div>

                </div>

                <div className="feature">

                    <span>🚚</span>

                    <div>

                        <h4>Fast Delivery</h4>

                        <p>
                            Quick and reliable doorstep delivery with careful handling.
                        </p>

                    </div>

                </div>

                <div className="feature">

                    <span>💳</span>

                    <div>

                        <h4>Secure Payments</h4>

                        <p>
                            Safe checkout with trusted payment methods and secure transactions.
                        </p>

                    </div>

                </div>

                <div className="feature">

                    <span>⭐</span>

                    <div>

                        <h4>Trusted by Customers</h4>

                        <p>
                            We're committed to delivering quality products with excellent customer service.
                        </p>

                    </div>

                </div>

            </div>

            {/* Mission */}

            <div className="mission">

                <h2>Our Mission</h2>

                <p>

                    At <strong>Org-Khana</strong>, our mission is to make healthy,
                    organic, and farm-fresh food easily accessible to every family.
                    We support local farmers, promote sustainable agriculture,
                    and ensure every customer receives fresh, high-quality products
                    delivered with care.

                </p>

            </div>

            {/* Google Map */}

            <div className="map-section">

                <h2>Find Us</h2>

                <iframe
                    title="Org-Khana Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.5189603462404!2d85.37629277425381!3d27.701258825762242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1a496335f4df%3A0xb2dde8b4af7a2a11!2sForce%20Park%20Bus%20Stop!5e0!3m2!1sen!2snp!4v1785208706379!5m2!1sen!2snp"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                />

            </div>

        </div>

    );

};