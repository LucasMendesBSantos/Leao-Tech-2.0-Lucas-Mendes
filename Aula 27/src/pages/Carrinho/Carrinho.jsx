import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const Carrinho = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <h2>Seu carrinho está vazio</h2>
          <Link to="/" className="btn btn-primary">Voltar às compras</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Carrinho de Compras</h2>
      <div className="row">
        <div className="col-lg-8">
          {cartItems.map((item) => (
            <div key={item.id} className="card mb-3">
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={item.image}
                    className="img-fluid rounded-start"
                    alt={item.title}
                    style={{ height: '150px', objectFit: 'contain' }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{item.description}</p>
                    <p className="card-text"><strong>Preço: R$ {item.price}</strong></p>
                    <div className="d-flex align-items-center">
                      <label className="me-2">Quantidade:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="form-control w-auto me-2"
                      />
                      <button
                        className="btn btn-danger"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Resumo do Pedido</h5>
              <p className="card-text">Total: R$ {getTotalPrice()}</p>
              <button className="btn btn-success w-100">Finalizar Compra</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrinho;