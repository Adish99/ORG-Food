import "./AdminProducts.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../../store/Authentication";
import { toast } from "react-toastify";
import { Loader } from "../../components/UI/Loader";

console.log("AdminProducts Rendered");

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const navigate = useNavigate();
const { userAuthToken } = UseAuth();
  const getProducts = async () => {
     setIsSubmitting(true);
    try {
      const res = await fetch(
        "http://localhost:8000/api/products/getallprod"
      );

      console.log("Status:", res.status);

      const data = await res.json();
      console.log("Status:", res.status);

      if (res.ok) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
        setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const deleteProduct = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {

        const res = await fetch(

            `http://localhost:8000/api/products/delete/${id}`,

            {

                method: "DELETE",

                headers: {
                    Authorization: userAuthToken
                }

            }

        );

        const data = await res.json();

        if (res.ok) {

            toast.success(data.message);

            setProducts((prev) =>
                prev.filter((item) => item._id !== id)
            );

        } else {

          toast.error(data.message);

        }

    } catch (error) {

        console.log(error);

    }

};

  if (loading) {
    return <Loader/>
  }

  return (
    <div className="admin-products-page">

      <div className="admin-header">

        <div>
          <h1>Manage Products</h1>
          <p>Manage all products available in your store.</p>
        </div>

      <button
  className="add-product-btn"
  onClick={() => navigate("/admin/products/add")}
>
  + Add Product
</button>

      </div>

      <div className="table-container">

        <table className="product-table">

          <thead>

            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category ID</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Weight</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>

                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                  </td>

                  <td>{product.name}</td>

                 <td>{product.categoryId?.categoryName}</td>

                  <td>Rs. {product.price}</td>

                  <td>{product.stock}</td>

                  <td>{product.weight}</td>

                  <td>
                    {product.isFeatured ? (
                      <span className="featured yes">
                        Yes
                      </span>
                    ) : (
                      <span className="featured no">
                        No
                      </span>
                    )}
                  </td>

                  <td>

                    <button
    className="edit-btn"
    onClick={() =>
        navigate(`/admin/products/edit/${product._id}`)
    }
      disabled={isSubmitting}
>
        {isSubmitting ? "Editing..." : "Edit"}
</button>

                   <button
    className="delete-btn"
    onClick={() => deleteProduct(product._id)}
     disabled={isSubmitting}
>
       {isSubmitting ? "Deleting..." : "Delete"}
</button>

                  </td>

                </tr>
              ))
            ) : (
              <tr>

                <td colSpan="8">
                  No Products Found.
                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};