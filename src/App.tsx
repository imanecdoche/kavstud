import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
import NotFound from './components/NotFound';
import Logo from './components/Logo';
import { UserProfile } from './types';
import { Sparkles } from 'lucide-react';

export default function App() {
  // Simple & Robust state routing
  const [path, setPath] = useState(window.location.pathname);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(false);

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

  // Show a beautiful full-screen loader during initial auth check
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center space-y-4">
        <div className="text-center space-y-3">
          <Logo className="h-10 w-auto text-indigo-600 animate-pulse mx-auto" />
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Mengautentikasi Sistem...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col relative" id="app-root">
      {/* Global Loading Overlay */}
      {globalLoading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-3xs flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white/80 p-4 rounded-2xl border border-gray-100 flex items-center gap-2 shadow-md">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
            <span className="text-xs font-bold text-gray-700">Memproses...</span>
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
        ) : isStudentProfilePath ? (
          <StudentProfile studentId={studentIdParam} onNavigate={navigate} onSetLoading={setGlobalLoading} />
        ) : isCircleProfilePath ? (
          <CircleProfile circleId={circleIdParam} onNavigate={navigate} onSetLoading={setGlobalLoading} />
        ) : isAssignmentDetailPath ? (
          <AssignmentDetail assignmentId={assignmentIdParam} onNavigate={navigate} onSetLoading={setGlobalLoading} />
        ) : isSubmissionDetailPath ? (
          <SubmissionDetail submissionId={submissionIdParam} onNavigate={navigate} onSetLoading={setGlobalLoading} />
        ) : (
          <NotFound onNavigate={navigate} />
        )}
      </div>
    </div>
  );
}
