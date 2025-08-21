import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import Container from '../../../shared/components/container/Container';
import ColorPicker from '../../components/colorPicker/ColorPicker';
import { setEnterExit, updatePageField } from './pageEditorSlice';
import Text from '../../../shared/components/text/Text';
import EntrancExitAnimationPicker from '../../components/entrancExitPicker/EntrancExitAnimationPicker';
import type { EntranceAnimation, ExitAnimation } from '../../components/entrancExitPicker/EntrancExitAnimationPickerTypes';
import TextEditor from '../textEditor/TextEditor';

const PageEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const pageEditor = useAppSelector((state) => state.pageEditor);
    
    return (
        <Container 
            animation={{
                entranceExit: {
                    entranceAnimation: 'animate__fadeIn',
                    exitAnimation: 'animate__fadeOut',
                    isEntering: true,
                },
            }} 
            TwClassName='flex-col bg-gray-50 text-gray-900 p-4 flex-3 overflow-scroll'
        >
            {pageEditor && (
                <Container TwClassName='flex-col mb-4'>
                    <Text text={pageEditor.localPageObjectFromDb?.pageName + ' Page'} TwClassName='text-xl font-primary mb-4' />
                    <ColorPicker
                        label='Page Background'
                        prefix="bg-"
                        value={pageEditor.localPageObjectFromDb?.pageBg}
                        onChange={(val) => dispatch(updatePageField({ field: 'pageBg', value: val }))}
                    />
                    <div className='my-2' />
                    <EntrancExitAnimationPicker
                        entranceValue={(pageEditor.localPageObjectFromDb?.pageEntranceAnimation as EntranceAnimation) || 'animate__fadeIn'}
                        exitValue={(pageEditor.localPageObjectFromDb?.pageExitAnimation as ExitAnimation) || 'animate__fadeOut'}
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
            
            {pageEditor.activeEditorUUID && (
                <Container TwClassName='flex-col'>
                    <Text text={'Editing ' + pageEditor.activeEditorComponent} TwClassName='text-xl font-primary mb-4' />
                    {pageEditor.activeEditorComponent === 'Text' && 
                        <TextEditor nodeUUID={pageEditor.activeEditorUUID} />
                    }
                    {pageEditor.activeEditorComponent === 'Container' && 
                        <>Container editor will go here</>
                    }
                    {pageEditor.activeEditorComponent === 'Button' && 
                        <>Button editor will go here</>
                    }
                    {pageEditor.activeEditorComponent === 'Image' && 
                        <>Image editor will go here</>
                    }
                    {pageEditor.activeEditorComponent === 'Icon' && 
                        <>Icon editor will go here</>
                    }
                    {pageEditor.activeEditorComponent === 'List' && 
                        <>List editor will go here</>
                    }
                    {pageEditor.activeEditorComponent === 'TrianglifyBanner' && 
                        <>TrianglifyBanner editor will go here</>
                    }
                </Container>
            )}
            
        </Container>
    );
};

export default PageEditor;
