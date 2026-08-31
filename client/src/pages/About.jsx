import SEO from "../components/SEO";
import "./About.css";
import { NavLink } from "react-router-dom";


//About page component
export const About = () => {

    return (
        <>
<SEO
    title="About Us | Org-Khana"
    description="Learn more about Org-Khana, our mission, and our commitment to providing quality organic food and natural products in Nepal."
/>

         <div className="about-page">

            {/* ================================
                ABOUT HERO
            ================================= */}

            <section className="about-hero">

                <div className="about-hero-content">

                    <span className="about-badge">
                        🌱 About ORG-KHANA
                    </span>

                    <h1>
                        Fresh Food.
                        <br />
                        Healthy Living.
                    </h1>

                    <p>
                        ORG-KHANA is an organic food store
                        focused on bringing fresh, quality and
                        healthy products closer to your doorstep.
                    </p>

                    <NavLink to="/products">
                        <button className="primary-btn">
                            Explore Products 🛒
                        </button>
                    </NavLink>

                </div>

                <div className="about-hero-image">

                    <div className="about-image-circle">
                        🌿
                    </div>

                    <div className="floating-card">
                        🥬 Fresh & Organic
                    </div>

                </div>

            </section>


            {/* ================================
                WHO WE ARE
            ================================= */}

            <section className="about-section">

                <div className="about-section-content">

                    <span className="about-section-label">
                        WHO WE ARE
                    </span>

                    <h2>
                        Making Healthy Choices Easier
                    </h2>

                    <p>
                        At ORG-KHANA, we believe that good food
                        should be fresh, nutritious and accessible.
                        Our platform makes it easier for customers
                        to discover and purchase a variety of
                        organic food products from one place.
                    </p>

                    <p>
                        From fresh vegetables and fruits to dairy
                        products, beans and premium dry fruits,
                        we aim to provide a simple and convenient
                        online shopping experience.
                    </p>

                </div>

            </section>


            {/* ================================
                OUR MISSION
            ================================= */}

            <section className="mission-section">

                <div className="mission-content">

                    <span className="about-section-label">
                        OUR MISSION
                    </span>

                    <h2>
                        Better Food, Better Everyday Life 🌱
                    </h2>

                    <p>
                        Our mission is to make healthy food choices
                        easier by connecting customers with quality
                        organic products through a convenient
                        online shopping experience.
                    </p>

                </div>

            </section>


            {/* ================================
                WHY CHOOSE US
            ================================= */}

            <section className="about-why">

                <div className="section-heading">

                    <span>
                        WHY ORG-KHANA?
                    </span>

                    <h2>
                        Why Choose Us
                    </h2>

                    <p>
                        We focus on creating a simple,
                        reliable and enjoyable shopping experience.
                    </p>

                </div>


                <div className="about-feature-grid">

                    <div className="about-feature-card">

                        <div className="about-feature-icon">
                            🌿
                        </div>

                        <h3>
                            Organic Products
                        </h3>

                        <p>
                            Discover a variety of fresh and
                            quality-focused organic food products.
                        </p>

                    </div>


                    <div className="about-feature-card">

                        <div className="about-feature-icon">
                            🥬
                        </div>

                        <h3>
                            Quality & Freshness
                        </h3>

                        <p>
                            We focus on providing products that
                            support healthier everyday choices.
                        </p>

                    </div>


                    <div className="about-feature-card">

                        <div className="about-feature-icon">
                            🚚
                        </div>

                        <h3>
                            Convenient Delivery
                        </h3>

                        <p>
                            Order your favorite products online
                            and have them delivered to your doorstep.
                        </p>

                    </div>


                    <div className="about-feature-card">

                        <div className="about-feature-icon">
                            🔒
                        </div>

                        <h3>
                            Secure Shopping
                        </h3>

                        <p>
                            Enjoy a convenient checkout experience
                            with supported secure payment options.
                        </p>

                    </div>

                </div>

            </section>


            {/* ================================
                WHAT WE OFFER
            ================================= */}

            <section className="offer-section about-offer">

                <div className="section-heading">

                    <span>
                        OUR STORE
                    </span>

                    <h2>
                        What You Can Find
                    </h2>

                    <p>
                        Explore a selection of everyday organic
                        products in one convenient place.
                    </p>

                </div>


                <div className="about-products-grid">

                    <div>
                        🥦
                        <h3>Vegetables</h3>
                    </div>

                    <div>
                        🍎
                        <h3>Fruits</h3>
                    </div>

                    <div>
                        🥛
                        <h3>Dairy</h3>
                    </div>

                    <div>
                        🌱
                        <h3>Beans</h3>
                    </div>

                    <div>
                        🥜
                        <h3>Dry Fruits</h3>
                    </div>

                </div>

            </section>


            {/* ================================
                CTA
            ================================= */}

            <section className="about-cta">

                <h2>
                    Ready to Make a Healthier Choice?
                </h2>

                <p>
                    Explore our products and discover
                    fresh organic food for your everyday needs.
                </p>

                <NavLink to="/products">

                    <button className="about-cta-btn">
                        Shop Now 🛒
                    </button>

                </NavLink>

            </section>

        </div>
        </>

    );

};