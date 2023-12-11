import { createContext } from "react";

const UserData = createContext({
  userData: null,
  setUserData: () => {},
});

export default UserData;
