import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Radio, Button, Flex, Typography, message, Divider, Select, Slider, ColorPicker } from 'antd';
import type { RootState } from '@/app/store';
import { useNavigate } from 'react-router-dom';
import { createWellnessTicket } from '@/entities/wellnessTicket/api';
import type { ICreateWellnessTicketAdminRequestV1 } from '@/entities/wellnessTicket/api';
import { getWellnessClassNameListByCenterId } from '@/entities/wellnessClass/api';
import type { IGetWellnessClassNameByCenterIdAdminResponseV1 } from '@/entities/wellnessClass/api';

const { Title, Text } = Typography;

export const WellnessTicketCreateForm = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);

    const [loading, setLoading] = useState(false);
    const [wellnessClasses, setWellnessClasses] = useState<any[]>([]);
    const [price, setPrice] = useState<number>(0);
    const [discountValue, setDiscountValue] = useState<number>(0);
    const [usableMonth, setUsableMonth] = useState<number>(1);
    const [isUsableDateManually, setIsUsableDateManually] = useState<boolean>(false);

    useEffect(() => {
        if (selectedCenterId) {
            fetchWellnessClasses();
        }
    }, [selectedCenterId]);

    const fetchWellnessClasses = async () => {
        try {
            const res = await getWellnessClassNameListByCenterId(selectedCenterId);
            setWellnessClasses(res.data.map((c: IGetWellnessClassNameByCenterIdAdminResponseV1) => ({ label: c.name, value: c.id })));
        } catch (error) {
            console.error('Failed to fetch wellness classes:', error);
        }
    };

    const calculateFinalPrice = (p: number, d: number): number => {
        if (!p || d < 0) return 0;
        return d === 0 ? p : Math.floor(p - (p * (d / 100)));
    };

    const onFinish = async (values: any) => {
        if (!selectedCenterId) return;

        setLoading(true);
        try {
            let finalUsableDate = values.usableDate;
            if (!isUsableDateManually) {
                finalUsableDate = values.usableMonth * 30;
            }

            const request: ICreateWellnessTicketAdminRequestV1 = {
                centerId: selectedCenterId,
                type: values.type,
                name: values.name.trim(),
                backgroundColor: typeof values.backgroundColor === 'string' ? values.backgroundColor : values.backgroundColor.toHexString(),
                textColor: '#FFFFFF', // Default white text for dark/colored backgrounds
                price: values.price,
                limitType: values.limitType,
                limitCnt: values.limitType === 'NONE' ? 0 : values.limitCnt,
                totalUsableCnt: values.type === 'COUNT' ? values.totalUsableCnt : 0,
                usableDate: finalUsableDate,
                discountValue: values.discountValue,
                salesPrice: calculateFinalPrice(values.price, values.discountValue),
                wellnessClassIdList: values.wellnessClassIdList || [],
            };

            await createWellnessTicket(request);
            message.success('수강권이 성공적으로 생성되었습니다.');
            navigate('/wellness-ticket');
        } catch (error) {
            console.error('Failed to create wellness ticket:', error);
            message.error('수강권 생성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const ticketType = Form.useWatch('type', form);
    const limitType = Form.useWatch('limitType', form);

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
                type: 'COUNT',
                limitType: 'NONE',
                backgroundColor: '#1E293B',
                price: 0,
                discountValue: 0,
                usableMonth: 1,
                usableDate: 30,
                totalUsableCnt: 1,
                limitCnt: 0
            }}
            style={{ maxWidth: '800px', margin: '0 auto' }}
        >
            <Flex vertical gap={32} style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                <section>
                    <Title level={4} style={{ marginBottom: '24px' }}>기본 정보</Title>
                    <Flex gap={24} wrap="wrap">
                        <Form.Item
                            label="수강권명"
                            name="name"
                            rules={[{ required: true, message: '수강권명을 입력해주세요' }]}
                            style={{ flex: '1 1 400px' }}
                        >
                            <Input placeholder="수강권명을 입력해주세요 (예: 10회 이용권)" size="large" />
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
                </section>

                <Divider style={{ margin: 0 }} />

                <section>
                    <Title level={4} style={{ marginBottom: '24px' }}>가격 설정</Title>
                    <Flex gap={24} wrap="wrap">
                        <Form.Item
                            label="판매가"
                            name="price"
                            rules={[{ required: true, message: '판매가를 입력해주세요' }]}
                            style={{ flex: '1 1 200px' }}
                        >
                            <Input
                                type="number"
                                size="large"
                                min={0}
                                suffix="원"
                                onChange={(e) => setPrice(Number(e.target.value) || 0)}
                            />
                        </Form.Item>
                        <Form.Item
                            label="할인율"
                            name="discountValue"
                            style={{ flex: '1 1 200px' }}
                        >
                            <Input
                                type="number"
                                size="large"
                                min={0}
                                max={100}
                                suffix="%"
                                onChange={(e) => setDiscountValue(Number(e.target.value) || 0)}
                            />
                        </Form.Item>
                    </Flex>
                    <Flex align="center" style={{ backgroundColor: '#F8FAFC', padding: '16px 24px', borderRadius: '12px' }}>
                        <Text style={{ fontSize: '16px', color: '#64748B', flex: 1 }}>최종 판매가</Text>
                        <Text style={{ fontSize: '24px', fontWeight: 700, color: '#1E293B' }}>
                            {calculateFinalPrice(price, discountValue).toLocaleString()} 원
                        </Text>
                    </Flex>
                </section>

                <Divider style={{ margin: 0 }} />

                <section>
                    <Title level={4} style={{ marginBottom: '24px' }}>이용 정책</Title>
                    <Flex vertical gap={24}>
                        <Form.Item label="유효기간" required>
                            <Flex vertical gap={12}>
                                {!isUsableDateManually && (
                                    <Text style={{ color: '#879B7E', fontWeight: 600 }}>
                                        {usableMonth}개월 ({usableMonth * 30}일)
                                    </Text>
                                )}
                                <Flex gap={16} align="center">
                                    <Form.Item name="usableMonth" noStyle>
                                        <Slider
                                            min={1}
                                            max={12}
                                            style={{ flex: 1 }}
                                            disabled={isUsableDateManually}
                                            onChange={(val) => setUsableMonth(val)}
                                        />
                                    </Form.Item>
                                    <Radio checked={isUsableDateManually} onClick={() => setIsUsableDateManually(!isUsableDateManually)}>직접 입력</Radio>
                                </Flex>
                                {isUsableDateManually && (
                                    <Form.Item name="usableDate" noStyle>
                                        <Input type="number" size="large" suffix="일" min={1} style={{ width: '160px' }} />
                                    </Form.Item>
                                )}
                            </Flex>
                        </Form.Item>

                        {ticketType === 'COUNT' && (
                            <Form.Item
                                label="이용 가능 횟수"
                                name="totalUsableCnt"
                                rules={[{ required: true, message: '횟수를 입력해주세요' }]}
                            >
                                <Input type="number" size="large" suffix="회" min={1} style={{ width: '160px' }} />
                            </Form.Item>
                        )}

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

                        <Form.Item
                            label="예약 가능한 그룹 수업"
                            name="wellnessClassIdList"
                            rules={[{ required: true, message: '최소 하나 이상의 수업을 선택해주세요' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="그룹 수업을 선택해주세요"
                                size="large"
                                options={wellnessClasses}
                                maxTagCount="responsive"
                            />
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
                        style={{ backgroundColor: '#879B7E', borderColor: '#879B7E', width: '120px', borderRadius: '8px' }}
                    >
                        추가하기
                    </Button>
                </Flex>
            </Flex>
        </Form>
    );
};
