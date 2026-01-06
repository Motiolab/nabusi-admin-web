import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Sidebar } from '@/widgets/sidebar/Sidebar'
import { Menu, X } from 'lucide-react'
import LoginView from '@/views/login/LoginView'
import SignupView from '@/views/login/SignupView'
import LoginSuccessView from '@/views/login/LoginSuccessView'
import PrivacyPolicyView from '@/views/legal/PrivacyPolicyView'
import { Footer } from '@/widgets/footer/Footer'
import CenterSelectView from '@/views/centerselect/CenterSelectView'
import HomeView from '@/views/home/HomeView'
import MemberView from '@/views/member/MemberView'
import MemberDetailView from '@/views/member/MemberDetailView'
import TeacherView from '@/views/teacher/TeacherView'
import TeacherDetailView from '@/views/teacher/TeacherDetailView'
import WellnessClassView from '@/views/wellnessclass/WellnessClassView'
import WellnessLectureDetailView from '@/views/wellnessclass/WellnessLectureDetailView'
import WellnessLectureUpdateView from '@/views/wellnessclass/WellnessLectureUpdateView'
import WellnessClassCreateView from '@/views/wellnessclass/WellnessClassCreateView'
import WellnessClassDetailView from '@/views/wellnessclass/WellnessClassDetailView'
import WellnessTicketView from '@/views/wellnessticket/WellnessTicketView'
import WellnessTicketCreateView from '@/views/wellnessticket/WellnessTicketCreateView'
import WellnessTicketDetailView from '@/views/wellnessticket/WellnessTicketDetailView'
import WellnessTicketUpdateView from '@/views/wellnessticket/WellnessTicketUpdateView'
import WellnessTicketIssuanceUpdateView from '@/views/wellnessticket-issuance/WellnessTicketIssuanceUpdateView'
import NoticeView from '@/views/notice/NoticeView'
import NoticeCreateView from '@/views/notice/NoticeCreateView'
import NoticeUpdateView from '@/views/notice/NoticeUpdateView'
import OperationPolicyView from '@/views/setting/OperationPolicyView'
import AuthManagementView from '@/views/setting/AuthManagementView'
import ProfileView from '@/views/profile/ProfileView'
import { CenterGuard } from '@/shared/ui/CenterGuard'
import { Header } from '@/widgets/header/Header'
import './App.css'

function App() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()

  const isLoginPage = location.pathname === '/login' ||
    location.pathname === '/login/success' ||
    location.pathname === '/signup' ||
    location.pathname === '/privacy-policy' ||
    location.pathname === '/centerselect'

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen)

  const routesContent = (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/signup" element={<SignupView />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyView />} />
      <Route path="/login/success" element={<LoginSuccessView />} />
      <Route path="/centerselect" element={<CenterSelectView />} />
      <Route path="/" element={<HomeView />} />
      <Route path="/member" element={<MemberView />} />
      <Route path="/member/detail/:id" element={<MemberDetailView />} />
      <Route path="/teacher" element={<TeacherView />} />
      <Route path="/teacher/detail/:id" element={<TeacherDetailView />} />
      <Route path="/wellness-lecture" element={<WellnessClassView />} />
      <Route path="/wellness-lecture/detail/:id" element={<WellnessLectureDetailView />} />
      <Route path="/wellness-lecture/update/:id" element={<WellnessLectureUpdateView />} />
      <Route path="/wellness-class/create" element={<WellnessClassCreateView />} />
      <Route path="/wellness-class/detail/:id" element={<WellnessClassDetailView />} />
      <Route path="/wellness-ticket" element={<WellnessTicketView />} />
      <Route path="/wellness-ticket/create" element={<WellnessTicketCreateView />} />
      <Route path="/wellness-ticket/:id" element={<WellnessTicketDetailView />} />
      <Route path="/wellness-ticket/update/:id" element={<WellnessTicketUpdateView />} />
      <Route path="/wellness-ticket-issuance/update/:id" element={<WellnessTicketIssuanceUpdateView />} />
      <Route path="/notice" element={<NoticeView />} />
      <Route path="/notice/create" element={<NoticeCreateView />} />
      <Route path="/notice/update/:id" element={<NoticeUpdateView />} />
      <Route path="/setting/policy" element={<OperationPolicyView />} />
      <Route path="/setting/authmanagement" element={<AuthManagementView />} />
      <Route path="/profile" element={<ProfileView />} />
      <Route path="*" element={<div style={{ padding: '24px' }}>404 Not Found</div>} />
    </Routes>
  );

  return (
    <div className="layoutRoot">
      <div className="layoutBody">
        {isLoginPage ? (
          <main className="loginContainer">
            {routesContent}
            <Footer />
          </main>
        ) : (
          <CenterGuard>
            <Sidebar
              isMobileOpen={isMobileOpen}
            />
            <button className="mobileMenuButton" onClick={toggleMobileMenu}>
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <main className="contentArea">
              <Header />
              <div className="viewScrollContainer">
                {routesContent}
              </div>
            </main>
          </CenterGuard>
        )}
      </div>
    </div>
  )
}

export default App
