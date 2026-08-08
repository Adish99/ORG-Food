import "./AdminProfile.css";
import { useEffect, useState } from "react";
import { UseAuth } from "../../store/Authentication";
import { toast } from "react-toastify";

export const AdminProfile = () => {

    const {
        userAuthToken,
        updateUser
    } = UseAuth();

    const [profile, setProfile] = useState({
        username: "",
        email: "",
        phone: "",
        address: "",
        role: "",
        profileImage: ""
    });

    // ==========================
    // Profile Image
    // ==========================

    const [selectedImage, setSelectedImage] = useState(null);

    const [imagePreview, setImagePreview] = useState("");

    const [uploadingImage, setUploadingImage] = useState(false);

    // ==========================
    // Password
    // ==========================

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });


    // ==========================
    // Get Profile
    // ==========================

    const getProfile = async () => {

        try {

            const res = await fetch(
                "http://localhost:8000/api/profile",
                {
                    headers: {
                        Authorization: userAuthToken
                    }
                }
            );

            const data = await res.json();

            if (res.ok) {

                setProfile(data.user);

                setImagePreview(
                    data.user.profileImage || ""
                );

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            console.log(error);

        }

    };


    useEffect(() => {

        getProfile();

    }, []);


    // ==========================
    // Profile Change
    // ==========================

    const handleProfileChange = (e) => {

        setProfile({

            ...profile,

            [e.target.name]: e.target.value

        });

    };


    // ==========================
    // Update Profile
    // ==========================

    const updateProfile = async (e) => {

        e.preventDefault();

        try {

            const res = await fetch(
                "http://localhost:8000/api/profile",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: userAuthToken
                    },

                    body: JSON.stringify({

                        username: profile.username,

                        phone: profile.phone,

                        address: profile.address

                    })

                }
            );

            const data = await res.json();

            if (res.ok) {

                toast.success(data.message);

                updateUser({
                    username: profile.username,
                    phone: profile.phone,
                    address: profile.address
                });

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            console.log(error);

        }

    };


    // ==========================
    // Image Selection
    // ==========================

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setSelectedImage(file);

        setImagePreview(
            URL.createObjectURL(file)
        );

    };


    // ==========================
    // Upload Profile Image
    // ==========================

    const handleProfileImageUpload = async () => {

        if (!selectedImage) {

            toast.error(
                "Please select an image first."
            );

            return;

        }

        try {

            setUploadingImage(true);

            const formData = new FormData();

            formData.append(
                "profileImage",
                selectedImage
            );

            const res = await fetch(
                "http://localhost:8000/api/profile/profile-image",
                {
                    method: "PUT",

                    headers: {
                        Authorization: userAuthToken
                    },

                    body: formData
                }
            );

            const data = await res.json();

            if (!res.ok) {

                toast.error(
                    data.message ||
                    "Image upload failed."
                );

                return;

            }

            // Update local image
            setImagePreview(
                data.profileImage
            );

            setSelectedImage(null);

            // Update AuthContext
            updateUser({
                profileImage: data.profileImage
            });

            // Update profile state
            setProfile((prev) => ({
                ...prev,
                profileImage: data.profileImage
            }));

            toast.success(
                "Profile picture updated successfully."
            );

        } catch (error) {

            console.log(
                "Admin profile image upload error:",
                error
            );

            toast.error(
                "Something went wrong."
            );

        } finally {

            setUploadingImage(false);

        }

    };
    // ==========================
// Remove Profile Image
// ==========================

