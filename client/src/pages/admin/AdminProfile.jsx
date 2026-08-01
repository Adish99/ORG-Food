import "./AdminProfile.css";
import { useEffect, useState } from "react";
import { UseAuth } from "../../store/Authentication";
import { toast } from "react-toastify";

export const AdminProfile = () => {

    const { userAuthToken } = UseAuth();

    const [profile, setProfile] = useState({

        username: "",

        email: "",

        phone: "",

        address: "",

        role: ""

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

            }

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        getProfile();

    }, []);

    // ==========================
    // Update Profile
    // ==========================

    const handleProfileChange = (e) => {

        setProfile({

            ...profile,

            [e.target.name]: e.target.value

        });

    };

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

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            console.log(error);

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

    const changePassword = async (e) => {

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

        }

    };

    return (

        <div className="admin-profile">

            <div className="admin-profile-card">

                <div className="admin-header">

                    <div className="admin-avatar">

                        {profile.username?.charAt(0).toUpperCase()}

                    </div>

                   <div>

    <h2>{profile.username}</h2>

    <p>{profile.email}</p>

    <span className="role-badge">

      {profile.role?.toUpperCase()}

    </span>

    <p
        style={{
            marginTop:"10px",
            color:"#666"
        }}
    >

        Welcome back! Manage your store settings and account information here.

    </p>

</div>

                </div>

                <form onSubmit={updateProfile} className="profile-form">

                    <div className="profile-group">

                        <label>Username</label>

                        <input

                            name="username"

                            value={profile.username}

                            onChange={handleProfileChange}

                        />

                    </div>

                    <div className="profile-group">

                        <label>Email</label>

                        <input

                            value={profile.email}

                            readOnly

                        />

                    </div>

                    <div className="profile-group">

                        <label>Phone</label>

                        <input

                            name="phone"

                            value={profile.phone}

                            onChange={handleProfileChange}

                        />

                    </div>

                    <div className="profile-group">

                        <label>Address</label>

                        <textarea

                            rows="4"

                            name="address"

                            value={profile.address}

                            onChange={handleProfileChange}

                        />

                    </div>

                    <button className="update-btn">

                        Update Profile

                    </button>

                </form>

            </div>

            <div className="admin-profile-card">

                <h2>🔒 Change Password</h2>

    <form

    className="profile-form"
    onSubmit={changePassword}
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