import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Radio, Button, Flex, Typography, message, DatePicker, Switch, ColorPicker, Row, Col, Card } from 'antd';
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
        >
            <Row gutter={[16, 16]}>
                {/* Left Column: Member & Core Settings */}
                <Col span={14}>
                    <Flex vertical gap={12}>
                        <Card size="small" title={<Title level={5} style={{ margin: 0 }}>회원 정보</Title>} style={{ borderRadius: '12px' }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Flex vertical gap={4}>
                                        <Text style={{ color: '#64748B', fontSize: '12px' }}>이름</Text>
                                        <Text style={{ fontSize: '15px', fontWeight: 600 }}>{initialData?.memberName}</Text>
                                    </Flex>
                                </Col>
                                <Col span={12}>
                                    <Flex vertical gap={4}>
                                        <Text style={{ color: '#64748B', fontSize: '12px' }}>휴대폰번호</Text>
                                        <Text style={{ fontSize: '15px', fontWeight: 600 }}>{initialData?.mobile}</Text>
                                    </Flex>
                                </Col>
                            </Row>
                        </Card>

                        <Card size="small" title={<Title level={5} style={{ margin: 0 }}>수강권 설정</Title>} style={{ borderRadius: '12px' }}>
                            <Row gutter={12}>
                                <Col span={16}>
                                    <Form.Item
                                        label="수강권명"
                                        name="name"
                                        rules={[{ required: true, message: '수강권명을 입력해주세요' }]}
                                        style={{ marginBottom: 12 }}
                                    >
                                        <Input placeholder="수강권명을 입력해주세요" size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="색상"
                                        name="backgroundColor"
                                        rules={[{ required: true }]}
                                        style={{ marginBottom: 12 }}
                                    >
                                        <ColorPicker showText size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item label="수강권 종류" name="type" rules={[{ required: true }]} style={{ marginBottom: 0 }}>
                                <Radio.Group optionType="button" buttonStyle="solid">
                                    <Radio.Button value="COUNT">횟수권</Radio.Button>
                                    <Radio.Button value="PERIOD">기간권</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                        </Card>
                    </Flex>
                </Col>

                {/* Right Column: Policy & Status */}
                <Col span={10}>
                    <Flex vertical gap={12}>
                        <Card size="small" title={<Title level={5} style={{ margin: 0 }}>이용 정책 및 상태</Title>} style={{ borderRadius: '12px' }}>
                            <Form.Item
                                label="이용 기간"
                                required
                                style={{ marginBottom: 12 }}
                            >
                                <Flex vertical gap={4}>
                                    <Form.Item name="dateRange" rules={[{ required: true, message: '이용 기간을 선택해주세요' }]} noStyle>
                                        <DatePicker.RangePicker
                                            size="middle"
                                            style={{ width: '100%' }}
                                            format="YYYY-MM-DD"
                                        />
                                    </Form.Item>
                                    {durationDays > 0 && (
                                        <Text style={{ color: '#879B7E', fontWeight: 600, fontSize: '13px' }}>설정 기간: {durationDays}일</Text>
                                    )}
                                </Flex>
                            </Form.Item>

                            <Form.Item
                                label="잔여 이용 횟수"
                                required
                                style={{ marginBottom: 12 }}
                            >
                                <Flex vertical gap={4}>
                                    <Form.Item name="remainingCnt" rules={[{ required: true, message: '잔여 횟수를 입력해주세요' }]} noStyle>
                                        <Input type="number" size="middle" suffix="회" min={0} style={{ width: '120px' }} />
                                    </Form.Item>
                                    {initialData && (
                                        <Text style={{ color: '#64748B', fontSize: '12px' }}>
                                            전체 사용 가능: {initialData.totalUsableCnt}회
                                        </Text>
                                    )}
                                </Flex>
                            </Form.Item>

                            <Form.Item label="이용 제한" name="limitType" rules={[{ required: true }]} style={{ marginBottom: limitType !== 'NONE' ? 8 : 12 }}>
                                <Radio.Group size="small">
                                    <Radio value="WEEK">주간</Radio>
                                    <Radio value="MONTH">월간</Radio>
                                    <Radio value="NONE">무제한</Radio>
                                </Radio.Group>
                            </Form.Item>

                            {limitType !== 'NONE' && (
                                <Form.Item name="limitCnt" rules={[{ required: true, message: '이용 횟수를 입력해주세요' }]} style={{ marginBottom: 12 }}>
                                    <Input type="number" size="small" suffix="회 이용 가능" min={1} style={{ width: '140px' }} />
                                </Form.Item>
                            )}

                            {initialData && initialData.unpaidValue > 0 && (
                                <Flex align="center" style={{ backgroundColor: '#FFF1F0', padding: '10px 14px', borderRadius: '8px', border: '1px solid #FFA39E', marginBottom: 16 }}>
                                    <Text style={{ fontSize: '13px', color: '#CF1322', flex: 1 }}>미수금</Text>
                                    <Text style={{ fontSize: '15px', fontWeight: 700, color: '#CF1322' }}>
                                        {initialData.unpaidValue.toLocaleString()} 원
                                    </Text>
                                </Flex>
                            )}

                            <Form.Item label="사용 가능 여부" name="usageAvailable" valuePropName="checked" style={{ marginBottom: 0 }}>
                                <Switch checkedChildren="사용 가능" unCheckedChildren="사용 불가" />
                            </Form.Item>
                        </Card>
                    </Flex>
                </Col>
            </Row>

            <Flex justify="flex-end" gap={12} style={{ marginTop: '24px' }}>
                <Button size="large" onClick={() => navigate(-1)} style={{ width: '120px', borderRadius: '10px' }}>
                    취소
                </Button>
                <Button
                    type="primary"
                    size="large"
                    loading={loading}
                    htmlType="submit"
                    style={{ backgroundColor: '#879B7E', borderColor: '#879B7E', width: '120px', borderRadius: '10px', fontWeight: 600 }}
                >
                    수정하기
                </Button>
            </Flex>
        </Form>
    );
};

