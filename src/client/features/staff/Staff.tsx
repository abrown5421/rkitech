import React, { useEffect, useState } from 'react';
import Container from '../../../shared/components/container/Container';
import Pagination from '../../../shared/components/pagination/Pagination';
import Text from '../../../shared/components/text/Text';
import { useAppSelector } from '../../../app/hooks';
import { getDocumentById } from '../../../services/database/readData';
import type { StaffMemberPlusUser } from './staffTypes';
import TrianglifyBanner from '../../../shared/components/trianglifyBanner/TrianglifyBanner';

const Staff: React.FC = () => {
    const staff = useAppSelector((state) => state.staff.staff);
    const [staffWithData, setStaffWithData] = useState<StaffMemberPlusUser[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

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

                const activeStaff = combinedStaffData.filter(member => member.staffActive);

                setStaffWithData(activeStaff);
            } catch (err) {
                console.error("Error fetching staff info:", err);
            }
        };

        getStaffInfoFromUserTable();
    }, [staff]);

    const staffPerPage = 9;
    const totalPages = Math.ceil(staffWithData.length / staffPerPage);
    const sortedStaff = [...staffWithData].sort((a, b) => a.staffOrder - b.staffOrder);

    const paginatedStaff = sortedStaff.slice(
        currentPage * staffPerPage,
        currentPage * staffPerPage + staffPerPage
    );

    return (
        <Container TwClassName='min-h-[calc(100vh-50px)] p-4 flex-col'>
            <Text text="Our Staff" TwClassName='text-black font-primary text-4xl mb-5 w-full md:w-4/5 lg:w-2/3 mx-auto' />
            <Container TwClassName='flex-row h-full items-between flex-wrap w-full md:w-4/5 lg:w-2/3 mx-auto gap-4'>
                {paginatedStaff.map((staff) => (
                    <Container
                        key={staff.userId}
                        TwClassName="flex flex-col relative border border-gray-200 shadow rounded w-full lg:w-[calc(50%-0.5rem)] xl:w-[calc(33%-0.5rem)]"
                    >
                        <Container 
                            animation={{
                                entranceExit: {
                                entranceAnimation: 'animate__fadeIn animate__faster',
                                exitAnimation: 'animate__fadeOut animate__faster',
                                isEntering: hoveredCardId === staff.userId,
                                }
                            }}
                            hovered={hoveredCardId === staff.userId}
                            onHoverChange={(hover) => setHoveredCardId(hover ? staff.userId : null)}
                            TwClassName='flex-col absolute top-0 bottom-0 right-0 z-50 left-0 bg-gray-900/80 items-center p-4'
                            >
                            <Text text={staff.firstName + ' ' + staff.lastName} TwClassName='text-white text-xl font-primary mb-4' />
                            {staff.bio && <Text text={staff.bio} TwClassName='text-white' />}
                            </Container>
                        <TrianglifyBanner
                            xColors={staff.trianglifyObject?.xColors ?? ['#000000', '#FFFFFF']}
                            yColors={staff.trianglifyObject?.yColors ?? ['#000000', '#FFFFFF']}
                            width="w-full"
                            height={350}
                            variance={staff.trianglifyObject?.variance}
                            cellSize={staff.trianglifyObject?.cellSize}
                            auxImage={staff.profileImage}
                        />
                        <Container TwClassName="flex flex-col flex-grow p-4 justify-between">
                            <Container TwClassName="flex flex-col flex-grow">
                                <Text text={staff.firstName + ' ' + staff.lastName} TwClassName="text-xl font-primary text-black mb-4" />
                                <Text text={staff.staffTitle} />
                            </Container>
                        </Container>
                    </Container>
                ))}
            </Container>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                TwClassName="mt-8"
            />
        </Container>
    );
};
export default Staff;
