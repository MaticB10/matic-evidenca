import React from 'react';
import RoleContext from '../../contexts/RoleContext';
import UserUpdate from '../../components/UserUpdate';
import { useNavigate, Navigate } from 'react-router-dom';
import { updateUser } from '../../utils/network-data';

function EditUserPage() {
  const { role } = React.useContext(RoleContext);
  const navigate = useNavigate();

  if (role !== 'admin') {
    return <Navigate to="/forbidden" />;
  }

  async function updateUserHandler(user) {
    const { error } = await updateUser(user);
    if (!error) {
      navigate('/admin');
    }
  }

  return (
    <section className="container-sm">
      <h1>Edit Data User</h1>
      <UserUpdate updateUser={updateUserHandler} />
    </section>
  );
}

export default EditUserPage;
