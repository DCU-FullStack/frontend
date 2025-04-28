import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/use-auth';

const DropboxMenuGrid = () => {
  const navigate = useNavigate();
  const { user, logoutMutation } = useAuth();

const menuItems = [
  {
    title: 'dashboard-page',
    route: '/dashboard',
    className: 'row-span-2 col-span-1 bg-blue-900 text-white flex flex-col justify-between',
    content: (
      <>
        <span className="text-2xl font-bold">대시보드</span>
        <svg width="60" height="60" className="self-end mb-2">
          <circle cx="15" cy="15" r="5" fill="white" />
          <circle cx="45" cy="45" r="5" fill="white" />
          <circle cx="15" cy="45" r="5" fill="white" />
          <path d="M15 15 Q30 0 45 45" stroke="white" strokeWidth="2" fill="none" />
        </svg>
      </>
    ),
  },
  {
    title: 'incidents-page',
    route: '/incidents',
    className: 'col-span-2 row-span-1 bg-yellow-200 text-yellow-900 flex flex-col justify-between',
    content: (
      <>
        <span className="text-xl font-bold">사고 관리</span>
        <span className="text-6xl font-bold flex justify-between px-2">“<span>”</span></span>
      </>
    ),
  },
  {
    title: 'Logo',
    route: '/Logo',


    className: 'col-span-1 row-span-1 bg-sky-200 flex flex-col justify-between',
    content: (
      <>
        <span className="text-3xl font-bold text-sky-900">스마트 도로 </span>
        <span className="text-3xl font-bold text-sky-900">이상감지 시스템 </span>
        <img src="https://static.dropbox.com/static/images/brand/glyph@2x.png" alt="Logo" className="w-16 h-16 self-end mb-2" />
      </>
    ),
  },
  {
    title: 'cctv-page',
    route: '/cctv',
    className: 'col-span-1 row-span-1 bg-orange-400 text-orange-900 flex flex-col justify-between',
    content: (
      <>
        <span className="text-xl font-bold">CCTV 감시</span>
        <span className="text-6xl font-bold">Aa</span>
      </>
    ),
  },
   {
      title: 'Auth',
      route: '/auth',
      className: 'col-span-1 row-span-1 bg-lime-300 text-green-900 flex flex-col justify-between',
      content: (
        <>
          <span className="text-xl font-bold">
            {user ? '로그아웃하기' : '로그인하기'}
          </span>
          {user ? (
            <FaSignOutAlt className="text-5xl self-end mb-2" />
          ) : (
            <FaLock className="text-5xl self-end mb-2" />
          )}
        </>
      ),
      onClick: () => {
        if (user) {
          logoutMutation.mutate();
        } else {
          navigate('/auth');
        }
      },
    },
 
  {
    title: 'tasks-page',
    route: '/tasks',
    className: 'col-span-1 row-span-1 bg-purple-800 text-pink-200 flex flex-col justify-between',
    content: (
      <>
        <span className="text-xl font-bold">작업관리</span>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="self-end mb-2" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="18" r="8" fill="#fff" />
          <ellipse cx="24" cy="36" rx="14" ry="8" fill="#fff" />
        </svg>
      </>
    ),
  },
  {
    title: 'Motion',
    route: '/motion',
    className: 'col-span-1 row-span-1 bg-purple-200 text-purple-900 flex flex-col justify-between',
    content: (
      <>
        <span className="text-xl font-bold">Motion</span>
        <svg width="60" height="60" className="self-end mb-2">
          <circle cx="10" cy="50" r="5" fill="#7c3aed" />
          <circle cx="50" cy="10" r="5" fill="#7c3aed" />
          <path d="M10 50 Q35 0 50 10" stroke="#7c3aed" strokeWidth="2" fill="none" />
        </svg>
      </>
    ),
  },
  {
    title: 'Help',
    route: '/help',
    className: 'col-span-1 row-span-1 bg-orange-300 text-orange-900 flex flex-col justify-between',
    content: (
      <>
        <span className="text-xl font-bold">Help</span>
        <div className="flex gap-2 self-end mb-2">
          <div className="w-6 h-6 bg-orange-700 rounded"></div>
          <div className="w-6 h-6 bg-orange-900 rounded"></div>
        </div>
      </>
    ),
  }, 
  {
    title: 'Settings',
    route: '/settings',
    className: 'col-span-2 row-span-1 bg-gray-200 text-gray-700 flex flex-col justify-center items-center rounded-br-2xl',
    content: (
      <>
        <span className="text-xl font-bold mb-2">Setting</span>
        <svg width="40" height="40" className="mb-2">
          <circle cx="20" cy="20" r="18" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
          <text x="50%" y="55%" textAnchor="middle" fill="#6b7280" fontSize="18" fontFamily="Arial" dy=".3em">...</text>
        </svg>
      </>
    ),
  },
];

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center p-0 m-0 min-h-screen min-w-screen">
      <div
        className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden"
        style={{
          width: '98%',
          height: '98%',
        }}
      >
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            className={`p-6 cursor-pointer hover:opacity-80 transition ${item.className}`}
            onClick={item.onClick ? item.onClick : () => item.route && navigate(item.route)}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropboxMenuGrid; 