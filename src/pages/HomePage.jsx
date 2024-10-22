import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../utils/network-data';
import ProductList from '../components/ProductList';
import { Link } from 'react-router-dom';

function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(({ data }) => {
      setProducts(data);
    });
  }, []);

  async function onDeleteHandler(id) {
    try {
      await deleteProduct(id);
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  return (
    <section className="container-sm shadow mt-5 p-4 border homepage">
      <h1>Product List</h1>
      <Link to="/addPage">
        <button type="button" className="btn btn-success mt-3 mb-4">
          Add New Product
        </button>
      </Link>
      <ProductList products={products} deleteProduct={onDeleteHandler} />
    </section>
  );
}

export default HomePage;
