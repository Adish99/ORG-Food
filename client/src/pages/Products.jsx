import "./Products.css";
import { useEffect, useState } from "react";
import { ProductCard } from "../components/UI/ProductCard";
import { UseAuth } from "../store/Authentication";
import { Loader } from "../components/UI/Loader";
import { ProductSkeleton } from "../components/UI/ProductSkeleton";

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");

  const { userAuthToken } = UseAuth();

  // Fetch Products
  const getProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8000/api/products/getallprod?search=${search}&category=${category}&page=${page}&limit=5&sort=${sort}`,
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

  // Fetch Categories
  const getCategories = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/category",
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

  // Load Products whenever filters change
  useEffect(() => {
    getProducts();
  }, [search, category, page, sort]);

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
              <h2>No products found.</h2>
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
  );
};