import { Flex, Input, Button } from 'antd';
import { Search, RotateCcw, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface WellnessTicketFilterValues {
    searchText: string;
}

interface WellnessTicketSearchFilterProps {
    filters: WellnessTicketFilterValues;
    onFilterChange: (filters: WellnessTicketFilterValues) => void;
    onSearch: () => void;
    onReset: () => void;
}

export const WellnessTicketSearchFilter = ({
    filters,
    onFilterChange,
    onSearch,
    onReset
}: WellnessTicketSearchFilterProps) => {
    const navigate = useNavigate();

    return (
        <Flex gap={16} align="center" justify="space-between" style={{ padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
            <Flex gap={16} align="center" style={{ flex: 1 }}>
                <Input
                    placeholder="수강권명 입력"
                    prefix={<Search size={18} style={{ color: '#94A3B8' }} />}
                    value={filters.searchText}
                    onChange={(e) => onFilterChange({ ...filters, searchText: e.target.value })}
                    onPressEnter={onSearch}
                    style={{ width: '300px', height: '44px', borderRadius: '8px' }}
                />
                <Button
                    type="primary"
                    onClick={onSearch}
                    style={{ height: '44px', borderRadius: '8px', backgroundColor: '#879B7E', borderColor: '#879B7E', padding: '0 24px' }}
                >
                    검색
                </Button>
                <Button
                    variant="outlined"
                    icon={<RotateCcw size={16} />}
                    onClick={onReset}
                    style={{ height: '44px', borderRadius: '8px', padding: '0 16px' }}
                >
                    초기화
                </Button>
            </Flex>
            <Button
                type="primary"
                icon={<Plus size={18} />}
                onClick={() => navigate('/wellness-ticket/create')}
                style={{ height: '44px', borderRadius: '8px', backgroundColor: '#879B7E', borderColor: '#879B7E' }}
            >
                수강권 추가
            </Button>
        </Flex>
    );
};
