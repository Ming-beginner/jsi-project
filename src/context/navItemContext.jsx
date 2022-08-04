import React, {useState, createContext, useContext} from 'react';

const navItemContext = createContext();

const useNavItemContext = () =>{
    return useContext(navItemContext);
}

const NavItemProvider = ({children}) => {
    const [activeNavItem, setActiveNavItem] = useState('home');
    return (
        <navItemContext.Provider value={{activeNavItem, setActiveNavItem}}>
            {children}
        </navItemContext.Provider>
    )
}

export {useNavItemContext, NavItemProvider} 