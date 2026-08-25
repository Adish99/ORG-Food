import { useEffect, useState } from "react";
import "./Home.css";
import { NavLink } from "react-router-dom";
import { ProductCard } from "../components/UI/ProductCard";
import SEO from "../components/SEO";

export const Home = () => {

    const slides = [

        {
            title: "Fresh Organic Vegetables",
            image: "/images/veg.png"
        },

        {
            title: "Pure Organic Dairy Products",
            image: "/images/dp.png"
        },

        {
            title: "Premium Organic Dry Fruits",
            image: "/images/df.png"
        },

        {
            title: "Fresh Organic Fruits",
            image: "/images/fruits.png"
        }

    ];


    const [current, setCurrent] = useState(0);

    const [featuredProducts, setFeaturedProducts] = useState([]);

   


    // ====================================
    // Automatic Hero Slider
    // ====================================

    useEffect(() => {

        const slider = setInterval(() => {

            setCurrent((prev) =>
                (prev + 1) % slides.length
            );

        }, 3000);


        return () => clearInterval(slider);

    }, []);


    // ====================================
    // Fetch Featured Products
    // ====================================

    useEffect(() => {

        const getFeaturedProducts = async () => {

            try {

                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/products/getallprod?limit=4`
                );

                const data = await res.json();

                if (res.ok) {

                    const featured =
                        (data.products || [])
                            .filter(
                                (product) =>
                                    product.isFeatured
                            )
                            .slice(0, 4);

                    setFeaturedProducts(featured);

                }

            } catch (error) {

                console.log(
                    "Featured products error:",
                    error
                );

            }

        };


        getFeaturedProducts();

    }, []);


    return (
        <>

        <SEO
  title="Org-Khana | Organic Food & Products in Nepal"
  description="Shop fresh organic food and natural products online with Org-Khana. Discover quality organic products delivered conveniently across Nepal."
/>

         <div className="home">


            {/* ====================================
                HERO SECTION
            ==================================== */}

            <section className="hero">


                <div className="hero-content">

                    <span className="hero-badge">
                        🌱 Fresh & Organic
                    </span>


                    <h1>

                        Fresh Organic Food

                        <br />

                        From Natural Farms 🌱

                    </h1>


                    <p>

                        Healthy vegetables, fruits,
                        dairy products and dry fruits
                        delivered fresh to your doorstep.

                    </p>


                    <div className="hero-buttons">

                        <NavLink to="/products">

                            <button className="primary-btn">
                                Shop Now 🛒
                            </button>

                        </NavLink>


                        <NavLink to="/about">

                            <button className="secondary-btn">
                                Learn More
                            </button>

                        </NavLink>

                    </div>


                    <div className="hero-features">

                        <span>
                            🌿 100% Organic
                        </span>

                        <span>
                            🚚 Fast Delivery
                        </span>

                        <span>
                            🔒 Secure Payment
                        </span>

                    </div>

                </div>


                {/* Hero Slider */}

                <div className="slider">


                    <img
                        src={slides[current].image}
                        alt={slides[current].title}
                    />


                    <h2>
                        {slides[current].title}
                    </h2>


                    <div className="dots">

                        {slides.map((_, index) => (

                            <span
                                key={index}

                                className={
                                    current === index
                                        ? "active-dot"
                                        : ""
                                }

                                onClick={() =>
                                    setCurrent(index)
                                }

                            ></span>

                        ))}

                    </div>


                </div>


            </section>


            {/* ====================================
                CATEGORIES
            ==================================== */}

            <section className="categories-section">

                <div className="section-heading">

                    <span>
                        Explore Our Store
                    </span>

                    <h2>
                        Shop By Category
                    </h2>

                    <p>
                        Discover fresh and healthy
                        organic products for your everyday needs.
                    </p>

                </div>


                <div className="categories-grid">


                    <NavLink
                        to="/products"
                        className="category-card"
                    >

                        <div className="category-icon">
                            🥦
                        </div>

                        <h3>
                            Vegetables
                        </h3>

                        <p>
                            Fresh & healthy
                        </p>

                    </NavLink>


                    <NavLink
                        to="/products"
                        className="category-card"
                    >

                        <div className="category-icon">
                            🍎
                        </div>

                        <h3>
                            Fruits
                        </h3>

                        <p>
                            Naturally fresh
                        </p>

                    </NavLink>


                    <NavLink
                        to="/products"
                        className="category-card"
                    >

                        <div className="category-icon">
                            🥛
                        </div>

                        <h3>
                            Dairy
                        </h3>

                        <p>
                            Pure & nutritious
                        </p>

                    </NavLink>


                    <NavLink
                        to="/products"
                        className="category-card"
                    >

                        <div className="category-icon">
                            🌱
                        </div>

                        <h3>
                            Beans
                        </h3>

                        <p>
                            Healthy choices
                        </p>

                    </NavLink>


                    <NavLink
                        to="/products"
                        className="category-card"
                    >

                        <div className="category-icon">
                            🥜
                        </div>

                        <h3>
                            Dry Fruits
                        </h3>

                        <p>
                            Premium quality
                        </p>

                    </NavLink>


                </div>

            </section>


            {/* ====================================
                WHY CHOOSE US
            ==================================== */}

            <section className="why-section">

                <div className="section-heading">

                    <span>
                        Why ORG-KHANA?
                    </span>

                    <h2>
                        Freshness You Can Trust
                    </h2>

                    <p>
                        We focus on quality, freshness
                        and a simple shopping experience.
                    </p>

                </div>


                <div className="why-grid">


                    <div className="why-card">

                        <div className="why-icon">
                            🌿
                        </div>

                        <h3>
                            Organic Products
                        </h3>

                        <p>
                            Carefully selected products
                            for a healthier lifestyle.
                        </p>

                    </div>


                    <div className="why-card">

                        <div className="why-icon">
                            🚚
                        </div>

                        <h3>
                            Fast Delivery
                        </h3>

                        <p>
                            Get your favorite products
                            delivered directly to your doorstep.
                        </p>

                    </div>


                    <div className="why-card">

                        <div className="why-icon">
                            🔒
                        </div>

                        <h3>
                            Secure Payments
                        </h3>

                        <p>
                            Enjoy secure checkout with
                            COD and eSewa payment options.
                        </p>

                    </div>


                    <div className="why-card">

                        <div className="why-icon">
                            💬
                        </div>

                        <h3>
                            Customer Support
                        </h3>

                        <p>
                            We are here to help whenever
                            you need assistance.
                        </p>

                    </div>


                </div>

            </section>


            {/* ====================================
                FEATURED PRODUCTS
            ==================================== */}

            {featuredProducts.length > 0 && (

                <section className="featured-section">

                    <div className="section-heading">

                        <span>
                            Our Selection
                        </span>

                        <h2>
                            Featured Products
                        </h2>

                        <p>
                            Explore some of our most
                            popular organic products.
                        </p>

                    </div>


                    <div className="featured-products">

                        {featuredProducts.map((product) => (

                            <ProductCard
                                key={product._id}
                                product={product}
                            />

                        ))}

                    </div>


                    <div className="section-button">

                        <NavLink to="/products">

                            <button className="primary-btn">
                                View All Products →
                            </button>

                        </NavLink>

                    </div>

                </section>

            )}


            {/* ====================================
                COUPON / OFFER
            ==================================== */}

            <section className="offer-section">

                <div className="offer-content">

                    <span className="offer-icon">
                        🎟️
                    </span>

                    <h2>
                        Rewards For Our Loyal Customers
                    </h2>

                    <p>
                        Keep shopping with ORG-KHANA
                        and unlock exclusive coupons and
                        special discounts.
                    </p>

                    <NavLink to="/products">

                        <button className="primary-btn">
                            Start Shopping
                        </button>

                    </NavLink>

                </div>

            </section>


            {/* ====================================
                FINAL CTA
            ==================================== */}

            <section className="home-cta">

                <h2>
                    Fresh. Organic. Delivered To You. 🌱
                </h2>

                <p>
                    Make healthier choices today.
                </p>

                <NavLink to="/products">

                    <button className="primary-btn">
                        Explore Products
                    </button>

                </NavLink>

            </section>


        </div>

        </>
    );

};

