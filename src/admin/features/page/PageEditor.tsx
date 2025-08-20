import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import Container from '../../../shared/components/container/Container';
import ColorPicker from '../../components/colorPicker/ColorPicker';
import { updatePageField } from './pageEditorSlice';
import Text from '../../../shared/components/text/Text';

const PageEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const localPage = useAppSelector((state) => state.pageEditor.localPageObjectFromDb);

    const handleColorChange = (colorClass: string) => {
        if (localPage) {
            dispatch(updatePageField({ field: 'pageBg', value: colorClass }));
        }
    };

    return (
        <Container TwClassName="flex-col bg-white text-black p-4 flex-2">
            {localPage && (
                <Container TwClassName='flex-col'>
                    <Text text={localPage.pageName + ' Page'} TwClassName='text-xl font-primary mb-4' />
                    <ColorPicker
                        label='Page Background'
                        prefix="bg-"
                        value={localPage.pageBg}
                        onChange={handleColorChange}
                    />
                </Container>
            )}
        </Container>
    );
};

export default PageEditor;
