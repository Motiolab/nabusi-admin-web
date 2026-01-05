import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Flex, Typography, message } from 'antd';
import type { RootState } from '@/app/store';
import { getCenterNoticeListByCenterId } from '@/entities/notice/api';
import type { IGetCenterNoticeListByCenterIdAdminResponseV1 } from '@/entities/notice/api';
import { NoticeSearchFilter } from '@/features/noticeSearch/NoticeSearchFilter';
import { NoticeTableWidget } from '@/widgets/noticeTable/NoticeTableWidget';

const { Title, Text } = Typography;

const NoticeView = () => {
    const selectedCenterId = useSelector((state: RootState) => state.selectedCenterId);
    const [notices, setNotices] = useState<IGetCenterNoticeListByCenterIdAdminResponseV1[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        if (selectedCenterId) {
            fetchNotices();
        }
    }, [selectedCenterId]);

    const fetchNotices = async () => {
        setLoading(true);
        try {
            const res = await getCenterNoticeListByCenterId(selectedCenterId);
            setNotices(res.data);
        } catch (error) {
            console.error('Failed to fetch notices:', error);
            message.error('공지사항 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const filteredNotices = notices.filter(notice =>
        searchText === '' || notice.title.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <Flex vertical gap={24} style={{ padding: '32px', minHeight: '100%', backgroundColor: '#F8FAFC' }}>
            <Flex vertical>
                <Title level={2} style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#879B7E' }}>
                    공지사항
                </Title>
                <Text type="secondary" style={{ fontSize: '14px', color: '#64748B' }}>
                    센터의 공지사항을 관리하고 회원들에게 알림을 보냅니다.
                </Text>
            </Flex>

            <NoticeSearchFilter
                searchText={searchText}
                onSearchChange={setSearchText}
            />

            <NoticeTableWidget
                dataSource={filteredNotices}
                loading={loading}
            />
        </Flex>
    );
};

export default NoticeView;
