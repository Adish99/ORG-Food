import "./AdminUsers.css";
import { useEffect, useState } from "react";
import { UseAuth } from "../../store/Authentication";
import { Loader } from "../../components/UI/Loader";

export const AdminUsers = () => {

    const { userAuthToken } = UseAuth();

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getUsers = async () => {

        try {

            const res = await fetch(

                "http://localhost:8000/api/admin/users",

                {

                    headers: {

                        Authorization: userAuthToken

                    }

                }

            );

            const data = await res.json();

            if (res.ok) {

                setUsers(data.users);

            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        getUsers();

    }, []);

    const updateRole = async (id) => {
 setIsSubmitting(true);
    try {

        const res = await fetch(

            `http://localhost:8000/api/admin/users/${id}`,

            {

                method: "PUT",

                headers: {

                    Authorization: userAuthToken

                }

            }

        );

        const data = await res.json();

        if (res.ok) {

            alert(data.message);

            getUsers();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.log(error);

    }finally {
    setIsSubmitting(false);
    }
};

const deleteUser = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;
 setIsSubmitting(true);
    try {

        const res = await fetch(

            `http://localhost:8000/api/admin/users/${id}`,

            {

                method: "DELETE",

                headers: {

                    Authorization: userAuthToken

                }

            }

        );

        const data = await res.json();

        if (res.ok) {

            alert(data.message);

            getUsers();

        } else {

            alert(data.message);
        }

    } catch (error) {

        console.log(error);
    }finally {
    setIsSubmitting(false);
    }
};

    if (loading) {

        return <Loader/>

    }

    return (

        <div className="admin-users-page">

            <div className="admin-header">

                <div>

                    <h1>Manage Users</h1>

                    <p>View all registered users.</p>

                </div>

            </div>

            <div className="table-container">

                <table className="users-table">

                    <thead>

                        <tr>

                            <th>Username</th>

                            <th>Email</th>

                            <th>Phone</th>

                            <th>Role</th>

                            <th>Joined</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            users.length > 0 ?

                            (

                                users.map((user) => (

                                    <tr key={user._id}>

                                        <td>{user.username}</td>

                                        <td>{user.email}</td>

                                        <td>{user.phone}</td>

                                        <td>

                                            <span className={`role ${user.role}`}>

                                                {user.role}

                                            </span>

                                        </td>

                                        <td>

                                            {

                                                new Date(

                                                    user.createdAt

                                                ).toLocaleDateString()

                                            }

                                        </td>

                                        <td>

 <td>

    <button
        className="edit-btn"
        onClick={() => updateRole(user._id)}
    >
        {user.role === "admin"
            ? "Make User"
            : "Make Admin"}
    </button>

    <button
        className="delete-btn"
        onClick={() => deleteUser(user._id)}
          disabled={isSubmitting}
    >
      {isSubmitting ? "Deleting..." : "Delete"}
    </button>

</td>
                                        </td>

                                    </tr>

                                ))

                            )

                            :

                            (

                                <tr>

                                    <td colSpan="6">

                                        No Users Found.

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