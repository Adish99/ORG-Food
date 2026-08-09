import { Skeleton } from "./Skeleton";
import "./ProfileSkeleton.css";

export const ProfileSkeleton = () => {
    return (
        <div className="profile-skeleton">

            <div className="profile-skeleton-card">

                {/* Profile picture */}
                <Skeleton className="profile-skeleton-avatar" />

                {/* Username */}
                <Skeleton className="profile-skeleton-name" />

                {/* Email */}
                <Skeleton className="profile-skeleton-email" />

                {/* Form */}
                <div className="profile-skeleton-form">

                    <div>
                        <Skeleton className="profile-skeleton-label" />
                        <Skeleton className="profile-skeleton-input" />
                    </div>

                    <div>
                        <Skeleton className="profile-skeleton-label" />
                        <Skeleton className="profile-skeleton-input" />
                    </div>

                    <div>
                        <Skeleton className="profile-skeleton-label" />
                        <Skeleton className="profile-skeleton-input" />
                    </div>

                    <div>
                        <Skeleton className="profile-skeleton-label" />
                        <Skeleton className="profile-skeleton-textarea" />
                    </div>

                    <Skeleton className="profile-skeleton-button" />

                </div>

            </div>

            {/* Change Password */}

            <div className="profile-skeleton-card password-card">

                <Skeleton className="profile-skeleton-password-title" />

                <Skeleton className="profile-skeleton-password-input" />
                <Skeleton className="profile-skeleton-password-input" />
                <Skeleton className="profile-skeleton-password-input" />

                <Skeleton className="profile-skeleton-button" />

            </div>

        </div>
    );
};