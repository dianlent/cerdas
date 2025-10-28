import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StudentDashboard from './pages/StudentDashboard'
import ParentDashboard from './pages/ParentDashboard'
import GamePage from './pages/GamePage'
import LeaderboardPage from './pages/LeaderboardPage'
import LoadingSpinner from './components/LoadingSpinner'
import AdminDashboard from './pages/AdminDashboard'
import AdminSubjects from './pages/AdminSubjects'
import AdminQuestions from './pages/AdminQuestions'
import AboutPage from './pages/AboutPage'
import FeaturesPage from './pages/FeaturesPage'
import PricingPage from './pages/PricingPage'
import ContactPage from './pages/ContactPage'
import FaqPage from './pages/FaqPage'

function App() {
  const { user, loading, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route 
          path="/login" 
          element={!user ? <LoginPage /> : (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)} 
        />
        <Route 
          path="/register" 
          element={!user ? <RegisterPage /> : (user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />)} 
        />
        <Route 
          path="/dashboard" 
          element={
            user ? (
              user.role === 'student' ? (
                <StudentDashboard />
              ) : user.role === 'parent' ? (
                <ParentDashboard />
              ) : (
                <Navigate to="/admin" />
              )
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/admin" 
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/subjects" 
          element={user?.role === 'admin' ? <AdminSubjects /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin/questions" 
          element={user?.role === 'admin' ? <AdminQuestions /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/game/:subjectId" 
          element={user?.role === 'student' ? <GamePage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/leaderboard" 
          element={user?.role === 'student' ? <LeaderboardPage /> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
