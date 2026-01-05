import { DatePicker, Input, Flex, Button } from 'antd';
import { Search, RotateCcw, Plus } from 'lucide-react';
import type { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';

export interface WellnessClassFilterValues {
    date: Dayjs | null;
    searchText: string;
}

interface WellnessClassSearchFilterProps {
    filters: WellnessClassFilterValues;
    onFilterChange: (filters: WellnessClassFilterValues) => void;
    onSearch: () => void;
    onReset: () => void;
}

export const WellnessClassSearchFilter = ({ filters, onFilterChange, onSearch, onReset }: WellnessClassSearchFilterProps) => {
    const navigate = useNavigate();

    return (
        <Flex vertical gap={16} style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
            <Flex gap={16} align="center" wrap="wrap">
                <Flex vertical gap={8} style={{ flex: '1 1 200px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>수업일</div>
                    <DatePicker
                        value={filters.date}
                        onChange={(date) => onFilterChange({ ...filters, date })}
                        style={{ width: '100%', height: '40px' }}
                        placeholder="수업일 선택"
                    />
                </Flex>
                <Flex vertical gap={8} style={{ flex: '2 1 300px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>검색</div>
                    <Input
                        placeholder="수업명 또는 강사명 검색"
                        value={filters.searchText}
                        onChange={(e) => onFilterChange({ ...filters, searchText: e.target.value })}
                        onPressEnter={onSearch}
                        prefix={<Search size={18} style={{ color: '#94A3B8' }} />}
                        style={{ height: '40px' }}
                    />
                </Flex>
            </Flex>

            <Flex justify="space-between" align="center" style={{ marginTop: '8px' }}>
                <Flex gap={8}>
                    <Button
                        type="primary"
                        icon={<Search size={16} />}
                        onClick={onSearch}
                        style={{ backgroundColor: '#879B7E', borderColor: '#879B7E', height: '40px', padding: '0 24px', borderRadius: '8px' }}
                    >
                        조회하기
                    </Button>
                    <Button
                        icon={<RotateCcw size={16} />}
                        onClick={onReset}
                        style={{ height: '40px', padding: '0 16px', borderRadius: '8px' }}
                    >
                        초기화
                    </Button>
                </Flex>
                <Button
                    type="primary"
                    icon={<Plus size={16} />}
                    onClick={() => navigate('/wellness-class/create')}
                    style={{ backgroundColor: '#879B7E', borderColor: '#879B7E', height: '40px', padding: '0 20px', borderRadius: '8px' }}
                >
                    수업 추가
                </Button>
            </Flex>
        </Flex>
    );
};
