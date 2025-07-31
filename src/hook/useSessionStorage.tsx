import { useState, useEffect } from "react";

function useSessionStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    const storedValue = sessionStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

export default useSessionStorage;
/*
Document
  import useSessionStorage from "../../../../hook/useSessionStorage";

  Example of using useSessionStorage for user data
  Can import only data that is needed to use in the component to prevent unnecessary data from being imported

  const [user, setUser] = useSessionStorage<{
    customer_id: "";
    user_account_id: "";
  }>("user", {
    customer_id: "",
    user_account_id: "",
  });

  Example of using useSessionStorage for update user data
  
    setUser({
        customer_id: "123",
        user_account_id: "123",
    });
*/
