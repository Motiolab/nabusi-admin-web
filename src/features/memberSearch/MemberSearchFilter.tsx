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
            <Flex vertical gap={24}>
                <Flex gap={48} wrap="wrap">
                    {/* Remaining Date & Count */}
                    <Flex vertical gap={16} style={{ flex: 1, minWidth: '320px' }}>
                        <Flex align="center" gap={12}>
                            <Text strong style={{ width: 100 }}>잔여 기간</Text>
                            <Space>
                                <InputNumber
                                    placeholder="최소"
                                    value={filters.remainingDateMin}
                                    onChange={(v) => onFilterChange({ ...filters, remainingDateMin: v ?? undefined })}
                                    style={{ width: 80 }}
                                />
                                <Text type="secondary">~</Text>
                                <InputNumber
                                    placeholder="최대"
                                    value={filters.remainingDateMax}
                                    onChange={(v) => onFilterChange({ ...filters, remainingDateMax: v ?? undefined })}
                                    style={{ width: 80 }}
                                />
                                <Text>일</Text>
                            </Space>
                        </Flex>

                        <Flex align="center" gap={12}>
                            <Text strong style={{ width: 100 }}>잔여 횟수</Text>
                            <Space>
                                <InputNumber
                                    placeholder="최소"
                                    value={filters.remainingCntMin}
                                    onChange={(v) => onFilterChange({ ...filters, remainingCntMin: v ?? undefined })}
                                    style={{ width: 80 }}
                                />
                                <Text type="secondary">~</Text>
                                <InputNumber
                                    placeholder="최대"
                                    value={filters.remainingCntMax}
                                    onChange={(v) => onFilterChange({ ...filters, remainingCntMax: v ?? undefined })}
                                    style={{ width: 80 }}
                                />
                                <Text>회</Text>
                            </Space>
                        </Flex>
                    </Flex>

                    {/* Search Text & Period */}
                    <Flex vertical gap={16} style={{ flex: 1, minWidth: '320px' }}>
                        <Flex align="center" gap={12}>
                            <Text strong style={{ width: 100 }}>검색어</Text>
                            <Input
                                placeholder="이름 또는 휴대폰 번호"
                                prefix={<SearchOutlined style={{ color: '#94A3B8' }} />}
                                value={filters.searchText}
                                onChange={(e) => onFilterChange({ ...filters, searchText: e.target.value })}
                                style={{ width: '100%', maxWidth: 300 }}
                            />
                        </Flex>

                        <Flex align="center" gap={12}>
                            <Text strong style={{ width: 100 }}>등록일</Text>
                            <RangePicker
                                value={filters.period}
                                onChange={(dates) => onFilterChange({ ...filters, period: dates ? [dates[0], dates[1]] : [null, null] })}
                                style={{ width: '100%', maxWidth: 300 }}
                            />
                        </Flex>
                    </Flex>
                </Flex>

                <Flex justify="flex-end" gap={12}>
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
                            padding: '0 24px'
                        }}
                    >
                        검색하기
                    </Button>
                </Flex>
            </Flex>
        </Card>
    );
};
