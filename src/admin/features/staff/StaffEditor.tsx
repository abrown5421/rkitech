import React, { useEffect, useState } from 'react';
import Container from '../../../shared/components/container/Container';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import type { StaffMemberPlusUser } from '../../../client/features/staff/staffTypes';
import { getDocumentById } from '../../../services/database/readData';
import { useGenericEditor } from '../../hooks/useGenericEditor';
import GenericEditor, { type EditorField } from '../../components/genericEditor/GenericEditor';
import Input from '../../../shared/components/input/Input';
import Select from '../../../shared/components/select/Select';
import { updateDataInCollection } from '../../../services/database/updateData';
import { openModal } from '../../../shared/features/modal/modalSlice';
import { openAlert } from '../../../shared/features/alert/alertSlice';
import { insertDataIntoCollection } from '../../../services/database/createData';

const StaffEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const staff = useAppSelector((state) => state.staff.staff);
    const modalAction = useAppSelector((state) => state.modal.modalActionFire);
    const modalProps = useAppSelector(state => state.modal.modalProps);
    const RecordIdToUpdate = modalProps?.RecordIdToUpdate || '';
    const [staffWithData, setStaffWithData] = useState<StaffMemberPlusUser[]>([]);
    
    useEffect(() => {
        const getStaffInfoFromUserTable = async () => {
            if (!staff || staff.length === 0) {
                setStaffWithData([]);
                return;
            }

            try {
                const combinedStaffData: StaffMemberPlusUser[] = await Promise.all(
                    staff.map(async (staffMember) => {
                        const userData = await getDocumentById('Users', staffMember.staffUserId);
                        return {
                        ...staffMember,
                        ...userData,
                        staffDocumentId: staffMember.staffPersonID, 
                        userId: staffMember.staffUserId, 
                        };
                    })
                );

                setStaffWithData(combinedStaffData); 
            } catch (err) {
                console.error("Error fetching staff info:", err);
            }
        };

        getStaffInfoFromUserTable();
    }, [staff]);

    useEffect(()=>{
        const runTrianglifyAction = async () => {
            if (modalAction.modalActionId === 'trianglifySave') {
            const trianglifyData = modalAction.trianglifyData; 
            
            if (typeof trianglifyData === 'string') {
                await updateDataInCollection("Users", RecordIdToUpdate, {
                    profileImage: trianglifyData,
                });
            } else {
                await updateDataInCollection("Users", RecordIdToUpdate, {
                    trianglifyObject: trianglifyData,
                    profileImage: '',
                });
            }
            
    
            dispatch(openAlert({
                alertOpen: true,
                alertSeverity: 'success',
                alertMessage: 'Profile banner was uploaded successfully!',
                alertAnimation: {
                entranceAnimation: 'animate__fadeInRight animate__faster',
                exitAnimation: 'animate__fadeOutRight animate__faster',
                isEntering: true,
                }
            }));
    
            } else if (modalAction.modalActionId === 'trianglifyCancel') {
                console.log('User canceled trianglify modal');
            }
        };

        const runNewStaffPost = async () => {
            if (modalAction.modalActionId === 'newStaffPost') {
                const formData = modalAction.formData;

                const newStaffPost = {
                    staffActive: false,
                    staffOrder: formData?.staffOrder,
                    staffTitle: formData?.staffTitle,
                    staffUserId: formData?.staffUserId, 
                }

                await insertDataIntoCollection('Staff', newStaffPost)

                dispatch(openAlert({
                        alertOpen: true,
                        alertSeverity: 'success',
                        alertMessage: 'New staff member post was saved successfully!',
                        alertAnimation: {
                        entranceAnimation: 'animate__fadeInRight animate__faster',
                        exitAnimation: 'animate__fadeOutRight animate__faster',
                        isEntering: true,
                    }
                }));
            } else if (modalAction.modalActionId === 'newStaffPostCancel') {
                console.log('User canceled staff member post creation');
            }
        
        };

        runNewStaffPost();
        runTrianglifyAction();
    }, [modalAction]);

    const editorConfig = {
        collectionName: 'Staff',
        // Use the Staff document ID, not the user ID
        itemIdField: 'staffDocumentId' as keyof StaffMemberPlusUser,
        sortField: 'staffOrder' as keyof StaffMemberPlusUser,
        trackingFields: ['firstName', 'lastName', 'profileImage', 'userRole', 'bio', 'staffTitle', 'staffOrder', 'staffActive' ] as (keyof StaffMemberPlusUser)[],
        postsPerPage: 10,
        deleteConfirmationTitle: 'Delete Staff Member?',
        deleteConfirmationMessage: (item: StaffMemberPlusUser) => 
            `Are you sure you want to delete staff member "${item.firstName} ${item.lastName}" (${item.staffTitle})? This will permanently remove them from the staff directory and cannot be undone.`,
    };

    const {
        paginatedItems,
        currentPage,
        totalPages,
        hasChanges,
        isLoading,
        updateItemField,
        handleToggleActive,
        handleSave,
        handleDelete,
        resetChanges,
        setCurrentPage,
    } = useGenericEditor(staffWithData, editorConfig);

    const openTrianglifyModal = (staffMember: StaffMemberPlusUser) => {
        dispatch(openModal({
                title: 'Customize Banner',
                modalType: 'trianglify',
                modalMessage: '',
                modalProps: {
                yColors: staffMember.trianglifyObject?.yColors,
                xColors: staffMember.trianglifyObject?.xColors,
                cellSize: staffMember.trianglifyObject?.cellSize,
                variance: staffMember.trianglifyObject?.variance,
                width: staffMember.trianglifyObject?.width,
                height: staffMember.trianglifyObject?.height,
                auxImage: staffMember.profileImage,
                existingImage: staffMember.profileImage,
                RecordIdToUpdate: staffMember.userId,
                uploadDir: 'profileImages'
            }
        }));
    };
        const fields: EditorField[] = [
        {
            key: 'imageName',
            label: 'Post Name',
            type: 'text',
            render: (item, updateField) => (
                <Container TwClassName='flex-col'>
                    <Container TwClassName="rounded-md flex-row gap-4 items-center">
                        <Input
                            TwClassName="flex-grow"
                            label="First Name"
                            value={item.firstName}
                            onChange={(e) => updateField('firstName', e.target.value)}
                        />
                        <Input
                            TwClassName="flex-grow"
                            label="Last Name"
                            value={item.lastName}
                            onChange={(e) => updateField('lastName', e.target.value)}
                        />
                        <Select
                            TwClassName="flex-grow"
                            label="User Permissions"
                            value={item.userRole}
                            onChange={(e) => updateField('userRole', e.target.value)}
                        >
                            <option value='Writer'>Writer</option>
                            <option value='Editor'>Editor</option>
                            <option value='Developer'>Developer</option>
                        </Select>
                    </Container>
                    <Container TwClassName="rounded-md flex-row gap-4 mt-4 items-center">
                        <Input
                            TwClassName="flex-grow"
                            label="Official Title"
                            value={item.staffTitle}
                            onChange={(e) => updateField('staffTitle', e.target.value)}
                        />
                        <Input
                            TwClassName="flex-grow"
                            label="Order"
                            value={item.staffOrder}
                            onChange={(e) => updateField('staffOrder', e.target.value)}
                            type='number'
                            step={1}
                        />
                        <Input
                            TwClassName="flex-grow"
                            label="Profile Image"
                            value={item.profileImage}
                            onClick={() => openTrianglifyModal(item)}
                            onChange={(e) => updateField('profileImage', e.target.value)}
                        />
                    </Container>
                    <Container TwClassName="rounded-md flex-row gap-4 mt-4 items-center">
                        <Input
                            TwClassName="flex-grow"
                            label="Bio"
                            value={item.bio}
                            onChange={(e) => updateField('bio', e.target.value)}
                        />
                    </Container>
                </Container>
            )
        }
    ];

    const getChangedFields = (
        local: StaffMemberPlusUser,
        original: StaffMemberPlusUser
    ): Partial<StaffMemberPlusUser> => {
        const changes: Partial<StaffMemberPlusUser> = {};

        if (local.staffTitle !== original.staffTitle) changes.staffTitle = local.staffTitle;
        if (local.staffOrder !== original.staffOrder) changes.staffOrder = local.staffOrder;
        if (local.staffActive !== original.staffActive) changes.staffActive = local.staffActive;

        if (local.firstName !== original.firstName) changes.firstName = local.firstName;
        if (local.lastName !== original.lastName) changes.lastName = local.lastName;
        if (local.profileImage !== original.profileImage) changes.profileImage = local.profileImage;
        if (local.userRole !== original.userRole) changes.userRole = local.userRole;
        if (local.bio !== original.bio) changes.bio = local.bio;

        return changes;
    };

    const saveStaffAndUsers = async (locals: StaffMemberPlusUser[], originals: StaffMemberPlusUser[]) => {
        const changesByCollection = locals.map((local, i) => {
            const original = originals[i];
            const staffChanges: Partial<StaffMemberPlusUser> = {};
            const userChanges: Partial<StaffMemberPlusUser> = {};

            if (local.staffTitle !== original.staffTitle) staffChanges.staffTitle = local.staffTitle;
            if (local.staffOrder !== original.staffOrder) staffChanges.staffOrder = local.staffOrder;
            if (local.staffActive !== original.staffActive) staffChanges.staffActive = local.staffActive;

            if (local.firstName !== original.firstName) userChanges.firstName = local.firstName;
            if (local.lastName !== original.lastName) userChanges.lastName = local.lastName;
            if (local.userRole !== original.userRole) userChanges.userRole = local.userRole;
            if (local.bio !== original.bio) userChanges.bio = local.bio;
            if (local.profileImage !== original.profileImage) userChanges.profileImage = local.profileImage;

            return { 
                staffDocumentId: local.staffDocumentId, 
                userId: local.userId, 
                staffChanges, 
                userChanges 
            };
        });

        await Promise.all(changesByCollection.map(async ({ staffDocumentId, userId, staffChanges, userChanges }) => {
            if (Object.keys(staffChanges).length > 0) {
                await updateDataInCollection('Staff', staffDocumentId, staffChanges);
            }
            if (Object.keys(userChanges).length > 0) {
                await updateDataInCollection('Users', userId, userChanges);
            }
        }));
    };

    const newStaffPostConfig = [
        { type: 'input', name: 'Staff Member Title', nameId: 'staffTitle', required: true, placeholder: 'Enter staff title...' },
        { type: 'input', name: 'Staff Member Order', nameId: 'staffOrder', required: true, placeholder: 'Enter staff order...', inputType: 'number', step: 1 },
        { type: 'usersearch', name: 'Search For A User', nameId: 'staffUserId', required: true, placeholder: 'Search for a user account...' },
    ];
    
    return (
        <GenericEditor
            title="Edit Staff Members"
            items={paginatedItems}
            fields={fields}
            addButtonText="Add Post"
            addButtonModal={{
                title: 'Create New Staff Member',
                modalType: 'dynamicForm',
                modalProps: {
                    config: newStaffPostConfig,
                    actionId: 'newStaffPost'
                }
            }}
            currentPage={currentPage}
            totalPages={totalPages}
            hasChanges={hasChanges}
            isLoading={isLoading}
            onPageChange={setCurrentPage}
            onFieldUpdate={updateItemField}
            onSave={() => handleSave(getChangedFields, saveStaffAndUsers)}
            onReset={resetChanges}
            onToggleActive={handleToggleActive}
            onDelete={handleDelete}
            getItemId={(item) => item.staffDocumentId}
            getItemActiveStatus={(item) => item.staffActive}
        />
    );
};
export default StaffEditor;