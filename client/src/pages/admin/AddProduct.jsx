import "./AddProduct.css";
import { useEffect, useState } from "react";
import { UseAuth } from "../../store/Authentication";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AddProduct = () => {

    const navigate = useNavigate();

    const { userAuthToken } = UseAuth();

    const [categories, setCategories] = useState([]);

    const [product, setProduct] = useState({

        name: "",

        description: "",

        price: "",

        stock: "",

        weight: "",

        image: null,

        categoryId: "",

        isFeatured: false

    });
    const [previewImage, setPreviewImage] = useState("");

const [isUploading, setIsUploading] = useState(false);

    // ==========================
    // Handle Input Change
    // ==========================

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

    // ==========================
    // Get Categories
    // ==========================

    const getCategories = async () => {

        try {

            const res = await fetch(

                `${import.meta.env.VITE_API_URL}/api/category`

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

        getCategories();

    }, []);

    // ==========================
    // Submit Product
    // ==========================

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

            formData.append("image", product.image);

            const res = await fetch(

                `${import.meta.env.VITE_API_URL}/api/products/add`,

                {

                    method: "POST",

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

            toast.error("Something went wrong.");

        }finally{
            setIsUploading(false);  
        }

    };

    return (

        <div className="add-product-page">

            <div className="add-product-card">

                <h1>Add New Product</h1>

                <form onSubmit={handleSubmit}>

                    <label>Product Name</label>

                    <input

                        type="text"

                        name="name"

                        value={product.name}

                        onChange={handleChange}

                        required

                    />

                    <label>Description</label>

                    <textarea

                        name="description"

                        rows="4"

                        value={product.description}

                        onChange={handleChange}

                        required

                    />

                    <label>Price</label>

                    <input

                        type="number"

                        name="price"

                        value={product.price}

                        onChange={handleChange}

                        required

                    />

                    <label>Stock</label>

                    <input

                        type="number"

                        name="stock"

                        value={product.stock}

                        onChange={handleChange}

                        required

                    />

                    <label>Weight</label>

                    <input

                        type="text"

                        name="weight"

                        value={product.weight}

                        onChange={handleChange}

                        required

                    />
<label>Product Image</label>

<input
    type="file"
    name="image"
    accept="image/*"
    onChange={handleChange}
    disabled={isUploading}
    required
/>

{
    previewImage && (

        <img
            src={previewImage}
            alt="Product Preview"
            className="product-preview"
        />

    )
}

                    <label>Category</label>

                    <select

                        name="categoryId"

                        value={product.categoryId}

                        onChange={handleChange}

                        required

                    >

                        <option value="">

                            Select Category

                        </option>

                        {

                            categories.map((category) => (

                                <option

                                    key={category._id}

                                    value={category._id}

                                >

                                    {category.categoryName}

                                </option>

                            ))

                        }

                    </select>

                    <div className="checkbox-row">

                        <input

                            type="checkbox"

                            name="isFeatured"

                            checked={product.isFeatured}

                            onChange={handleChange}

                        />

                        <span>

                            Featured Product

                        </span>

                    </div>

                   <button

    type="submit"

    disabled={isUploading}

>

    {

        isUploading

        ? "Uploading..."

        : "Add Product"

    }

</button>

                </form>

            </div>

        </div>

    );

};