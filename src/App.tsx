import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

// Component Imports
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
import NotFound from './components/NotFound';
import Logo from './components/Logo';
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
            
            // Redirect based on role if on Auth pages or home page
            const currentPath = window.location.pathname;
            if (currentPath === '/' || currentPath === '/login' || currentPath === '/register') {
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
        
        // Redirect anonymous users on dashboard pages
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          navigate('/login');
        }
      }
      setIsAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // Parameter parsing logic for dynamic routes
  // Matches: /student/:id
  const isStudentProfilePath = path.startsWith('/student/') && path !== '/student';
  const studentIdParam = isStudentProfilePath ? path.split('/')[2] : '';

  // Matches: /circle/:id
  const isCircleProfilePath = path.startsWith('/circle/') && path !== '/circle';
  const circleIdParam = isCircleProfilePath ? path.split('/')[2] : '';

  // Matches: /assignment/:id
  const isAssignmentDetailPath = path.startsWith('/assignment/');
  const assignmentIdParam = isAssignmentDetailPath ? path.split('/')[2] : '';

  // Matches: /submission/:id
  const isSubmissionDetailPath = path.startsWith('/submission/');
  const submissionIdParam = isSubmissionDetailPath ? path.split('/')[2] : '';

  // Matches: /teacher/assignments/create
  const isCreateAssignmentPath = path === '/teacher/assignments/create';

  // Matches: /teacher/assignments/:id/edit
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

  // Show a beautiful full-screen loader during initial auth check
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center items-center space-y-4">
        <div className="text-center space-y-3">
          <Logo className="h-10 w-auto text-indigo-600 dark:text-indigo-400 animate-pulse mx-auto" />
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Mengautentikasi Sistem...</p>
        </div>
      </div>
    );
  }

  // Show Maintenance screen for students if active
  if (isMaintenanceActive && userProfile && userProfile.role === 'student' && userProfile.email !== 'fatih@kavio.tec.edu') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center items-center p-6 space-y-6 text-center select-none" id="maintenance-mode-page">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-100 dark:border-indigo-800/50 rounded-3xl shrink-0">
          <Logo className="h-12 w-auto text-indigo-650 animate-bounce mx-auto" />
        </div>
        <div className="max-w-md space-y-2">
          <h1 className="text-xl sm:text-2xl font-display font-black text-gray-900 dark:text-white leading-tight uppercase">SISTEM SEDANG DIPELIHARA 🛠️</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed font-medium">
            Halo! Kavio Edu sedang ditingkatkan demi performa belajar yang lebih baik. Kami akan kembali online secepatnya. Terima kasih atas kesabaran Anda!
          </p>
        </div>
        <button
          onClick={() => auth.signOut()}
          className="btn-duo-slate px-6 py-2.5 text-xs font-black cursor-pointer"
        >
          Keluar dari Akun
        </button>
      </div>
    );
  }

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
        {path === '/' || path === '/login' ? (
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
          <KavioBlog onNavigate={navigate} userProfile={userProfile} onLogout={() => auth.signOut()} />
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
    </div>
  );
}
