import "./Profile.css";
import { useEffect, useState } from "react";
import { UseAuth } from "../store/Authentication";
import { toast } from "react-toastify";

export const Profile = () => {

    const { userAuthToken } = UseAuth();

   const [profile, setProfile] = useState({

    username: "",

    email: "",

    phone: "",

    address: "",

    profileImage: "",

    profileImagePublicId: ""

});
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
const [selectedImage, setSelectedImage] = useState(null);
const [imagePreview, setImagePreview] = useState("");
const [uploadingImage, setUploadingImage] = useState(false);

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
const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);

    setImagePreview(
        URL.createObjectURL(file)
    );
};
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

}else {

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
    // Handle Change
    // ==========================

    const handleChange = (e) => {

        setProfile({

            ...profile,

            [e.target.name]: e.target.value

        });

    };

    // ==========================
    // Update Profile
    // ==========================

    const handleSubmit = async (e) => {

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

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            console.log(error);

        }

    };
    const handleProfileImageUpload = async () => {

    if (!selectedImage) {
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
                data.message || "Image upload failed."
            );

            return;
        }

        toast.success(
            "Profile picture updated successfully."
        );

        setImagePreview(data.profileImage);
        setProfile((prev) => ({
            ...prev,
            profileImage: data.profileImage
        }));


        setSelectedImage(null);

    } catch (error) {

        console.log(
            "Profile image upload error:",
            error
        );

        toast.error(
            "Something went wrong."
        );

    } finally {

        setUploadingImage(false);

    }
};

    const handlePasswordSubmit = async (e) => {

    e.preventDefault();

    try {

        const res = await fetch(

            "http://localhost:8000/api/change-password",

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: userAuthToken

                },

                body: JSON.stringify(passwordData)

            }

        );

        const data = await res.json();

        if (res.ok) {

            toast.success(data.message);

            setPasswordData({

                currentPassword: "",

                newPassword: "",

                confirmPassword: ""

            });

        } else {

            toast.error(data.message);

        }

    } catch (error) {

        console.log(error);

        toast.error("Something went wrong.");

    }

};

    return (

       <div className="profile-page">
      <div className="profile-picture-section">

    <div className="profile-picture">

        {imagePreview ? (

            <img
                src={imagePreview}
                alt="Profile"
            />

        ) : (

            <div className="default-avatar">
                {profile.username
                    ?.charAt(0)
                    .toUpperCase() || "A"}
            </div>

        )}

    </div>

  <label className="profile-upload-label">

    Choose Profile Picture

    <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
    />

</label>

    {selectedImage && (

        <button
            type="button"
            onClick={handleProfileImageUpload}
            disabled={uploadingImage}
        >

            {uploadingImage
                ? "Uploading..."
                : "Upload Profile Picture"
            }

        </button>

    )}

</div>
<div className="profile-card">

<div className="profile-header">

<div className="profile-avatar">

{profile.username?.charAt(0).toUpperCase()}

</div>

<div className="profile-info">

<h2>{profile.username}</h2>

<p>{profile.email}</p>

</div>

</div>

<form
className="profile-form"
onSubmit={handleSubmit}
>

<div className="profile-group">

<label>Username</label>

<input
type="text"
name="username"
value={profile.username}
onChange={handleChange}
/>

</div>

<div className="profile-group">

<label>Email</label>

<input
type="email"
value={profile.email}
readOnly
/>

</div>

<div className="profile-group">

<label>Phone</label>

<input
type="text"
name="phone"
value={profile.phone}
onChange={handleChange}
/>

</div>

<div className="profile-group">

<label>Address</label>

<textarea
rows="4"
name="address"
value={profile.address}
onChange={handleChange}
/>

</div>

<button className="update-btn">

Update Profile

</button>

</form>

</div>

<div className="profile-card">

    <h2>🔒 Change Password</h2>

    <form

        className="profile-form"

        onSubmit={handlePasswordSubmit}

    >

        <div className="profile-group full-width">

            <label>Current Password</label>

           <div className="password-input">

    <input

        type={showPassword.current ? "text" : "password"}

        name="currentPassword"

        value={passwordData.currentPassword}

        onChange={handlePasswordChange}

        required

    />

    <span

        className="password-toggle"

        onClick={() => togglePassword("current")}

    >

        {showPassword.current ? "🙈" : "👁"}

    </span>

</div>
        </div>

        <div className="profile-group">

            <label>New Password</label>

           <div className="password-input">

    <input

        type={showPassword.new ? "text" : "password"}

        name="newPassword"

        value={passwordData.newPassword}

        onChange={handlePasswordChange}

        required

    />

    <span

        className="password-toggle"

        onClick={() => togglePassword("new")}

    >

        {showPassword.new ? "🙈" : "👁"}

    </span>

</div>

        </div>

        <div className="profile-group">

            <label>Confirm Password</label>

           <div className="password-input">

    <input

        type={showPassword.confirm ? "text" : "password"}

        name="confirmPassword"

        value={passwordData.confirmPassword}

        onChange={handlePasswordChange}

        required

    />

    <span

        className="password-toggle"

        onClick={() => togglePassword("confirm")}

    >

        {showPassword.confirm ? "🙈" : "👁"}

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