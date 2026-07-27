import "./AddCategory.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AddCategory = () => {

    const navigate = useNavigate();

    const [category, setCategory] = useState({
    categoryName: ""
});
const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setCategory((prev) => ({

            ...prev,
            [name]: value

        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();
         setIsSubmitting(true);

        try {

            const res = await fetch(
                "http://localhost:8000/api/category/add",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(category)
                }
            );

            const data = await res.json();

            if (res.ok) {

                toast.success(data.message);

                navigate("/admin/categories");

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            console.log(error);

        }finally {
    setIsSubmitting(false);
        }

    };

    return (

        <div className="add-category-page">

            <div className="add-category-card">

                <h1>Add New Category</h1>

               <form onSubmit={handleSubmit}>

    <label>Category Name</label>

    <input
        type="text"
        name="categoryName"
        value={category.categoryName}
        onChange={handleChange}
        placeholder="Enter category name"
        required
    />

   <button
    type="submit"
    disabled={isSubmitting}
>
    {isSubmitting ? "Adding...." : "Add Category"}
</button>

</form>

            </div>

        </div>

    );

};