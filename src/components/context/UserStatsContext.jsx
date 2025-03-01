import { createContext, useContext } from "react";

const UserStatsContext = createContext();

export const UserStatsProvider = ({ stats, loading, error, children }) => (
  <UserStatsContext.Provider value={{ stats, loading, error }}>
    {children}
  </UserStatsContext.Provider>
);

export const useUserStats = () => {
  const context = useContext(UserStatsContext);
  if (!context) {
    throw new Error("useUserStats must be used within a UserStatsProvider");
  }
  return context;
};