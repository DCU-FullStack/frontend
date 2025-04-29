import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCar, 
  FaTrafficLight, 
  FaRoad, 
  FaVideo, 
  FaTasks, 
  FaCog, 
  FaQuestionCircle,
  FaUserShield,
  FaChartLine,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useAuth } from '../hooks/use-auth';

const DropboxMenuGrid = () => {
  const navigate = useNavigate();
  const { user, logoutMutation } = useAuth();

  const menuItems = [
    {
      title: 'dashboard-page',
      route: '/dashboard',
      className: 'row-span-2 col-span-1 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white flex flex-col justify-between shadow-lg hover:shadow-xl group hover:from-black hover:via-black hover:to-black transition-all duration-300',
      content: (
        <>
          <div className="space-y-2">
            <span className="text-4xl font-bold tracking-wide group-hover:text-white transition-colors duration-300">대시보드</span>
            <p className="text-blue-200 text-sm group-hover:text-white transition-colors duration-300">도로 상황 실시간 모니터링</p>
          </div>
          <div className="flex justify-end space-x-2">
            <FaCar className="text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 group-hover:text-white" />
            <FaTrafficLight className="text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 group-hover:text-white" />
          </div>
        </>
      ),
    },
    {
      title: 'incidents-page',
      route: '/incidents',
      className: 'col-span-2 row-span-1 bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-200 text-yellow-900 flex flex-col justify-between shadow-lg hover:shadow-xl group hover:from-black hover:via-black hover:to-black transition-all duration-300',
      content: (
        <>
          <div className="space-y-2">
            <span className="text-3xl font-bold tracking-wide group-hover:text-white transition-colors duration-300">교통사고 관리</span>
            <p className="text-yellow-700 text-sm group-hover:text-white transition-colors duration-300">사고 발생 및 처리 현황</p>
          </div>
          <div className="flex justify-end space-x-2">
            <FaExclamationTriangle className="text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 group-hover:text-white" />
            <FaCar className="text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 group-hover:text-white" />
          </div>
        </>
      ),
    },
    {
      title: 'Logo',
      route: '/Logo',
      className: 'col-span-1 row-span-1 bg-gradient-to-br from-sky-200 via-sky-100 to-sky-200 flex flex-col justify-between shadow-lg hover:shadow-xl group hover:from-black hover:via-black hover:to-black transition-all duration-300',
      content: (
        <>
          <div className="space-y-2">
            <span className="text-3xl font-bold text-sky-900 tracking-wide group-hover:text-white transition-colors duration-300">스마트 도로</span>
            <span className="text-3xl font-bold text-sky-900 tracking-wide group-hover:text-white transition-colors duration-300">이상감지 시스템</span>
            <p className="text-sky-700 text-sm group-hover:text-white transition-colors duration-300">AI 기반 실시간 감시</p>
          </div>
          <div className="flex justify-end space-x-2">
            <FaRoad className="text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 group-hover:text-white" />
            <FaCar className="text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 group-hover:text-white" />
          </div>
        </>
      ),
    },
    {
      title: 'cctv-page',
      route: '/cctv',
      className: 'col-span-1 row-span-1 bg-gradient-to-br from-orange-400 via-orange-300 to-orange-400 text-orange-900 flex flex-col justify-between shadow-lg hover:shadow-xl group hover:from-black hover:via-black hover:to-black transition-all duration-300',
      content: (
        <>
          <div className="space-y-2">
            <span className="text-3xl font-bold tracking-wide group-hover:text-white transition-colors duration-300">CCTV 감시</span>
            <p className="text-orange-800 text-sm group-hover:text-white transition-colors duration-300">차량 이동 실시간 모니터링</p>
          </div>
          <div className="flex justify-end space-x-2">
            <FaVideo className="text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 group-hover:text-white" />
            <FaCar className="text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 group-hover:text-white" />
          </div>
        </>
      ),
    },
    {
      title: 'Auth',
      route: '/auth',
      className: 'col-span-1 row-span-1 bg-gradient-to-br from-lime-300 via-lime-200 to-lime-300 text-green-900 flex flex-col justify-between shadow-lg hover:shadow-xl group hover:from-black hover:via-black hover:to-black transition-all duration-300',
      content: (
        <>
          <div className="space-y-2">
            <span className="text-3xl font-bold tracking-wide group-hover:text-white transition-colors duration-300">
              {user ? '로그아웃하기' : '로그인하기'}
            </span>
            <p className="text-green-800 text-sm group-hover:text-white transition-colors duration-300">{user ? '안전한 로그아웃' : '시스템 접속하기'}</p>
          </div>
          <div className="flex justify-end space-x-2">
            {user ? (
              <FaUserShield className="text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 group-hover:text-white" />
            ) : (
              <FaUserShield className="text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 group-hover:text-white" />
            )}
            <FaCar className="text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 group-hover:text-white" />
          </div>
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
      className: 'col-span-1 row-span-1 bg-gradient-to-br from-purple-800 via-purple-700 to-purple-800 text-pink-200 flex flex-col justify-between shadow-lg hover:shadow-xl group hover:from-black hover:via-black hover:to-black transition-all duration-300',
      content: (
        <>
          <div className="space-y-2">
            <span className="text-3xl font-bold tracking-wide group-hover:text-white transition-colors duration-300">차량 관리</span>
            <p className="text-pink-300 text-sm group-hover:text-white transition-colors duration-300">차량 통행 및 작업 관리</p>
          </div>
          <div className="flex justify-end space-x-2">
            <FaTasks className="text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 group-hover:text-white" />
            <FaCar className="text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 group-hover:text-white" />
          </div>
        </>
      ),
    },
    {
      title: 'Motion',
      route: '/motion',
      className: 'col-span-1 row-span-1 bg-gradient-to-br from-purple-200 via-purple-100 to-purple-200 text-purple-900 flex flex-col justify-between shadow-lg hover:shadow-xl group hover:from-black hover:via-black hover:to-black transition-all duration-300',
      content: (
        <>
          <div className="space-y-2">
            <span className="text-3xl font-bold tracking-wide group-hover:text-white transition-colors duration-300">차량 감지</span>
            <p className="text-purple-700 text-sm group-hover:text-white transition-colors duration-300">차량 동작 감지 및 분석</p>
          </div>
          <div className="flex justify-end space-x-2">
            <div className="relative">
              <svg width="60" height="60" className="opacity-80 transform hover:scale-110 transition-all duration-300">
                <circle cx="10" cy="50" r="5" fill="#7c3aed" className="group-hover:fill-white transition-colors duration-300" />
                <circle cx="50" cy="10" r="5" fill="#7c3aed" className="group-hover:fill-white transition-colors duration-300" />
                <path d="M10 50 Q35 0 50 10" stroke="#7c3aed" strokeWidth="2" fill="none" className="group-hover:stroke-white transition-colors duration-300" />
              </svg>
              <FaCar className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl group-hover:text-white transition-colors duration-300" />
            </div>
          </div>
        </>
      ),
    },
    {
      title: 'Help',
      route: '/help',
      className: 'col-span-1 row-span-1 bg-gradient-to-br from-orange-300 via-orange-200 to-orange-300 text-orange-900 flex flex-col justify-between shadow-lg hover:shadow-xl group hover:from-black hover:via-black hover:to-black transition-all duration-300',
      content: (
        <>
          <div className="space-y-2">
            <span className="text-3xl font-bold tracking-wide group-hover:text-white transition-colors duration-300">도움말</span>
            <p className="text-orange-800 text-sm group-hover:text-white transition-colors duration-300">시스템 사용 가이드</p>
          </div>
          <div className="flex justify-end space-x-2">
            <FaQuestionCircle className="text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 group-hover:text-white" />
            <FaCar className="text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 group-hover:text-white" />
          </div>
        </>
      ),
    },
    {
      title: 'Settings',
      route: '/settings',
      className: 'col-span-2 row-span-1 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 text-gray-700 flex flex-col justify-center items-center rounded-br-2xl shadow-lg hover:shadow-xl group hover:from-black hover:via-black hover:to-black transition-all duration-300',
      content: (
        <>
          <div className="space-y-2 text-center">
            <span className="text-3xl font-bold tracking-wide group-hover:text-white transition-colors duration-300">설정</span>
            <p className="text-gray-600 text-sm group-hover:text-white transition-colors duration-300">시스템 설정 및 관리</p>
          </div>
          <div className="flex justify-center space-x-2">
            <FaCog className="text-5xl opacity-80 transform hover:rotate-180 transition-all duration-300 group-hover:text-white" />
            <FaCar className="text-5xl opacity-80 transform hover:scale-110 transition-all duration-300 group-hover:text-white" />
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-0 m-0 min-h-screen min-w-screen">
      <div
        className="grid grid-cols-4 grid-rows-2 gap-4 rounded-3xl overflow-hidden p-4"
        style={{
          width: '98%',
          height: '98%',
        }}
      >
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            className={`p-6 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] rounded-xl ${item.className}`}
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