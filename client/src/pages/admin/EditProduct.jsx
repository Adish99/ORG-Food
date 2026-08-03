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
  const [previewImage, setPreviewImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

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
        setPreviewImage(data.data.image);

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

    const { name, value, type, checked, files } = e.target;

    if (type === "file") {

        setProduct((prev) => ({

            ...prev,

            image: files[0]

        }));

        setPreviewImage(

            URL.createObjectURL(files[0])

        );

        return;

    }

    setProduct((prev) => ({

        ...prev,

        [name]:

            type === "checkbox"

                ? checked

                : value

    }));

};
//After clicking update product this function will run
  const handleSubmit = async (e) => {

    e.preventDefault();
    setIsUploading(true);

    try {
      const formData = new FormData();

formData.append("name", product.name);

formData.append("description", product.description);

formData.append("price", product.price);

formData.append("stock", product.stock);

formData.append("weight", product.weight);

formData.append("categoryId", product.categoryId);

formData.append("isFeatured", product.isFeatured);

if (product.image instanceof File) {

    formData.append("image", product.image);

}

      const res = await fetch(

    `http://localhost:8000/api/products/update/${id}`,

    {

        method: "PUT",

        headers: {

            Authorization: userAuthToken

        },

        body: formData

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

    }finally{
      setIsUploading(false);
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

        <label>Product Image</label>

<input
    type="file"
    name="image"
    accept="image/*"
    onChange={handleChange}
/>

{
    previewImage && (

        <img

            src={previewImage}

            alt="Preview"

            className="product-preview"

        />

    )
}

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

                           <button

    type="submit"

    disabled={isUploading}

>

    {

        isUploading

        ? "Uploading..."

        : "Update Product"

    }

</button>

        </form>

      </div>

    </div>

  );

};