/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import Guitar from './components/Guitar';
import Header from './components/Header';
import { db } from './data/db';

function App() {
  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const MAX_ITEMS = 5;
  const MIN_ITEMS = 1;

  //Cada vez que cart cambie quiero ejecutar lo siguiente con useEffect
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  //? FUNCIÓN PARA AGREGAR AL CARRITO
  //* Esta función toma como parámetro un item que iremos agregando
  const addToCart = (item) => {
    //Recorremos el carrito buscando en base el index, y comparamos si el id del objeto es igual al id del id del item
    const itemIndex = cart.findIndex((guitar) => guitar.id === item.id); //Nos retorna -1 si no encontró una coincidencia en base a nuestra condición

    //Ahora creamos una condición donde comparamos si itemIndex es diferente a -1
    if (itemIndex !== -1) {
      if (cart[itemIndex].quantity >= MAX_ITEMS) return;

      //En caso de ser true, significa que encontró algo y ejecutamos el siguiente código
      const updatedCart = cart.map((guitar, index) => {
        if (index === itemIndex) {
          return { ...guitar, quantity: guitar.quantity + 1 };
        } else {
          return guitar;
        }
      });
      setCart(updatedCart);
    } else {
      const newItem = { ...item, quantity: 1 };
      setCart([...cart, newItem]);
    }
  };

  const removeToCart = (id) => {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  };

  const increaseQuantity = (id) => {
    const updateCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCart(updateCart);
  };

  const decrementQuantity = (id) => {
    const updateCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updateCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <>
      <Header
        cart={cart}
        removeToCart={removeToCart}
        increaseQuantity={increaseQuantity}
        decrementQuantity={decrementQuantity}
        clearCart={clearCart}
      />
      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar
              key={guitar.id}
              guitar={guitar}
              setCart={setCart}
              addToCart={addToCart}
            />
          ))}
        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
