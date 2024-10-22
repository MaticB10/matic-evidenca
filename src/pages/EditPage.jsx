import React from 'react';
import ProductUpdate from '../components/ProductUpdate';
import { useNavigate} from 'react-router-dom';
import { updateProduct } from '../utils/network-data';

function EditPage() {
  const navigate = useNavigate();

  async function updateProductHandler(product) {
    const { error } = await updateProduct(product);
    if (!error) {
      navigate('/');
    }
  }

  return (
    <section className="container-sm">
      <h1>Edit Data Produk</h1>
      <ProductUpdate updateProduct={updateProductHandler}/>
    </section>
  );
}

export default EditPage;
