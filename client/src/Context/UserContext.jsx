import { createContext, useState } from "react";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {

    const [userDetails, setUserDetails] = useState({});
    const [email, setEmail] = useState('');
    
    console.log('context ' , userDetails);
    console.log('email' , email);
    
    
    return (
        <UserContext.Provider
            value={{
                userDetails,
                setUserDetails,
                email,
                setEmail
            }}
        >
        {children}
        </UserContext.Provider>
    );
};

export { UserContextProvider, UserContext };

// const {user, setUser } = useContext(UserContext);