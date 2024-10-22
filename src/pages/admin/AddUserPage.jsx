import React from 'react';
import UserInput from '../../components/UserInput';
import RoleContext from '../../contexts/RoleContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { addNewUser } from '../../utils/network-data';

function AddUserPage() {
  const {role} = React.useContext(RoleContext);
  const navigate = useNavigate();

  if(role !== 'admin'){
    return <Navigate to="/forbidden" />;
  }

  async function addNewUserHandler(user) {
    const { error } = await addNewUser(user);
    if (!error) {
      navigate('/admin');
    }
  }

  return (
    <section className="container-sm">
      <h1>Add New User</h1>
      <UserInput addUser={addNewUserHandler} />
    </section>
  );
}

export default AddUserPage;
