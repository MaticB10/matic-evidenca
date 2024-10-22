import React from 'react';
import ProductInput from '../components/ProductInput';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../utils/network-data';

function AddPage() {
  const navigate = useNavigate();

  async function addProductHandler(product) {
    const { error } = await addProduct(product);
    if (!error) {
      navigate('/');
    }
  }

  return (
    <section className="container-sm">
      <h1>Tambahkan Produk</h1>
      <ProductInput addProduct={addProductHandler} />
    </section>
  );
}

export default AddPage;
