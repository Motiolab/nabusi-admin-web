import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Flex, message } from 'antd';
import type { RootState } from '@/app/store';
import { getAllMemberListByCenterId } from '@/entities/member/api';
import type { IGetAllMemberListByCenterIdAdminResponseV1 } from '@/entities/member/api';
import { MemberSearchFilter } from '@/features/memberSearch/MemberSearchFilter';
import type { FilterValues } from '@/features/memberSearch/MemberSearchFilter';
import { MemberTableWidget } from '@/widgets/memberTable/MemberTableWidget';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const MemberView = () => {
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);
    const [memberList, setMemberList] = useState<IGetAllMemberListByCenterIdAdminResponseV1[]>([]);
    const [filteredList, setFilteredList] = useState<IGetAllMemberListByCenterIdAdminResponseV1[]>([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState<FilterValues>({
        remainingDateMin: undefined,
        remainingDateMax: undefined,
        remainingCntMin: undefined,
        remainingCntMax: undefined,
        searchText: '',
        period: [null, null],
    });

    useEffect(() => {
        if (selectedCenterId) {
            fetchMembers();
        }
    }, [selectedCenterId]);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const res = await getAllMemberListByCenterId(selectedCenterId);
            setMemberList(res.data);
            setFilteredList(res.data);
        } catch (error) {
            console.error('Failed to fetch members:', error);
            message.error('회원 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!memberList) return;

        let result = [...memberList];

        // Filter by remaining date
        if (filters.remainingDateMin !== undefined) {
            result = result.filter(m => m.wellnessTicketIssuanceList.some(t => t.remainingDate >= filters.remainingDateMin!));
        }
        if (filters.remainingDateMax !== undefined) {
            result = result.filter(m => m.wellnessTicketIssuanceList.some(t => t.remainingDate <= filters.remainingDateMax!));
        }

        // Filter by remaining count
        if (filters.remainingCntMin !== undefined) {
            result = result.filter(m => m.wellnessTicketIssuanceList.some(t => t.remainingCnt >= filters.remainingCntMin!));
        }
        if (filters.remainingCntMax !== undefined) {
            result = result.filter(m => m.wellnessTicketIssuanceList.some(t => t.remainingCnt <= filters.remainingCntMax!));
        }

        // Filter by text (name or mobile)
        if (filters.searchText) {
            const search = filters.searchText.toLowerCase();
            result = result.filter(m =>
                m.name.toLowerCase().includes(search) ||
                m.mobile.includes(search)
            );
        }

        // Filter by created date
        if (filters.period[0] && filters.period[1]) {
            const start = filters.period[0].startOf('day');
            const end = filters.period[1].endOf('day');
            result = result.filter(m => {
                const created = dayjs(m.createdDate);
                return created.isAfter(start) && created.isBefore(end);
            });
        }

        setFilteredList(result);
    };

    const handleReset = () => {
        const resetFilters: FilterValues = {
            remainingDateMin: undefined,
            remainingDateMax: undefined,
            remainingCntMin: undefined,
            remainingCntMax: undefined,
            searchText: '',
            period: [null, null],
        };
        setFilters(resetFilters);
        setFilteredList(memberList);
    };

    return (
        <div style={{ padding: '24px' }}>
            <Flex vertical gap={24}>
                <div>
                    <Title level={2} style={{ margin: 0, fontSize: '24px' }}>회원 관리</Title>
                    <Text type="secondary">센터의 모든 회원 목록을 관리하고 필터링할 수 있습니다.</Text>
                </div>

                <MemberSearchFilter
                    filters={filters}
                    onFilterChange={setFilters}
                    onSearch={handleSearch}
                    onReset={handleReset}
                />

                <MemberTableWidget
                    data={filteredList}
                    loading={loading}
                />
            </Flex>
        </div>
    );
};

export default MemberView;
