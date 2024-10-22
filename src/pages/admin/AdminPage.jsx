import React, { useEffect, useState } from 'react';
import RoleContext from '../../contexts/RoleContext';
import { getUsers, deleteUser } from '../../utils/network-data';
import UserList from '../../components/UserList';
import { Link, Navigate } from 'react-router-dom';

function AdminPage() {
  const { role } = React.useContext(RoleContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(({ data }) => {
      setUsers(data);
    });
  }, []);

  async function onDeleteHandler(uuid) {
    try {
      await deleteUser(uuid);
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  if (role !== 'admin') {
    return <Navigate to="/forbidden" />;
  }

  return (
    <section className="container-sm shadow mt-5 p-4 border userpage">
      <h1>User List</h1>
      <Link to="/addUser">
        <button type="button" className="btn btn-success mt-3 mb-4">
          Add New User
        </button>
      </Link>
      <UserList users={users} deleteUser={onDeleteHandler} />
    </section>
  );
}

export default AdminPage;
