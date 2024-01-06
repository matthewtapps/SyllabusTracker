import { User } from "@auth0/auth0-react";
import Typography from '@mui/material/Typography';
import React from "react";
import BaseLayout from "../../components/Base/BaseLayout";


export const ProfilePage: React.FC = (user: User) => {
    return (
        <BaseLayout text="Profile">
            <div className="content-layout">
                <h1 id="page-title" className="content__title">
                    Profile Page
                </h1>
                <div className="content__body">
                    <p id="page-description">
                        <span>
                            You can use the <strong>ID Token</strong> to get the profile
                            information of an authenticated user.
                        </span>
                        <span>
                            <strong>Only authenticated users can access this page.</strong>
                        </span>
                    </p>
                    <div className="profile-grid">
                        <div className="profile__header">
                            <img
                                src={user.picture}
                                alt="Profile"
                                className="profile__avatar"
                            />
                            <div className="profile__headline">
                                <h2 className="profile__title">{user.name}</h2>
                                <span className="profile__description">{user.email}</span>
                            </div>
                        </div>
                        <div className="profile__details">
                            <Typography>Decoded ID token: {JSON.stringify(user, null, 2)}</Typography>
                        </div>
                        <div className="test">
                            <Typography>{user['https://syllabustracker.matthewtapps.com/roles']}</Typography>
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
};
