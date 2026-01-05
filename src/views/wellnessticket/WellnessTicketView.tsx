import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Flex, message } from 'antd';
import type { RootState } from '@/app/store';
import { getWellnessTicketList } from '@/entities/wellnessTicket/api';
import type { IGetWellnessTicketAdminResponseV1 } from '@/entities/wellnessTicket/api';
import { WellnessTicketSearchFilter } from '@/features/wellnessTicketSearch/WellnessTicketSearchFilter';
import type { WellnessTicketFilterValues } from '@/features/wellnessTicketSearch/WellnessTicketSearchFilter';
import { WellnessTicketTableWidget } from '@/widgets/wellnessTicketTable/WellnessTicketTableWidget';

const { Title, Text } = Typography;

const WellnessTicketView = () => {
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);
    const [tickets, setTickets] = useState<IGetWellnessTicketAdminResponseV1[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<IGetWellnessTicketAdminResponseV1[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<WellnessTicketFilterValues>({
        searchText: '',
    });

    const fetchTickets = async () => {
        if (!selectedCenterId) return;

        setLoading(true);
        try {
            const response = await getWellnessTicketList(selectedCenterId);
            setTickets(response.data);
            setFilteredTickets(response.data);
        } catch (error) {
            console.error('Failed to fetch wellness tickets:', error);
            message.error('수강권 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [selectedCenterId]);

    const handleSearch = () => {
        const filtered = tickets.filter(ticket =>
            ticket.name.toLowerCase().includes(filters.searchText.toLowerCase())
        );
        setFilteredTickets(filtered);
    };

    const handleReset = () => {
        const resetFilters = { searchText: '' };
        setFilters(resetFilters);
        setFilteredTickets(tickets);
    };

    return (
        <Flex vertical gap={24} style={{ padding: '32px', minHeight: '100%' }}>
            <Flex vertical gap={4}>
                <Title level={2} style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#879B7E' }}>
                    수강권 관리
                </Title>
                <Text type="secondary" style={{ fontSize: '14px', color: '#64748B' }}>
                    센터의 수강권을 조회하고 관리할 수 있습니다.
                </Text>
            </Flex>

            <WellnessTicketSearchFilter
                filters={filters}
                onFilterChange={setFilters}
                onSearch={handleSearch}
                onReset={handleReset}
            />

            <Flex vertical gap={12}>
                <Flex align="center" gap={8} style={{ paddingLeft: '4px' }}>
                    <Text style={{ fontWeight: 600, fontSize: '16px' }}>
                        수강권 목록
                    </Text>
                    <Text style={{ color: '#879B7E', fontWeight: 700 }}>
                        {filteredTickets.length}
                    </Text>
                </Flex>
                <WellnessTicketTableWidget data={filteredTickets} loading={loading} />
            </Flex>
        </Flex>
    );
};

export default WellnessTicketView;
