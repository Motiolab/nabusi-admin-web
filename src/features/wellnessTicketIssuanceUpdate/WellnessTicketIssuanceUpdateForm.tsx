import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Radio, Button, Flex, Typography, message, Divider, DatePicker, Switch, ColorPicker } from 'antd';
import type { RootState } from '@/app/store';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { getWellnessTicketIssuanceUpdateDetailById, updateWellnessTicketIssuance } from '@/entities/wellnessTicketIssuance/api';
import type { IUpdateWellnessTicketIssuanceAdminRequestV1, IGetWellnessTicketIssuanceDetailByIdAdminResponseV1 } from '@/entities/wellnessTicketIssuance/api';

const { Title, Text } = Typography;

interface WellnessTicketIssuanceUpdateFormProps {
    id: string;
}

export const WellnessTicketIssuanceUpdateForm = ({ id }: WellnessTicketIssuanceUpdateFormProps) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);

    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState<IGetWellnessTicketIssuanceDetailByIdAdminResponseV1 | null>(null);

    useEffect(() => {
        if (selectedCenterId && id) {
            fetchInitialData();
        }
    }, [selectedCenterId, id]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const res = await getWellnessTicketIssuanceUpdateDetailById(selectedCenterId, Number(id));
            const data = res.data;
            setInitialData(data);

            form.setFieldsValue({
                ...data,
                name: data.ticketName,
                dateRange: [dayjs(data.startDate), dayjs(data.expireDate)],
                usageAvailable: !data.isDelete
            });
        } catch (error) {
            console.error('Failed to fetch issuance detail:', error);
            message.error('정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values: any) => {
        if (!selectedCenterId || !id) return;

        setLoading(true);
        try {
            const request: IUpdateWellnessTicketIssuanceAdminRequestV1 = {
                id: Number(id),
                centerId: selectedCenterId,
                name: values.name.trim(),
                backgroundColor: typeof values.backgroundColor === 'string' ? values.backgroundColor : values.backgroundColor.toHexString(),
                textColor: '#FFFFFF',
                type: values.type,
                startDate: values.dateRange[0].format('YYYY-MM-DDTHH:mm:00Z'),
                expireDate: values.dateRange[1].format('YYYY-MM-DDTHH:mm:00Z'),
                remainingCnt: values.remainingCnt,
                limitType: values.limitType,
                limitCnt: values.limitType === 'NONE' ? 0 : values.limitCnt,
                isDelete: !values.usageAvailable
            };

            await updateWellnessTicketIssuance(request);
            message.success('발급 수강권이 성공적으로 수정되었습니다.');
            navigate(-1);
        } catch (error) {
            console.error('Failed to update issuance:', error);
            message.error('수정 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const limitType = Form.useWatch('limitType', form);
    const dateRange = Form.useWatch('dateRange', form);

    const durationDays = dateRange && dateRange[0] && dateRange[1]
        ? dateRange[1].diff(dateRange[0], 'day')
        : 0;

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ maxWidth: '800px', margin: '0 auto' }}
        >
            <Flex vertical gap={32} style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                <section>
                    <Title level={4} style={{ marginBottom: '24px' }}>회원 정보</Title>
                    <Flex gap={24}>
                        <Flex vertical gap={4} style={{ flex: 1 }}>
                            <Text style={{ color: '#64748B', fontSize: '12px' }}>이름</Text>
                            <Text style={{ fontSize: '16px', fontWeight: 600 }}>{initialData?.memberName}</Text>
                        </Flex>
                        <Flex vertical gap={4} style={{ flex: 1 }}>
                            <Text style={{ color: '#64748B', fontSize: '12px' }}>휴대폰번호</Text>
                            <Text style={{ fontSize: '16px', fontWeight: 600 }}>{initialData?.mobile}</Text>
                        </Flex>
                    </Flex>
                </section>

                <Divider style={{ margin: 0 }} />

                <section>
                    <Title level={4} style={{ marginBottom: '24px' }}>수강권 설정</Title>
                    <Flex gap={24} wrap="wrap">
                        <Form.Item
                            label="수강권명"
                            name="name"
                            rules={[{ required: true, message: '수강권명을 입력해주세요' }]}
                            style={{ flex: '1 1 400px' }}
                        >
                            <Input placeholder="수강권명을 입력해주세요" size="large" />
                        </Form.Item>
                        <Form.Item
                            label="색상"
                            name="backgroundColor"
                            rules={[{ required: true }]}
                        >
                            <ColorPicker showText size="large" />
                        </Form.Item>
                    </Flex>

                    <Form.Item label="수강권 종류" name="type" rules={[{ required: true }]}>
                        <Radio.Group optionType="button" buttonStyle="solid">
                            <Radio.Button value="COUNT">횟수권</Radio.Button>
                            <Radio.Button value="PERIOD">기간권</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="이용 기간"
                        name="dateRange"
                        rules={[{ required: true, message: '이용 기간을 선택해주세요' }]}
                    >
                        <Flex align="center" gap={12}>
                            <DatePicker.RangePicker
                                size="large"
                                style={{ flex: 1 }}
                                format="YYYY-MM-DD"
                            />
                            {durationDays > 0 && (
                                <Text style={{ color: '#879B7E', fontWeight: 600 }}>({durationDays}일)</Text>
                            )}
                        </Flex>
                    </Form.Item>
                </section>

                <Divider style={{ margin: 0 }} />

                <section>
                    <Title level={4} style={{ marginBottom: '24px' }}>정책 및 상태</Title>
                    <Flex vertical gap={24}>
                        <Form.Item
                            label="잔여 이용 횟수"
                            name="remainingCnt"
                            rules={[{ required: true, message: '잔여 횟수를 입력해주세요' }]}
                        >
                            <Flex align="center" gap={12}>
                                <Input type="number" size="large" suffix="회" min={0} style={{ width: '160px' }} />
                                {initialData && (
                                    <Text style={{ color: '#64748B', fontSize: '13px' }}>
                                        총 사용 가능 횟수: {initialData.totalUsableCnt}회
                                    </Text>
                                )}
                            </Flex>
                        </Form.Item>

                        <Form.Item label="이용 제한" name="limitType" rules={[{ required: true }]}>
                            <Radio.Group>
                                <Radio value="WEEK">주간</Radio>
                                <Radio value="MONTH">월간</Radio>
                                <Radio value="NONE">이용 제한 없음</Radio>
                            </Radio.Group>
                        </Form.Item>

                        {limitType !== 'NONE' && (
                            <Form.Item name="limitCnt" rules={[{ required: true, message: '이용 횟수를 입력해주세요' }]}>
                                <Input type="number" size="large" suffix="회 이용 가능" min={1} style={{ width: '200px' }} />
                            </Form.Item>
                        )}

                        {initialData && initialData.unpaidValue > 0 && (
                            <Flex align="center" style={{ backgroundColor: '#FFF1F0', padding: '16px 24px', borderRadius: '12px', border: '1px solid #FFA39E' }}>
                                <Text style={{ fontSize: '16px', color: '#64748B', flex: 1 }}>미수금</Text>
                                <Text style={{ fontSize: '20px', fontWeight: 700, color: '#CF1322' }}>
                                    {initialData.unpaidValue.toLocaleString()} 원
                                </Text>
                            </Flex>
                        )}

                        <Form.Item label="사용 가능 여부" name="usageAvailable" valuePropName="checked">
                            <Switch checkedChildren="사용 가능" unCheckedChildren="사용 불가" />
                        </Form.Item>
                    </Flex>
                </section>

                <Flex justify="flex-end" gap={12} style={{ marginTop: '24px' }}>
                    <Button size="large" onClick={() => navigate(-1)} style={{ width: '120px', borderRadius: '8px' }}>
                        취소
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        htmlType="submit"
                        style={{ backgroundColor: '#1E293B', borderColor: '#1E293B', width: '120px', borderRadius: '8px' }}
                    >
                        수정하기
                    </Button>
                </Flex>
            </Flex>
        </Form>
    );
};
