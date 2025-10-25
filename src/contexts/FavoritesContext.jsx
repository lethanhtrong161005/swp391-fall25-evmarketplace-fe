import React, { createContext, useContext, useState } from "react";

const FavoritesContext = createContext();

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error(
      "useFavoritesContext must be used within FavoritesProvider"
    );
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <FavoritesContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </FavoritesContext.Provider>
  );
};
