import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";


const CardContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const userEmail = user?.email;
  const queryClient = useQueryClient();
  const [cartItems, setCartItems] = useState([]);

  
  const { data, isLoading, error } = useQuery({
    queryKey: ["cart", userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(`/cart?email=${userEmail}`);
      return res.data;
    },
    enabled: !!userEmail,
  });

 
  const mutation = useMutation({
    mutationFn: async (newCart) => {
      return await axiosSecure.post("/cart", {
        userEmail,
        items: newCart,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", userEmail]);
    },
  });

  
  useEffect(() => {
    if (data?.items) {
      setCartItems(data.items);
    }
  }, [data]);

  const syncCart = (newItems) => {
    setCartItems(newItems);
    if (userEmail) {
      mutation.mutate(newItems);
    }
  };

const addToCart = (medicine) => {
  const id = medicine._id || medicine.id;
  const exists = cartItems.find((item) => item._id === id);

  const formattedItem = {
    _id: id,
    itemName: medicine.itemName,
    company: medicine.company,
    price: medicine.price,
    quantity: 1,
    image: medicine.image,
  };

  let newItems;
  if (exists) {
    newItems = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
  } else {
    newItems = [...cartItems, formattedItem];
  }

  syncCart(newItems);
};



  const increaseQty = (id) => {
    const newItems = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    syncCart(newItems);
  };

  const decreaseQty = (id) => {
    const newItems = cartItems.map((item) =>
      item._id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    syncCart(newItems);
  };

  const removeItem = (id) => {
    const newItems = cartItems.filter((item) => item._id !== id);
    syncCart(newItems);
  };

  const clearCart = () => {
    syncCart([]);
  };

  return (
    <CardContext.Provider
      value={{
        cartItems,
        isLoading,
        error,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

export const useCart = () => useContext(CardContext);
