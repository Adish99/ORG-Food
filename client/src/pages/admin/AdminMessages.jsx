import "./AdminMessages.css";
import { useEffect, useState } from "react";
import { UseAuth } from "../../store/Authentication";
import { toast } from "react-toastify";
import { EmptyState } from "../../components/UI/EmptyState";

export const AdminMessages = () => {

    const { userAuthToken } = UseAuth();

    const [messages, setMessages] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    // ==========================
    // Get All Messages
    // ==========================

    const getMessages = async () => {

        try {

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/contact/admin`,
                {
                    headers: {
                        Authorization: userAuthToken
                    }
                }
            );

            const data = await res.json();

            if (res.ok) {

                setMessages(data.contacts);

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            console.log(error);

            toast.error("Failed to fetch messages.");

        } finally {

            setLoading(false);

        }

    };

    // ==========================
    // Mark Message as Read
    // ==========================

    const markAsRead = async (id) => {

        try {

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/contact/admin/${id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: userAuthToken
                    }
                }
            );

            const data = await res.json();

            if (res.ok) {

                toast.success(data.message);

                getMessages();

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            console.log(error);

        }

    };

    const handleViewMessage = async (message) => {

    setSelectedMessage(message);

    if (message.status === "Read") {

        return;

    }

    try {

        const res = await fetch(

            `${import.meta.env.VITE_API_URL}/api/contact/admin/${message._id}`,

            {

                method: "PUT",

                headers: {

                    Authorization: userAuthToken

                }

            }

        );

        const data = await res.json();

        if (res.ok) {

            getMessages();

        } else {

            toast.error(data.message);

        }

    } catch (error) {

        console.log(error);

    }

};

    // ==========================
    // Delete Message
    // ==========================

    const deleteMessage = async (id) => {


        try {

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/contact/admin/${id}`,
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

                getMessages();

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        getMessages();

    }, []);

    if (loading) {

        return <h2>Loading Messages...</h2>;

    }

    return (

        <div className="admin-messages">

            <h1>Customer Messages</h1>
            <div className="table-container">
<table>

                <thead>

                    <tr>

                        <th>Name</th>

                        <th>Email</th>

                        <th>Subject</th>

                        <th>Status</th>

                        <th>Date</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        messages.length > 0 ?

                            messages.map((message) => (

                                <tr key={message._id}>

                                    <td>{message.name}</td>

                                    <td>{message.email}</td>

                                    <td>{message.subject}</td>

                                    <td>

                                        <span
                                            className={
                                                message.status === "Read"
                                                    ? "status read"
                                                    : "status unread"
                                            }
                                        >

                                            {message.status}

                                        </span>

                                    </td>

                                    <td>

                                        {
                                            new Date(
                                                message.createdAt
                                            ).toLocaleDateString()
                                        }

                                    </td>

                                    <td>

                                        <button
                                            className="view-btn"
                                          onClick={() =>
    handleViewMessage(message)
}
                                        >
                                            View
                                        </button>

            

                                        

                                        <button
    className="delete-btn"
    onClick={() => setDeleteId(message._id)}
>
    Delete
</button>

                                    </td>

                                </tr>

                            ))

                            :

                            <tr>

                                <td colSpan="6">

                                   <EmptyState
    icon="💬"
    title="No customer messages"
    message="You don't have any customer messages at the moment."
/>

                                </td>

                            </tr>

                    }

                </tbody>

            </table>
            </div>


            {/* ==========================
                View Message Modal
            ========================== */}

            {

                selectedMessage &&

                <div className="message-modal">

                    <div className="message-modal-content">

                        <button
                            className="close-btn"
                            onClick={() =>
                                setSelectedMessage(null)
                            }
                        >
                            ✖
                        </button>

                        <h2>Customer Message</h2>

                        <div className="message-info">

                            <p>

                                <strong>Name:</strong>{" "}
                                {selectedMessage.name}

                            </p>

                            <p>

                                <strong>Email:</strong>{" "}
                                {selectedMessage.email}

                            </p>

                            <p>

                                <strong>Subject:</strong>{" "}
                                {selectedMessage.subject}

                            </p>

                            <p>

                                <strong>Status:</strong>{" "}
                                {selectedMessage.status}

                            </p>

                            <p>

                                <strong>Received:</strong>{" "}

                                {

                                    new Date(
                                        selectedMessage.createdAt
                                    ).toLocaleString()

                                }

                            </p>

                        </div>

                        <hr />

                        <h3>Message</h3>

                        <p className="message-text">

                            {selectedMessage.message}

                        </p>

                    </div>

                </div>

            }
            {

    deleteId && (

        <div className="message-modal">

            <div className="delete-modal">

                <h2>

                    Delete Message

                </h2>

                <p>

                    Are you sure you want to permanently delete this customer message?

                </p>

                <div className="delete-actions">

                    <button
                        className="cancel-btn"
                        onClick={() =>
                            setDeleteId(null)
                        }
                    >

                        Cancel

                    </button>

                    <button
                        className="confirm-delete-btn"
                        onClick={async () => {

                            await deleteMessage(deleteId);

                            setDeleteId(null);

                        }}
                    >

                        Delete

                    </button>

                </div>

            </div>

        </div>

    )

}

        </div>

    );

};