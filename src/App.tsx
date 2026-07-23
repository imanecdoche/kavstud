import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import Lenis from 'lenis';
// Component Imports
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import StudentProfile from './components/StudentProfile';
import AssignmentDetail from './components/AssignmentDetail';
import SubmissionDetail from './components/SubmissionDetail';
import UserSettings from './components/UserSettings';
import CircleProfile from './components/CircleProfile';
import AssignmentBuilder from './components/AssignmentBuilder';
import KavioBlog from './components/KavioBlog';
import TermsAndConditions from './components/TermsAndConditions';
import FaqPage from './components/FaqPage';
import NotFound from './components/NotFound';
import Logo from './components/Logo';
import LogoutConfirmModal from './components/LogoutConfirmModal';
import { UserProfile } from './types';
import { Loader2 } from 'lucide-react';

export default function App() {
  // Simple & Robust state routing
  const [path, setPath] = useState(window.location.pathname);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [isMaintenanceActive, setIsMaintenanceActive] = useState(false);
  const [isGlobalLogoutOpen, setIsGlobalLogoutOpen] = useState(false);

  const triggerGlobalLogout = () => {
    setIsGlobalLogoutOpen(true);
  };

  const executeGlobalLogout = async () => {
    setIsGlobalLogoutOpen(false);
    setGlobalLoading(true);
    try {
      await auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setGlobalLoading(false);
    }
  };

  // Listen to maintenance mode config
  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, 'modules', 'system_config'), (docSnap) => {
      if (docSnap.exists()) {
        setIsMaintenanceActive(docSnap.data().maintenanceMode || false);
      }
    }, (err) => {
      console.warn("Could not listen to system config:", err);
    });
    return () => unsub();
  }, []);

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easing
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Synchronization with browser history API
  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (newPath: string) => {
    window.history.pushState({}, '', newPath);
    setPath(newPath);
    setGlobalLoading(false);
  };

  // Auth real-time listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthChecking(true);
      if (user) {
        setCurrentUser(user);
        try {
          if (!db) {
            console.error("Database 'db' is not initialized! Check firebase.ts");
            throw new Error("Firestore database instance is undefined.");
          }
          // Fetch profile document
          const docSnap = await getDoc(doc(db, 'users', user.uid));
          if (docSnap.exists()) {
            const profile = docSnap.data() as UserProfile;
            setUserProfile(profile);
            
            // Redirect based on role if on Login/Register pages
            const currentPath = window.location.pathname;
            if (currentPath === '/login' || currentPath === '/register') {
              if (profile.role === 'teacher') {
                navigate('/teacher');
              } else {
                navigate('/student');
              }
            }
          } else {
            console.warn('User profile document not found in Firestore.');
            setUserProfile(null);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        
        // Redirect anonymous users on protected pages
        const currentPath = window.location.pathname;
        if (currentPath !== '/' && currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/blog' && currentPath !== '/terms' && currentPath !== '/syarat-ketentuan' && currentPath !== '/faq') {
          navigate('/login');
        }
      }
      setIsAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // Parameter parsing logic for dynamic routes
  const isStudentProfilePath = path.startsWith('/student/') && path !== '/student';
  const studentIdParam = isStudentProfilePath ? path.split('/')[2] : '';

  const isCircleProfilePath = path.startsWith('/circle/') && path !== '/circle';
  const circleIdParam = isCircleProfilePath ? path.split('/')[2] : '';

  const isAssignmentDetailPath = path.startsWith('/assignment/');
  const assignmentIdParam = isAssignmentDetailPath ? path.split('/')[2] : '';

  const isSubmissionDetailPath = path.startsWith('/submission/');
  const submissionIdParam = isSubmissionDetailPath ? path.split('/')[2] : '';

  const isCreateAssignmentPath = path === '/teacher/assignments/create';

  const isEditAssignmentPath = path.startsWith('/teacher/assignments/') && path.endsWith('/edit');
  const editAssignmentIdParam = isEditAssignmentPath ? path.split('/')[3] : '';

  // Dynamic Document Title Update
  useEffect(() => {
    let title = 'KAVIO Edu';
    if (path === '/login') title = 'Masuk - KAVIO Edu';
    else if (path === '/register') title = 'Daftar - KAVIO Edu';
    else if (path === '/teacher') title = 'Dashboard Guru - KAVIO Edu';
    else if (path === '/student') title = 'Dashboard Siswa - KAVIO Edu';
    else if (path === '/settings') title = 'Pengaturan - KAVIO Edu';
    else if (path === '/blog') title = 'KAVIO Blog - Solusi Belajar Seru';
    else if (path === '/terms' || path === '/syarat-ketentuan') title = 'Syarat & Ketentuan - KAVIO Edu';
    else if (path === '/faq') title = 'FAQ & Pusat Bantuan - KAVIO Edu';
    else if (isStudentProfilePath) title = 'Profil Siswa - KAVIO Edu';
    else if (isCircleProfilePath) title = 'KAVIO Circle - KAVIO Edu';
    else if (isAssignmentDetailPath) title = 'Detail Tugas - KAVIO Edu';
    else if (isSubmissionDetailPath) title = 'Evaluasi - KAVIO Edu';
    else if (isCreateAssignmentPath || isEditAssignmentPath) title = 'Editor Tugas - KAVIO Edu';

    document.title = title;
  }, [
    path,
    isStudentProfilePath,
    isCircleProfilePath,
    isAssignmentDetailPath,
    isSubmissionDetailPath,
    isCreateAssignmentPath,
    isEditAssignmentPath
  ]);

  // Routing switch layout
  return (
    <div className="min-h-screen bg-white dark:bg-slate-800 text-gray-900 dark:text-white flex flex-col relative" id="app-root">
      {/* Global Loading Overlay */}
      {globalLoading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-3xs flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-gray-100 dark:border-slate-700/50 flex items-center gap-2 shadow-md">
            <Loader2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
            <span className="text-xs font-bold text-gray-700 dark:text-slate-200">Memproses...</span>
          </div>
        </div>
      )}

      {/* Main Switch Routing Layout */}
      <div className="flex-1">
        {path === '/' ? (
          <LandingPage onNavigate={navigate} userProfile={userProfile} />
        ) : path === '/login' ? (
          <Login onNavigate={navigate} onSetLoading={setGlobalLoading} />
        ) : path === '/register' ? (
          <Register onNavigate={navigate} onSetLoading={setGlobalLoading} />
        ) : path === '/teacher' ? (
          <TeacherDashboard onNavigate={navigate} onSetLoading={setGlobalLoading} />
        ) : path === '/student' ? (
          <StudentDashboard onNavigate={navigate} onSetLoading={setGlobalLoading} />
        ) : path === '/settings' ? (
          <UserSettings onNavigate={navigate} onSetLoading={setGlobalLoading} />
        ) : path === '/blog' ? (
          <KavioBlog onNavigate={navigate} userProfile={userProfile} onLogout={triggerGlobalLogout} />
        ) : path === '/terms' || path === '/syarat-ketentuan' ? (
          <TermsAndConditions onNavigate={navigate} userProfile={userProfile} />
        ) : path === '/faq' ? (
          <FaqPage onNavigate={navigate} userProfile={userProfile} />
        ) : isStudentProfilePath ? (
          <StudentProfile studentId={studentIdParam} onNavigate={navigate} onSetLoading={setGlobalLoading} />
        ) : isCircleProfilePath ? (
          <CircleProfile circleId={circleIdParam} onNavigate={navigate} onSetLoading={setGlobalLoading} />
        ) : isAssignmentDetailPath ? (
          <AssignmentDetail assignmentId={assignmentIdParam} onNavigate={navigate} onSetLoading={setGlobalLoading} />
        ) : isSubmissionDetailPath ? (
          <SubmissionDetail submissionId={submissionIdParam} onNavigate={navigate} onSetLoading={setGlobalLoading} />
        ) : isCreateAssignmentPath ? (
          <AssignmentBuilder onNavigate={navigate} onSetLoading={setGlobalLoading} />
        ) : isEditAssignmentPath ? (
          <AssignmentBuilder assignmentId={editAssignmentIdParam} onNavigate={navigate} onSetLoading={setGlobalLoading} />
        ) : (
          <NotFound onNavigate={navigate} />
        )}
      </div>

      {/* Global Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isGlobalLogoutOpen}
        onClose={() => setIsGlobalLogoutOpen(false)}
        onConfirm={executeGlobalLogout}
        isLoading={globalLoading}
      />
    </div>
  );
}