const handleRemoveProfileImage = async () => {

    if (!imagePreview) {

        toast.error(
            "No profile picture to remove."
        );

        return;

    }

    try {

        const res = await fetch(
            "http://localhost:8000/api/profile/profile-image",
            {
                method: "DELETE",

                headers: {
                    Authorization: userAuthToken
                }
            }
        );

        const data = await res.json();

        if (!res.ok) {

            toast.error(
                data.message ||
                "Failed to remove profile picture."
            );

            return;

        }

        // Remove local preview
        setImagePreview("");

        // Remove selected image
        setSelectedImage(null);

        // Update profile state
        setProfile((prev) => ({
            ...prev,
            profileImage: ""
        }));

        // Update AuthContext
        updateUser({
            profileImage: ""
        });

        toast.success(
            "Profile picture removed successfully."
        );

    } catch (error) {

        console.log(
            "Remove Admin Profile Image Error:",
            error
        );

        toast.error(
            "Something went wrong."
        );

    }

};


    // ==========================
    // Password
    // ==========================

    const handlePasswordChange = (e) => {

        setPasswordData({

            ...passwordData,

            [e.target.name]: e.target.value

        });

    };


    const togglePassword = (field) => {

        setShowPassword((prev) => ({

            ...prev,

            [field]: !prev[field]

        }));

    };


    // ==========================
    // Change Password
    // ==========================

    const changePassword = async (e) => {

        e.preventDefault();

        try {

            const res = await fetch(
                "http://localhost:8000/api/change-password",
                {
                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            userAuthToken

                    },

                    body: JSON.stringify(
                        passwordData
                    )

                }
            );

            const data = await res.json();

            if (res.ok) {

                toast.success(
                    data.message
                );

                setPasswordData({

                    currentPassword: "",

                    newPassword: "",

                    confirmPassword: ""

                });

            } else {

                toast.error(
                    data.message
                );

            }

        } catch (error) {

            console.log(error);

            toast.error(
                "Something went wrong."
            );

        }

    };


    // ==========================
    // UI
    // ==========================

    return (

        <div className="admin-profile">

            {/* ==========================
                ADMIN PROFILE CARD
            ========================== */}

            <div className="admin-profile-card">

                <div className="admin-header">


                    {/* Profile Picture */}

                    <div className="admin-avatar-wrapper">

                        <div className="admin-avatar">

                            {imagePreview ? (

                                <img
                                    src={imagePreview}
                                    alt="Admin Profile"
                                />

                            ) : (

                                <div className="default-admin-avatar">

                                    {profile.username
                                        ?.charAt(0)
                                        .toUpperCase() ||
                                        "A"}

                                </div>

                            )}

                        </div>

                        <label
                            className="profile-image-label"
                        >

                            📷 Change Picture

                            <input
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleImageChange
                                }
                            />

                        </label>


                        {/* Upload Button */}

                        {selectedImage && (

                            <button
                                type="button"
                                className="upload-profile-btn"
                                onClick={
                                    handleProfileImageUpload
                                }
                                disabled={
                                    uploadingImage
                                }
                            >

                                {uploadingImage

                                    ? "Uploading..."

                                    : "Upload Picture"

                                }

                            </button>

                        )}

                    </div>


                    {/* Admin Information */}

                    <div>

                        <h2>
                            {profile.username}
                        </h2>

                        <p>
                            {profile.email}
                        </p>

                        <span className="role-badge">

                            {profile.role?.toUpperCase()}

                        </span>

                        <p
                            style={{
                                marginTop: "10px",
                                color: "#666"
                            }}
                        >

                            Welcome back! Manage your
                            store settings and account
                            information here.

                        </p>

                    </div>

                </div>


                {/* ==========================
                    PROFILE FORM
                ========================== */}

                <form
                    onSubmit={updateProfile}
                    className="profile-form"
                >

                    <div className="profile-group">

                        <label>
                            Username
                        </label>

                        <input
                            name="username"
                            value={
                                profile.username
                            }
                            onChange={
                                handleProfileChange
                            }
                        />

                    </div>


                    <div className="profile-group">

                        <label>
                            Email
                        </label>

                        <input
                            value={
                                profile.email
                            }
                            readOnly
                        />

                    </div>


                    <div className="profile-group">

                        <label>
                            Phone
                        </label>

                        <input
                            name="phone"
                            value={
                                profile.phone
                            }
                            onChange={
                                handleProfileChange
                            }
                        />

                    </div>


                    <div className="profile-group">

                        <label>
                            Address
                        </label>

                        <textarea
                            rows="4"
                            name="address"
                            value={
                                profile.address
                            }
                            onChange={
                                handleProfileChange
                            }
                        />

                    </div>


                    {selectedImage && (

        <button
            type="button"
            className="upload-profile-btn"
            onClick={handleProfileImageUpload}
            disabled={uploadingImage}
        >

            {uploadingImage
                ? "Uploading..."
                : "Upload Picture"
            }

        </button>

    )}
                    {imagePreview && !selectedImage && (

    <button
        type="button"
        className="remove-profile-btn"
        onClick={handleRemoveProfileImage}
    >

        🗑️ Remove Picture

    </button>

)}

                </form>

            </div>


            {/* ==========================
                CHANGE PASSWORD
            ========================== */}

            <div className="admin-profile-card">

                <h2>
                    🔒 Change Password
                </h2>

                <form
                    className="profile-form"
                    onSubmit={changePassword}
                >

                    {/* Current Password */}

                    <div className="profile-group full-width">

                        <label>
                            Current Password
                        </label>

                        <div className="password-input">

                            <input
                                type={
                                    showPassword.current
                                        ? "text"
                                        : "password"
                                }
                                name="currentPassword"
                                value={
                                    passwordData.currentPassword
                                }
                                onChange={
                                    handlePasswordChange
                                }
                                required
                            />

                            <span
                                className="password-toggle"
                                onClick={() =>
                                    togglePassword(
                                        "current"
                                    )
                                }
                            >

                                {showPassword.current
                                    ? "🙈"
                                    : "👁"}

                            </span>

                        </div>

                    </div>


                    {/* New Password */}

                    <div className="profile-group">

                        <label>
                            New Password
                        </label>

                        <div className="password-input">

                            <input
                                type={
                                    showPassword.new
                                        ? "text"
                                        : "password"
                                }
                                name="newPassword"
                                value={
                                    passwordData.newPassword
                                }
                                onChange={
                                    handlePasswordChange
                                }
                                required
                            />

                            <span
                                className="password-toggle"
                                onClick={() =>
                                    togglePassword(
                                        "new"
                                    )
                                }
                            >

                                {showPassword.new
                                    ? "🙈"
                                    : "👁"}

                            </span>

                        </div>

                    </div>


                    {/* Confirm Password */}

                    <div className="profile-group">

                        <label>
                            Confirm Password
                        </label>

                        <div className="password-input">

                            <input
                                type={
                                    showPassword.confirm
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                value={
                                    passwordData.confirmPassword
                                }
                                onChange={
                                    handlePasswordChange
                                }
                                required
                            />

                            <span
                                className="password-toggle"
                                onClick={() =>
                                    togglePassword(
                                        "confirm"
                                    )
                                }
                            >

                                {showPassword.confirm
                                    ? "🙈"
                                    : "👁"}

                            </span>

                        </div>

                    </div>


                    <button className="update-btn">

                        Change Password

                    </button>

                </form>

            </div>

        </div>

    );

};