import React from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router"; 
import { useCart } from "../../contexts/CardContext/CardContext";



const CartPage = () => {
  const { cartItems, increaseQty, decreaseQty, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const handleRemove = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeItem(id);
        Swal.fire("Removed!", "Item has been removed.", "success");
      }
    });
  };

  const handleClearCart = () => {
    Swal.fire({
      title: "Clear all cart items?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, clear all!",
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire("Cleared!", "Cart is now empty.", "success");
      }
    });
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-center text-lg">Your cart is empty.</p>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg shadow">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border border-gray-300 px-6 py-3">Name</th>
                  <th className="border border-gray-300 px-6 py-3">Company</th>
                  <th className="border border-gray-300 px-6 py-3">Price</th>
                  <th className="border border-gray-300 px-6 py-3">Quantity</th>
                  <th className="border border-gray-300 px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr
                    key={item._id}
                    className="border border-gray-300 hover:bg-gray-50"
                  >
                    <td className="border border-gray-300 px-6 py-3">{ item.itemName}</td>
                    <td className="border border-gray-300 px-6 py-3">{item.company}</td>
                    <td className="border border-gray-300 px-6 py-3">${item.price.toFixed(2)}</td>
                    <td className="border border-gray-300 px-6 py-3 flex items-center justify-center gap-3">
                      <button
                        onClick={() => decreaseQty(item._id)}
                        className="bg-gray-300 hover:bg-gray-400 rounded px-3 py-1 font-bold"
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQty(item._id)}
                        className="bg-gray-300 hover:bg-gray-400 rounded px-3 py-1 font-bold"
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                    </td>
                    <td className="border border-gray-300 px-6 py-3 text-center">
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="text-red-600 hover:underline font-semibold"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-semibold">Total: ${total.toFixed(2)}</h3>
            <div className="flex gap-4">
              <button
                onClick={handleClearCart}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
              >
                Clear Cart
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
