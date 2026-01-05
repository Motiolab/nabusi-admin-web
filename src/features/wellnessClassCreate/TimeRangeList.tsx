import { Button, DatePicker, Flex, Select } from 'antd';
import { Plus, Trash2 } from 'lucide-react';
import type { Dayjs } from 'dayjs';

export type IDayOfWeek = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '';

export interface TimeRange {
    dayOfWeek: IDayOfWeek;
    startTime: Dayjs | null;
    endTime: Dayjs | null;
}

interface TimeRangeListProps {
    timeRanges: TimeRange[];
    setTimeRanges: (ranges: TimeRange[]) => void;
    disabled?: boolean;
}

const dayOptions = [
    { label: '월요일', value: '1' },
    { label: '화요일', value: '2' },
    { label: '수요일', value: '3' },
    { label: '목요일', value: '4' },
    { label: '금요일', value: '5' },
    { label: '토요일', value: '6' },
    { label: '일요일', value: '7' },
];

export const TimeRangeList = ({ timeRanges, setTimeRanges, disabled }: TimeRangeListProps) => {
    const addTimeRange = () => {
        setTimeRanges([...timeRanges, { dayOfWeek: '', startTime: null, endTime: null }]);
    };

    const removeTimeRange = (index: number) => {
        if (timeRanges.length > 1) {
            setTimeRanges(timeRanges.filter((_, i) => i !== index));
        }
    };

    const updateTimeRange = (index: number, field: keyof TimeRange, value: any) => {
        const newRanges = [...timeRanges];
        newRanges[index] = { ...newRanges[index], [field]: value };
        setTimeRanges(newRanges);
    };

    return (
        <Flex vertical gap={12} style={{ width: '100%' }}>
            {timeRanges.map((range, index) => (
                <Flex key={index} gap={12} align="center">
                    <Select
                        placeholder="요일 선택"
                        value={range.dayOfWeek || undefined}
                        onChange={(value) => updateTimeRange(index, 'dayOfWeek', value)}
                        style={{ width: '120px' }}
                        options={dayOptions}
                        disabled={disabled}
                    />
                    <DatePicker.TimePicker
                        format="HH:mm"
                        placeholder="시작 시간"
                        value={range.startTime}
                        onChange={(time) => updateTimeRange(index, 'startTime', time)}
                        disabled={disabled}
                    />
                    <div style={{ color: '#94A3B8' }}>-</div>
                    <DatePicker.TimePicker
                        format="HH:mm"
                        placeholder="종료 시간"
                        value={range.endTime}
                        onChange={(time) => updateTimeRange(index, 'endTime', time)}
                        disabled={disabled}
                    />
                    {!disabled && (
                        <Button
                            type="text"
                            icon={<Trash2 size={16} style={{ color: '#E11D48' }} />}
                            onClick={() => removeTimeRange(index)}
                            disabled={timeRanges.length === 1}
                        />
                    )}
                </Flex>
            ))}
            {!disabled && (
                <Button
                    type="dashed"
                    icon={<Plus size={16} />}
                    onClick={addTimeRange}
                    style={{ width: '100%', height: '40px', color: '#879B7E', borderColor: '#879B7E' }}
                >
                    일정 추가
                </Button>
            )}
        </Flex>
    );
};
