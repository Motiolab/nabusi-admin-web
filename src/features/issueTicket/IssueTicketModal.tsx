import { useState, useEffect } from 'react';
import { Modal, Steps, message } from 'antd';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { getWellnessTicketList } from '@/entities/wellnessTicket/api';
import type { IGetWellnessTicketAdminResponseV1 } from '@/entities/wellnessTicket/api';
import { createWellnessTicketIssuance } from '@/entities/wellnessTicketIssuance/api';
import { SelectTicketStep } from './ui/SelectTicketStep';
import { ConfigureTicketStep } from './ui/ConfigureTicketStep';

interface IssueTicketModalProps {
    memberId: number;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const IssueTicketModal = ({ memberId, open, onClose, onSuccess }: IssueTicketModalProps) => {
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);

    const [currentStep, setCurrentStep] = useState(0);
    const [tickets, setTickets] = useState<IGetWellnessTicketAdminResponseV1[]>([]);
    const [submitLoading, setSubmitLoading] = useState(false);

    const [selectedTicket, setSelectedTicket] = useState<IGetWellnessTicketAdminResponseV1 | null>(null);
    const [discountValue, setDiscountValue] = useState(0);

    useEffect(() => {
        if (open && selectedCenterId) {
            fetchTickets();
            // Reset state when opening
            setCurrentStep(0);
            setSelectedTicket(null);
            setDiscountValue(0);
        }
    }, [open, selectedCenterId]);

    const fetchTickets = async () => {
        try {
            const res = await getWellnessTicketList(selectedCenterId);
            setTickets(res.data.filter(t => !t.isDelete));
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
            message.error('수강권 목록을 불러오는데 실패했습니다.');
        }
    };

    const handleNext = () => {
        if (!selectedTicket) return message.warning('수강권을 먼저 선택해주세요.');
        setCurrentStep(1);
    };

    const handleSubmit = async (config: any) => {
        if (!selectedTicket) return;

        setSubmitLoading(true);
        try {
            await createWellnessTicketIssuance({
                ...config,
                centerId: selectedCenterId,
                memberId,
                wellnessTicketId: selectedTicket.id,
                payerMemberId: memberId,
                paymentMethod: 'ON_SITE'
            });
            message.success('수강권이 성공적으로 발급되었습니다.');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to issue ticket:', error);
            message.error('수강권 발급에 실패했습니다.');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <Modal
            title="수강권 발급"
            open={open}
            onCancel={onClose}
            footer={null}
            width={1000}
            centered
            style={{ borderRadius: '20px', overflow: 'hidden' }}
            bodyStyle={{ padding: '24px 32px 32px 32px' }}
        >
            <Steps
                current={currentStep}
                items={[
                    { title: '수강권 선택' },
                    { title: '설정 및 결제' },
                ]}
                style={{ marginBottom: 32, padding: '0 48px' }}
            />

            {currentStep === 0 ? (
                <SelectTicketStep
                    tickets={tickets}
                    selectedTicketId={selectedTicket?.id}
                    discountValue={discountValue}
                    onSelect={(t) => {
                        setSelectedTicket(t);
                        setDiscountValue(t.discountValue);
                    }}
                    onDiscountChange={setDiscountValue}
                    onNext={handleNext}
                />
            ) : (
                selectedTicket && (
                    <ConfigureTicketStep
                        ticket={selectedTicket}
                        discountValue={discountValue}
                        onBack={() => setCurrentStep(0)}
                        onSubmit={handleSubmit}
                        loading={submitLoading}
                    />
                )
            )}
        </Modal>
    );
};
