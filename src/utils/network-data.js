import cookieApiClient from './axios-instance';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function login({ email, password }) {
  try {
    const response = await cookieApiClient.post(`${BASE_URL}/login`, {
      email,
      password,
    });
    return { error: false, data: response.data };
  } catch (error) {
    return { error: true, data: error.response.data.msg };
  }
}

async function getUserLogged() {
  try {
    const response = await cookieApiClient.get(`${BASE_URL}/me`);
    return { error: false, data: response.data };
  } catch (error) {
    return { error, data: null };
  }
}

async function logout() {
  try {
    const response = await cookieApiClient.delete(`${BASE_URL}/logout`);
    return response.data.msg;
  } catch (error) {
    return error;
  }
}

//product

async function getProducts() {
  try {
    const response = await cookieApiClient.get(`${BASE_URL}/products`);
    return { error: false, data: response.data };
  } catch (error) {
    return { error, data: null };
  }
}

async function getProductByID(id) {
  try {
    const response = await cookieApiClient.get(`${BASE_URL}/products/${id}`);
    return { error: false, data: response.data };
  } catch (error) {
    return { error, data: null };
  }
}

async function addProduct({ productName, qty, price }) {
  try {
    const response = await cookieApiClient.post(`${BASE_URL}/products`, {
      productName,
      qty,
      price,
    });
    return { error: false, data: `(${response.status}) Data added` };
  } catch (error) {
    return { error, data: null };
  }
}

async function updateProduct({ id, productName, qty, price }) {
  try {
    const response = await cookieApiClient.patch(`${BASE_URL}/products/${id}`, {
      productName,
      qty,
      price,
    });
    return { error: false, data: `(${response.status}) Data updated` };
  } catch (error) {
    return { error, data: null };
  }
}

async function deleteProduct(id) {
  try {
    const response = await cookieApiClient.delete(`${BASE_URL}/products/${id}`);
    return { error: false, data: `(${response.status}) Data deleted` };
  } catch (error) {
    return { error, data: null };
  }
}

// user

async function getUsers() {
  try {
    const response = await cookieApiClient.get(`${BASE_URL}/users`);
    return { error: false, data: response.data };
  } catch (error) {
    return { error, data: null };
  }
}

async function getUserById(id) {
  try {
    const response = await cookieApiClient.get(`${BASE_URL}/users/${id}`);
    return { error: false, data: response.data };
  } catch (error) {
    return { error, data: null };
  }
}

async function addNewUser({ name, email, password, confPassword, role }) {
  try {
    const response = await cookieApiClient.post(`${BASE_URL}/users`, {
      name,
      email,
      password,
      confPassword,
      role,
    });
    return { error: false, data: `(${response.status}) User added` };
  } catch (error) {
    return { error, data: null };
  }
}

async function updateUser({ id, name, email, password, confPassword, role }) {
  try {
    const response = await cookieApiClient.patch(`${BASE_URL}/users/${id}`, {
      name,
      email,
      password,
      confPassword,
      role,
    });
    return { error: false, data: `(${response.status}) User updated` };
  } catch (error) {
    return { error, data: null };
  }
}

async function deleteUser(id) {
  try {
    const response = await cookieApiClient.delete(`${BASE_URL}/users/${id}`);
    return { error: false, data: `(${response.status}) User deleted` };
  } catch (error) {
    return { error, data: null };
  }
}

export {
  login,
  getUserLogged,
  logout,
  getProducts,
  getProductByID,
  addProduct,
  updateProduct,
  deleteProduct,
  getUsers,
  getUserById,
  addNewUser,
  updateUser,
  deleteUser,
};
