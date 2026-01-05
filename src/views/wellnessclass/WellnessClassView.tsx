import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Flex, message, Tabs, Badge } from 'antd';
import type { RootState } from '@/app/store';
import dayjs from 'dayjs';
import { getWellnessLectureListByStartDate } from '@/entities/wellnessLecture/api';
import type { IGetWellnessLectureAdminResponseV1 } from '@/entities/wellnessLecture/api';
import { WellnessClassSearchFilter } from '@/features/wellnessClassSearch/WellnessClassSearchFilter';
import type { WellnessClassFilterValues } from '@/features/wellnessClassSearch/WellnessClassSearchFilter';
import { WellnessClassTableWidget } from '@/widgets/wellnessClassTable/WellnessClassTableWidget';

const { Title, Text } = Typography;

const WellnessClassView = () => {
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);
    const [classList, setClassList] = useState<IGetWellnessLectureAdminResponseV1[]>([]);
    const [filteredList, setFilteredList] = useState<IGetWellnessLectureAdminResponseV1[]>([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState<WellnessClassFilterValues>({
        date: dayjs(),
        searchText: '',
    });

    useEffect(() => {
        if (selectedCenterId && filters.date) {
            fetchClasses();
        }
    }, [selectedCenterId, filters.date]);

    const fetchClasses = async () => {
        if (!selectedCenterId || !filters.date) return;

        setLoading(true);
        try {
            const startDate = filters.date.startOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
            const res = await getWellnessLectureListByStartDate(selectedCenterId, startDate);
            setClassList(res.data);
            applySearch(res.data, filters.searchText);
        } catch (error) {
            console.error('Failed to fetch classes:', error);
            message.error('수업 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const applySearch = (data: IGetWellnessLectureAdminResponseV1[], searchText: string) => {
        if (!searchText) {
            setFilteredList(data);
            return;
        }

        const search = searchText.toLowerCase();
        const filtered = data.filter(item =>
            item.name.toLowerCase().includes(search) ||
            item.teacherName.toLowerCase().includes(search)
        );
        setFilteredList(filtered);
    };

    const handleSearch = () => {
        applySearch(classList, filters.searchText);
    };

    const handleReset = () => {
        const resetFilters: WellnessClassFilterValues = {
            date: dayjs(),
            searchText: '',
        };
        setFilters(resetFilters);
        // fetchClasses will be triggered by useEffect due to filters.date change
    };

    const tabItems = [
        {
            key: 'class',
            label: '수업',
            children: (
                <Flex vertical gap={24}>
                    <WellnessClassSearchFilter
                        filters={filters}
                        onFilterChange={setFilters}
                        onSearch={handleSearch}
                        onReset={handleReset}
                    />

                    <div style={{ position: 'relative' }}>
                        <Flex align="center" gap={8} style={{ marginBottom: '16px' }}>
                            <Text strong style={{ fontSize: '18px' }}>수업</Text>
                            <Badge count={filteredList.length} showZero color="#879B7E" style={{ backgroundColor: '#F0F4EF', color: '#879B7E', boxShadow: 'none', fontWeight: 600 }} />
                        </Flex>
                        <WellnessClassTableWidget
                            data={filteredList}
                            loading={loading}
                        />
                    </div>
                </Flex>
            ),
        },
        {
            key: 'group',
            label: '그룹 수업',
            children: (
                <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                    <Text type="secondary">그룹 수업 기능은 준비 중입니다.</Text>
                </div>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Flex vertical gap={24}>
                <div>
                    <Title level={2} style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#1E293B' }}>수업 관리</Title>
                    <Text type="secondary" style={{ fontSize: '14px' }}>센터의 수업 일정과 예약을 효율적으로 관리하세요.</Text>
                </div>

                <Tabs
                    defaultActiveKey="class"
                    items={tabItems}
                    style={{ marginTop: '8px' }}
                    className="custom-tabs"
                />
            </Flex>
        </div>
    );
};

export default WellnessClassView;
