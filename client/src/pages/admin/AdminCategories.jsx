import "./AdminCategories.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/UI/Loader";
import { EmptyState } from "../../components/UI/EmptyState";

export const AdminCategories = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const getCategories = async () => {

        try {

            const res = await fetch(
                "http://localhost:8000/api/category"
            );

            const data = await res.json();
            console.log(data.categories);

            if (res.ok) {

                setCategories(data.categories);

            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        getCategories();

    }, []);

    const deleteCategory = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {

        const res = await fetch(

            `http://localhost:8000/api/category/delete/${id}`,

            {
                method: "DELETE"
            }

        );

        const data = await res.json();

        if (res.ok) {

            alert(data.message);

            getCategories();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.log(error);

    }

};

    if (loading) {

        return (
          <Loader/>
        );

    }

    return (

        <div className="admin-categories-page">

            <div className="admin-header">

                <div>

                    <h1>Manage Categories</h1>

                    <p>
                        Manage all categories available in your store.
                    </p>

                </div>

                <button
                    className="add-category-btn"
                    onClick={() =>
                        navigate("/admin/categories/add")
                    }
                >

                    + Add Category

                </button>

            </div>

            <div className="table-container">

                <table className="category-table">

                   <thead>
    <tr>
        <th>Category Name</th>
        <th>Actions</th>
    </tr>
</thead>

                    <tbody>

                        {

                            categories.length > 0 ?

                                (

                                    categories.map((category) => (

                                       <tr key={category._id}>

    <td>{category.categoryName}</td>

    <td>

       <button
    className="edit-btn"
    onClick={() =>
        navigate(`/admin/categories/edit/${category._id}`)
    }
>
    Edit
</button>

       <button
    className="delete-btn"
    onClick={() => deleteCategory(category._id)}
>
    Delete
</button>

    </td>

</tr>

                                    ))

                                )

                                :

                                (

                                    <tr>

                                        <td colSpan="2">

                                         <EmptyState
    icon="🗂️"
    title="No categories yet"
    message="Create your first product category to organize your store."
    buttonText="Add Category"
    onButtonClick={handleAddCategory}
/>

                                        </td>

                                    </tr>

                                )

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

};