import { useState, useEffect } from 'react';
import { getMenus } from '@services/menu.service.js';

const useGetMenus = () => {
    const [menus, setMenus] = useState([]);
    console.log('Estado menus:', menus);

    const fetchMenus = async () => {
        try {
            const data = await getMenus();
            console.log('Data retornada por getMenus:', data);
            setMenus(data);
            console.log('Estado menus despues de setMenus:', menus);
        } catch (error) {
            console.error('Error fetching menus:', error);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    return { menus, fetchMenus, setMenus };
}
export default useGetMenus;