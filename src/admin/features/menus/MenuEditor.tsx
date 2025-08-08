import React from 'react';
import Container from '../../../shared/components/container/Container';
import { useAppSelector } from '../../../app/hooks';

const MenuEditor: React.FC = () => {
    const menuState = useAppSelector((state) => state.menus.menus)
    const editableMenus = menuState.filter((menu) => menu.menuEnv === 'client')

    return (
        <Container TwClassName='min-h-[calc(100vh-50px)] p-4 flex-col'>
            {editableMenus && editableMenus.map((menu) => (
                <Container TwClassName='flex-row'>
                    {menu.menuName}
                </Container>
            ))}
        </Container>
    );
};
export default MenuEditor;
