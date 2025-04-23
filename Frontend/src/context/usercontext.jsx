// Import required packages
import { createContext, useState } from "react";

// Define user context
export const UserContext = createContext();  //


//! Create UserProvider (Exports All Functions)
export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]); // Empty array for users

    // Create User Function (Like Flask `create_user`)
    const createUser = async (userData) => {
        console.log("Payload", JSON.stringify(userData, null, 3));
        try {
            // Send POST request to Flask backend
            const resp = await fetch("https://tyde-home.onrender.com/register", {
                method: "POST",
                credentials : "include",
                headers: { "Content-Type": "application/json" }, // Send JSON data
                body: JSON.stringify(userData),
            });

            // Convert response to JSON
            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.error || "Failed To Create User");
            }

            // Update state with new user
            setUsers((prevUsers) => [...prevUsers, data.user]);

            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    //! Fetch all users
    const fetchUsers = async () => {
        try {
            const response = await fetch("https://tyde-home.onrender.com/");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch users");
            }

            setUsers(data); // Update state with all users

            return { success: true, users: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    //! Fetch a single user by ID
    const fetchUser = async (userId) => {
        try {
            const response = await fetch(`https://tyde-home.onrender.com/users/${userId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch user");
            }

            return { success: true, user: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    //! Update user by ID (Like Flask `update_user`)
    const updateUser = async (userId, userData) => {
        try {
            const resp = await fetch(`https://tyde-home.onrender.com/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" }, // Send JSON data
                body: JSON.stringify(userData),
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.error || "Failed to update user");
            }

            // Update the local state with the updated user
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === userId ? { ...user, ...userData } : user
                )
            );

            return { success: true, updatedUser: data.updated_user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    //! Delete user by ID (Like Flask `delete_user`)
    const deleteUser = async (userId) => {
        try {
            const response = await fetch(`https://tyde-home.onrender.com/users/${userId}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to delete user");
            }

            // Remove the deleted user from state
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    //! Return logic to wrap children components with UserContext.Provider
    return (
        <UserContext.Provider value={{ users, setUsers, createUser, fetchUsers, fetchUser, updateUser, deleteUser }}>
            {children}
        </UserContext.Provider>
    );
};
