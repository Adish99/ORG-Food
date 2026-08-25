import "./Products.css";
import { useEffect, useState } from "react";
import { ProductCard } from "../components/UI/ProductCard";
import { UseAuth } from "../store/Authentication";
import { Loader } from "../components/UI/Loader";
import { ProductSkeleton } from "../components/UI/ProductSkeleton";
import { EmptyState } from "../components/UI/EmptyState";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SEO from "../components/SEO";

const getProductsLimit = () => {
  if (window.innerWidth > 1100) {
    return 8;
  }

  if (window.innerWidth > 850) {
    return 6;
  }

  if (window.innerWidth > 600) {
    return 8;
  }

  return 5;
};

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");
  const [productsPerPage, setProductsPerPage] = useState(getProductsLimit());

  const { userAuthToken } = UseAuth();
  const navigate=useNavigate();

  useEffect(() => {

  const handleResize = () => {

    const newLimit = getProductsLimit();

    setProductsPerPage((currentLimit) => {

      if (currentLimit !== newLimit) {
        setPage(1);
        return newLimit;
      }

      return currentLimit;
    });

  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };

}, []);

  
  const getProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/getallprod?search=${debouncedSearch}&category=${category}&page=${page}&limit=${productsPerPage}&sort=${sort}`,
        {
          method: "GET",
          headers: {
            Authorization: userAuthToken,
          },
        }
      );

      const data = await res.json();

      console.log(data);

      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.log("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  };


  const getCategories = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/category`,
        {
          method: "GET",
          headers: {
            Authorization: userAuthToken,
          },
        }
      );

      const data = await res.json();

      console.log('Categories',data.categories);

      setCategories(data.categories || []);
    } catch (error) {
      console.log("Fetch categories error:", error);
    }
  };

  

  // Load Categories Once
  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {

  const timer = setTimeout(() => {

    setDebouncedSearch(search);

  }, 500);

  return () => clearTimeout(timer);

}, [search]);

  // Load Products whenever filters change
  useEffect(() => {
  getProducts();
}, [debouncedSearch, category, page, sort,productsPerPage]);

 if (loading) {

    return (

        <div className="products-grid">

            {Array.from({ length: 8 }).map((_, index) => (

                <ProductSkeleton key={index} />

            ))}

        </div>

    );

}

  return (
    <>
    <SEO
  title="Organic Products | Org-Khana"
  description="Explore fresh organic food and natural products available from Org-Khana."
/>
 <div className="products-page">
      <h1>All Products</h1>

      {/* Search + Category + Sort */}
      <div className="product-controls">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* Category */}
        <select
          value={category}
         onChange={(e) => {
  console.log("Selected Category:", e.target.value);
  setCategory(e.target.value);
  setPage(1);
}}
        >
          <option value="">All Categories</option>

          {categories.map((cat) => (
            <option
              key={cat._id}
              value={cat._id}
            >
              {cat.categoryName}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Sort By</option>
          <option value="price">Price: Low → High</option>
          <option value="-price">Price: High → Low</option>
        </select>
      </div>

      {/* Loading */}
      {loading ? (
        <h2>Loading products...</h2>
      ) : (
        <>
          {/* Products */}
          <div className="products-container">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                />
              ))
            ) : (
             <EmptyState
    icon="🔍"
    title="No products found"
    message="We couldn't find any products matching your search or selected category."
    buttonText="View All Products"
    onButtonClick={() => navigate("/products")}
/>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
</>

  );
};