
import React from 'react';
import Container from '../../../shared/components/container/Container';
import Button from '../../../shared/components/button/Button';
import Icon from '../../../shared/components/icon/Icon';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setActivePrefix, toggleHover, unsetActivePrefix } from './pageEditorSlice';

const PageEditorEnvironmentButtons: React.FC = () => {
    const dispatch = useAppDispatch();
    const pageEditor = useAppSelector((state) => state.pageEditor);

    return (
        <Container TwClassName="relative flex flex-row items-center mb-4">
            <Container TwClassName="absolute left-0 flex">
                <Button
                    TwClassName={`border-2 border-transparent hover:bg-transparent hover:border-amber-500 hover:text-amber-500 rounded pt-1 pb-1 pr-3 pl-3 ${
                        pageEditor.hover
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-300'
                    }`}
                    onClick={() => dispatch(toggleHover())}
                >
                    Hover
                </Button>
            </Container>

            <Container TwClassName="flex flex-row gap-4 mx-auto">
                <Button
                    TwClassName={`border-2 border-transparent hover:bg-transparent hover:border-amber-500 hover:text-amber-500 rounded pt-1 pb-1 pr-3 pl-3 ${
                        pageEditor.activePrefix === undefined
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-300'
                    }`}
                    onClick={() => {
                        dispatch(unsetActivePrefix());
                    }}
                >
                    <Icon name="Smartphone" color="text-gray-900" />
                </Button>

                <Button
                    TwClassName={`border-2 border-transparent hover:bg-transparent hover:border-amber-500 hover:text-amber-500 rounded pt-1 pb-1 pr-3 pl-3 ${
                        pageEditor.activePrefix === 'md'
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-300'
                    }`}
                    onClick={() => {
                        if (pageEditor.activePrefix !== 'md') {
                            dispatch(setActivePrefix('md'));
                        } else {
                            dispatch(unsetActivePrefix());
                        }
                    }}
                >
                    <Icon name="Tablet" color="text-gray-900" />
                </Button>

                <Button
                    TwClassName={`border-2 border-transparent hover:bg-transparent hover:border-amber-500 hover:text-amber-500 rounded pt-1 pb-1 pr-3 pl-3 ${
                        pageEditor.activePrefix === 'xl'
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-300'
                    }`}
                    onClick={() => {
                        if (pageEditor.activePrefix !== 'xl') {
                            dispatch(setActivePrefix('xl'));
                        } else {
                            dispatch(unsetActivePrefix());
                        }
                    }}
                >
                    <Icon name="Monitor" color="text-gray-900" />
                </Button>
            </Container>
        </Container>
    );
};

export default PageEditorEnvironmentButtons;