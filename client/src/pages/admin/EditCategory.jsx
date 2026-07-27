import "./EditCategory.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const EditCategory = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [category, setCategory] = useState({
        categoryName: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getCategory = async () => {
 setIsSubmitting(true);
        try {

            const res = await fetch(
                `http://localhost:8000/api/category/${id}`
            );

            const data = await res.json();

            if (res.ok) {

                setCategory({
                    categoryName: data.category.categoryName
                });

            }

        } catch (error) {

            console.log(error);

        }finally {
    setIsSubmitting(false);
        }
    };

    useEffect(() => {

        getCategory();

    }, []);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setCategory((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await fetch(

                `http://localhost:8000/api/category/update/${id}`,

                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(category)

                }

            );

            const data = await res.json();

            if (res.ok) {

                alert(data.message);

                navigate("/admin/categories");

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="edit-category-page">

            <div className="edit-category-card">

                <h1>Edit Category</h1>

                <form onSubmit={handleSubmit}>

                    <label>Category Name</label>

                    <input
                        type="text"
                        name="categoryName"
                        value={category.categoryName}
                        onChange={handleChange}
                        required
                    />

                    <button
    type="submit"
    disabled={isSubmitting}
>
    {isSubmitting ? "Updating..." : "Edit Category"}
</button>

                </form>

            </div>

        </div>

    );

};