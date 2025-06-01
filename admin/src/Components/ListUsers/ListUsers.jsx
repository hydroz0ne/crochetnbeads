import React, { useState, useEffect } from 'react';
import './ListUsers.css';

const ListUsers = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: ''
    });

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:4000/allusers');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const addUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });
            const data = await response.json();
            if (data.success) {
                alert('User added successfully!');
                fetchUsers();
                setNewUser({ username: '', email: '', password: '' });
            } else {
                alert(data.message || 'Failed to add user.');
            }
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`http://localhost:4000/deleteuser/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                
                if (data.success) {
                    alert('User deleted successfully!');
                    fetchUsers(); 
                } else {
                    throw new Error(data.message || 'Failed to delete user.');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Error deleting user.');
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="listusers">
            <h1>User Management</h1>
            <div className="add-user-form">
                <h2>Add New User</h2>
                <form onSubmit={addUser}>
                    <input type="text" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} required />
                    <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} required />
                    <input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} required />
                    <button type="submit">Add User</button>
                </form>
            </div>

            <div className="users-list">
                <h2>All Users</h2>
                <div className="users-header">
                    <p>Username</p>
                    <p>Email</p>
                    <p>Actions</p>
                </div>
                {users.map((user) => (
                    <div key={user._id} className="user-item">
                        <p>{user.username}</p>
                        <p>{user.email}</p>
                        <button onClick={() => handleDelete(user._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListUsers;