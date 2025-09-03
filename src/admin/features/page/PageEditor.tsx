import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import Container from '../../../shared/components/container/Container';
import ColorPicker from '../../components/colorPicker/ColorPicker';
import { setActiveEditorUUID, setEnterExit, updatePageField } from './pageEditorSlice';
import Text from '../../../shared/components/text/Text';
import EntrancExitAnimationPicker from '../../components/entrancExitPicker/EntrancExitAnimationPicker';
import type { EntranceAnimation, ExitAnimation } from '../../components/entrancExitPicker/EntrancExitAnimationPickerTypes';
import TextEditor from '../textEditor/TextEditor';
import ContainerEditor from '../containerEditor/ContainerEditor';
import Button from '../../../shared/components/button/Button';
import { updateDataInCollection } from '../../../services/database/updateData';
import { setLoading, setNotLoading } from '../../../app/globalSlices/loading/loadingSlice';
import { openAlert } from '../../../shared/features/alert/alertSlice';
import Loader from '../../../shared/components/loader/Loader';

const PageEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const pageEditor = useAppSelector((state) => state.pageEditor);
    const { loading, id } = useAppSelector((state) => state.loading);
    const isSaving = loading && id === 'save-page-after-update';
    
    const handleUndo = async () => {
        if (!pageEditor.activeEditorUUID) return;
        
        dispatch(setActiveEditorUUID(pageEditor.activeEditorUUID));
    }

    const handleSave = async () => {
        if (!pageEditor.localPageObjectFromDb) return;
        
        dispatch(setLoading({ loading: true, id: 'save-page-after-update'}));
        
        try {
            await updateDataInCollection("Pages", pageEditor.localPageObjectFromDb?.pageID, { content: pageEditor.localPageObjectFromDb?.content });
            dispatch(openAlert({
                alertOpen: true,
                alertSeverity: 'success',
                alertMessage: `The changes were saved successfully!`,
                alertAnimation: {
                    entranceAnimation: 'animate__fadeInRight animate__faster',
                    exitAnimation: 'animate__fadeOutRight animate__faster',
                    isEntering: true,
                }
            }));
        } catch {
            dispatch(openAlert({
                alertOpen: true,
                alertSeverity: 'error',
                alertMessage: `There was a problem saving the changes.`,
                alertAnimation: {
                    entranceAnimation: 'animate__fadeInRight animate__faster',
                    exitAnimation: 'animate__fadeOutRight animate__faster',
                    isEntering: true,
                }
            }));
        } finally {
            dispatch(setNotLoading());
        } 
    }

    return (
        <Container 
            animation={{
                entranceExit: {
                    entranceAnimation: 'animate__fadeIn',
                    exitAnimation: 'animate__fadeOut',
                    isEntering: true,
                },
            }} 
            TwClassName='flex-col bg-gray-50 text-gray-900 flex-3'
        >
            <Container 
                TwClassName='flex-15 flex-col bg-gray-50 text-gray-900 p-4 flex-3 overflow-scroll'
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
                        <ContainerEditor nodeUUID={pageEditor.activeEditorUUID} />
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
            <Container 
                animation={{
                    entranceExit: {
                        entranceAnimation: 'animate__fadeIn',
                        exitAnimation: 'animate__fadeOut',
                        isEntering: pageEditor.hasUnsavedChanges,
                    },
                }}
                TwClassName='flex-row p-4 gap-4 shadow-[0_-2px_4px_rgba(0,0,0,0.15)]'
            >
                <Button
                    TwClassName={
                        "relative flex-1 pt-1 pr-3 pb-1 pl-3 bg-gray-300 rounded-xl text-grey-300 border border-gray-300 hover:bg-transparent hover:text-grey-300 flex justify-center items-center"
                    }
                    onClick={handleUndo}
                >     
                    Undo
                </Button>
                <Button
                    TwClassName={
                        "relative flex-1 pt-1 pr-3 pb-1 pl-3 bg-amber-500 rounded-xl text-gray-50 border border-amber-500 hover:bg-transparent hover:text-amber-500 flex justify-center items-center"
                    }
                    onClick={handleSave}
                >     
                    {isSaving ? <Loader variant='spinner' color='amber-500' /> : <>Save</>}
                </Button>
            </Container>
        </Container>
    );
};

export default PageEditor;
