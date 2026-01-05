import { Input, Button, Flex } from 'antd';
import { Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NoticeSearchFilterProps {
    searchText: string;
    onSearchChange: (value: string) => void;
}

export const NoticeSearchFilter = ({ searchText, onSearchChange }: NoticeSearchFilterProps) => {
    const navigate = useNavigate();

    return (
        <Flex justify="space-between" align="center" style={{ marginBottom: '24px' }}>
            <Input
                placeholder="제목으로 검색"
                prefix={<Search size={18} style={{ color: '#94A3B8', marginRight: '8px' }} />}
                style={{ width: '320px', height: '44px', borderRadius: '10px', fontSize: '14px' }}
                value={searchText}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <Button
                type="primary"
                icon={<Plus size={18} />}
                onClick={() => navigate('/notice/create')}
                style={{
                    height: '44px',
                    borderRadius: '10px',
                    padding: '0 20px',
                    backgroundColor: '#879B7E',
                    borderColor: '#879B7E',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                공지 작성
            </Button>
        </Flex>
    );
};
