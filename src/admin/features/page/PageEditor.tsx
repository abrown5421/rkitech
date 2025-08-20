import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import Container from '../../../shared/components/container/Container';
import ColorPicker from '../../components/colorPicker/ColorPicker';
import { setEnterExit, updatePageField } from './pageEditorSlice';
import Text from '../../../shared/components/text/Text';
import EntrancExitAnimationPicker from '../../components/entrancExitPicker/EntrancExitAnimationPicker';
import type { EntranceAnimation, ExitAnimation } from '../../components/entrancExitPicker/EntrancExitAnimationPickerTypes';

const PageEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const localPage = useAppSelector((state) => state.pageEditor.localPageObjectFromDb);

    return (
        <Container 
            animation={{
                entranceExit: {
                    entranceAnimation: 'animate__fadeIn',
                    exitAnimation: 'animate__fadeOut',
                    isEntering: true,
                },
            }} 
            TwClassName='flex-col bg-white text-black p-4 flex-3'
        >
            {localPage && (
                <Container TwClassName='flex-col'>
                    <Text text={localPage.pageName + ' Page'} TwClassName='text-xl font-primary mb-4' />
                    <ColorPicker
                        label='Page Background'
                        prefix="bg-"
                        value={localPage.pageBg}
                        onChange={(val) => dispatch(updatePageField({ field: 'pageBg', value: val }))}
                    />
                    <div className='my-2' />
                    <EntrancExitAnimationPicker
                        entranceValue={(localPage.pageEntranceAnimation as EntranceAnimation) || 'animate__fadeIn'}
                        exitValue={(localPage.pageExitAnimation as ExitAnimation) || 'animate__fadeOut'}
                        onEntranceChange={(val) => dispatch(updatePageField({ field: 'pageEntranceAnimation', value: val }))}
                        onExitChange={(val) => {
                            dispatch(updatePageField({ field: 'pageExitAnimation', value: val }))
                            dispatch(setEnterExit(false));
                            setTimeout(() => {
                                dispatch(setEnterExit(true));
                            }, 500)
                        }}
                    />
                </Container>
            )}
        </Container>
    );
};

export default PageEditor;
