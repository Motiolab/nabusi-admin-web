import { Card, Input, DatePicker, Flex, Button, Space, Typography, InputNumber } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;

export interface FilterValues {
    remainingDateMin?: number;
    remainingDateMax?: number;
    remainingCntMin?: number;
    remainingCntMax?: number;
    searchText: string;
    period: [Dayjs | null, Dayjs | null];
}

interface MemberSearchFilterProps {
    filters: FilterValues;
    onFilterChange: (filters: FilterValues) => void;
    onSearch: () => void;
    onReset: () => void;
}

export const MemberSearchFilter = ({ filters, onFilterChange, onSearch, onReset }: MemberSearchFilterProps) => {
    return (
        <Card
            style={{
                marginBottom: 24,
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                border: 'none'
            }}
            bodyStyle={{ padding: '24px' }}
        >
            <Flex vertical gap={20}>
                <Flex gap={24} wrap="wrap">
                    {/* Remaining Date & Count */}
                    <Flex vertical gap={12} style={{ flex: 1, minWidth: '280px' }}>
                        <Flex align="center" gap={8}>
                            <Text strong style={{ width: 80 }}>잔여 기간</Text>
                            <Space size={4}>
                                <InputNumber
                                    placeholder="최소"
                                    value={filters.remainingDateMin}
                                    onChange={(v) => onFilterChange({ ...filters, remainingDateMin: v ?? undefined })}
                                    style={{ width: 70 }}
                                />
                                <Text type="secondary">~</Text>
                                <InputNumber
                                    placeholder="최대"
                                    value={filters.remainingDateMax}
                                    onChange={(v) => onFilterChange({ ...filters, remainingDateMax: v ?? undefined })}
                                    style={{ width: 70 }}
                                />
                                <Text style={{ fontSize: '13px' }}>일</Text>
                            </Space>
                        </Flex>

                        <Flex align="center" gap={8}>
                            <Text strong style={{ width: 80 }}>잔여 횟수</Text>
                            <Space size={4}>
                                <InputNumber
                                    placeholder="최소"
                                    value={filters.remainingCntMin}
                                    onChange={(v) => onFilterChange({ ...filters, remainingCntMin: v ?? undefined })}
                                    style={{ width: 70 }}
                                />
                                <Text type="secondary">~</Text>
                                <InputNumber
                                    placeholder="최대"
                                    value={filters.remainingCntMax}
                                    onChange={(v) => onFilterChange({ ...filters, remainingCntMax: v ?? undefined })}
                                    style={{ width: 70 }}
                                />
                                <Text style={{ fontSize: '13px' }}>회</Text>
                            </Space>
                        </Flex>
                    </Flex>

                    {/* Search Text & Period */}
                    <Flex vertical gap={12} style={{ flex: 1, minWidth: '280px' }}>
                        <Flex align="center" gap={8}>
                            <Text strong style={{ width: 80 }}>검색어</Text>
                            <Input
                                placeholder="이름 또는 휴대폰 번호"
                                prefix={<SearchOutlined style={{ color: '#94A3B8' }} />}
                                value={filters.searchText}
                                onChange={(e) => onFilterChange({ ...filters, searchText: e.target.value })}
                                style={{ width: '100%', maxWidth: 260 }}
                            />
                        </Flex>

                        <Flex align="center" gap={8}>
                            <Text strong style={{ width: 80 }}>등록일</Text>
                            <RangePicker
                                value={filters.period}
                                onChange={(dates) => onFilterChange({ ...filters, period: dates ? [dates[0], dates[1]] : [null, null] })}
                                style={{ width: '100%', maxWidth: 260 }}
                            />
                        </Flex>
                    </Flex>
                </Flex>

                <Flex justify="flex-end" gap={8}>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={onReset}
                        style={{ borderRadius: '8px' }}
                    >
                        초기화
                    </Button>
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={onSearch}
                        style={{
                            borderRadius: '8px',
                            backgroundColor: '#879B7E',
                            borderColor: '#879B7E',
                            padding: '0 20px',
                            fontWeight: 600
                        }}
                    >
                        검색하기
                    </Button>
                </Flex>
            </Flex>
        </Card>
    );
};
