import { createContext } from "react";

const UserContext = createContext<{
  user: User;
  setUser: (user: User) => void;
}>({
  user: {} as User,
  setUser: () => {},
});

export default UserContext;
