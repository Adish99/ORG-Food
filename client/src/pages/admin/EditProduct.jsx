import "./AddProduct.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UseAuth } from "../../store/Authentication";
import { toast } from "react-toastify";

export const EditProduct = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const { userAuthToken } = UseAuth();

  const [categories, setCategories] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    weight: "",
    image: "",
    categoryId: "",
    isFeatured: false
  });

  // Fetch Product
  const getProduct = async () => {

    try {

      const res = await fetch(
        `http://localhost:8000/api/products/getprod/${id}`
      );

      const data = await res.json();

      if (res.ok) {

        setProduct({
          name: data.data.name,
          description: data.data.description,
          price: data.data.price,
          stock: data.data.stock,
          weight: data.data.weight,
          image: data.data.image,
          categoryId: data.data.categoryId,
          isFeatured: data.data.isFeatured
        });

      }

    } catch (error) {

      console.log(error);

    }

  };

  // Fetch Categories
  const getCategories = async () => {

    try {

      const res = await fetch(
        "http://localhost:8000/api/category"
      );

      const data = await res.json();

      if (res.ok) {

        setCategories(data.categories);

      }

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    getProduct();

    getCategories();

  }, []);

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await fetch(
        `http://localhost:8000/api/products/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: userAuthToken
          },
          body: JSON.stringify(product)
        }
      );

      const data = await res.json();

      if (res.ok) {

        toast.success(data.message);

        navigate("/admin/products");

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="add-product-page">

      <div className="add-product-card">

        <h1>Edit Product</h1>

        <form onSubmit={handleSubmit}>

          <label>Product Name</label>

          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
          />

          <label>Description</label>

          <textarea
            name="description"
            rows="4"
            value={product.description}
            onChange={handleChange}
          />

          <label>Price</label>

          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
          />

          <label>Stock</label>

          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
          />

          <label>Weight</label>

          <input
            type="text"
            name="weight"
            value={product.weight}
            onChange={handleChange}
          />

          <label>Image URL</label>

          <input
            type="text"
            name="image"
            value={product.image}
            onChange={handleChange}
          />

          <label>Category</label>

          <select
            name="categoryId"
            value={product.categoryId}
            onChange={handleChange}
          >

            <option value="">
              Select Category
            </option>

            {categories.map((category) => (

              <option
                key={category._id}
                value={category._id}
              >
                {category.categoryName}
              </option>

            ))}

          </select>

          <div className="checkbox-row">

            <input
              type="checkbox"
              name="isFeatured"
              checked={product.isFeatured}
              onChange={handleChange}
            />

            <span>Featured Product</span>

          </div>

          <button type="submit">

            Update Product

          </button>

        </form>

      </div>

    </div>

  );

};