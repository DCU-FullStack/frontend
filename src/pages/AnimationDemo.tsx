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
import { useTheme } from '@/contexts/theme-context';

const DropboxMenuGrid = () => {
  const navigate = useNavigate();
  const { user, logoutMutation } = useAuth();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const getMenuStyle = (darkStyle: string, lightStyle: string) => {
    return isDarkMode ? darkStyle : lightStyle;
  };

  const menuItems = [
    {
      title: 'dashboard-page',
      route: '/dashboard',
      className: `row-span-2 col-span-1 ${getMenuStyle(
        'bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-900 text-white',
        'bg-gradient-to-br from-sky-200 via-blue-100 to-white text-sky-900'
      )} flex flex-col justify-between shadow-lg hover:shadow-xl group hover:from-slate-700 hover:via-slate-800 hover:to-zinc-800 transition-all duration-300`,
      content: (
        <>
          <div className="space-y-2">
            <span className={`text-4xl font-bold tracking-wide ${getMenuStyle('text-blue-300', 'text-sky-900')} group-hover:text-white transition-colors duration-300`}>홈</span>
            <p className={`text-sm ${getMenuStyle('text-blue-200', 'text-sky-700')} group-hover:text-white transition-colors duration-300`}>도로 상황 실시간 모니터링</p>
          </div>
          <div className="flex justify-end space-x-2">
            <FaCar className={`text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 ${getMenuStyle('text-blue-300', 'text-sky-900')} group-hover:text-white`} />
            <FaTrafficLight className={`text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 ${getMenuStyle('text-blue-300', 'text-sky-900')} group-hover:text-white`} />
          </div>
        </>
      ),
    },
    {
      title: 'incidents-page',
      route: '/incidents',
      className: `col-span-2 row-span-1 ${getMenuStyle(
        'bg-gradient-to-r from-slate-800 via-slate-900 to-zinc-900 text-white',
        'bg-gradient-to-r from-sky-200 via-blue-100 to-white text-sky-900'
      )} flex flex-col justify-between shadow-lg hover:shadow-xl group hover:from-slate-700 hover:via-slate-800 hover:to-zinc-800 transition-all duration-300`,
      content: (
        <>
          <div className="space-y-2">
            <span className={`text-3xl font-bold tracking-wide ${getMenuStyle('text-blue-300', 'text-sky-900')} group-hover:text-white transition-colors duration-300`}>이상 보고</span>
            <p className={`text-sm ${getMenuStyle('text-blue-200', 'text-sky-700')} group-hover:text-white transition-colors duration-300`}>사고 발생 및 처리 현황</p>
          </div>
          <div className="flex justify-end space-x-2">
            <FaExclamationTriangle className={`text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 ${getMenuStyle('text-white', 'text-sky-900')} group-hover:text-white`} />
            <FaCar className={`text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 ${getMenuStyle('text-white', 'text-sky-900')} group-hover:text-white`} />
          </div>
        </>
      ),
    },
    {
      title: 'Logo',
      route: '/Logo',
      className: `col-span-1 row-span-1 ${getMenuStyle(
        'bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-900 text-white',
        'bg-gradient-to-br from-sky-100 via-blue-50 to-white text-sky-900'
      )} flex flex-col justify-between shadow-lg hover:shadow-xl group hover:from-slate-700 hover:via-slate-800 hover:to-zinc-800 transition-all duration-300`,
      content: (
        <>
          <div className="space-y-2">
            <span className={`text-3xl font-bold ${getMenuStyle('text-blue-300', 'text-sky-900')} tracking-wide group-hover:text-white transition-colors duration-300`}>스마트 도로</span>
            <span className={`text-3xl font-bold ${getMenuStyle('text-blue-300', 'text-sky-900')} tracking-wide group-hover:text-white transition-colors duration-300`}>이상감지 시스템</span>
            <p className={`text-sm ${getMenuStyle('text-blue-200', 'text-sky-700')} group-hover:text-white transition-colors duration-300`}>AI 기반 실시간 감시</p>
          </div>
          <div className="flex justify-end space-x-2">
            <FaRoad className={`text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 ${getMenuStyle('text-white', 'text-sky-900')} group-hover:text-white`} />
            <FaCar className={`text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 ${getMenuStyle('text-white', 'text-sky-900')} group-hover:text-white`} />
          </div>
        </>
      ),
    },
    {
      title: 'cctv-page',
      route: '/cctv',
      className: `col-span-1 row-span-1 ${getMenuStyle(
        'bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-900 text-white',
        'bg-gradient-to-br from-sky-200 via-blue-100 to-white text-sky-900'
      )} flex flex-col justify-between shadow-lg hover:shadow-xl group hover:from-slate-700 hover:via-slate-800 hover:to-zinc-800 transition-all duration-300`,
      content: (
        <>
          <div className="space-y-2">
            <span className={`text-3xl font-bold tracking-wide ${getMenuStyle('text-blue-300', 'text-sky-900')} group-hover:text-white transition-colors duration-300`}>CCTV 감시</span>
            <p className={`text-sm ${getMenuStyle('text-blue-200', 'text-sky-700')} group-hover:text-white transition-colors duration-300`}>차량 이동 실시간 모니터링</p>
          </div>
          <div className="flex justify-end space-x-2">
            <FaVideo className={`text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 ${getMenuStyle('text-white', 'text-sky-900')} group-hover:text-white`} />
            <FaCar className={`text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 ${getMenuStyle('text-white', 'text-sky-900')} group-hover:text-white`} />
          </div>
        </>
      ),
    },
    {
      title: 'Help',
      route: '/help',
      className: `col-span-1 row-span-1 ${getMenuStyle(
        'bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-900 text-white',
        'bg-gradient-to-br from-sky-200 via-blue-100 to-white text-sky-900'
      )} flex flex-col justify-between shadow-lg hover:shadow-xl group hover:from-slate-700 hover:via-slate-800 hover:to-zinc-800 transition-all duration-300`,
      content: (
        <>
          <div className="space-y-2">
            <span className={`text-3xl font-bold ${getMenuStyle('text-blue-300', 'text-sky-900')} tracking-wide group-hover:text-white transition-colors duration-300`}>도움말</span>
            <p className={`text-sm ${getMenuStyle('text-blue-200', 'text-sky-700')} group-hover:text-white transition-colors duration-300`}>시스템 사용 가이드</p>
          </div>
          <div className="flex justify-end space-x-2">
            <FaQuestionCircle className={`text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 ${getMenuStyle('text-white', 'text-sky-900')} group-hover:text-white`} />
            <FaCar className={`text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 ${getMenuStyle('text-white', 'text-sky-900')} group-hover:text-white`} />
          </div>
        </>
      ),
    },
    {
      title: 'Settings',
      route: '/settings',
      className: `col-span-1 row-span-1 ${getMenuStyle(
        'bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-900 text-white',
        'bg-gradient-to-br from-sky-200 via-blue-100 to-white text-sky-900'
      )} flex flex-col justify-between shadow-lg hover:shadow-xl group hover:from-slate-700 hover:via-slate-800 hover:to-zinc-800 transition-all duration-300`,
      content: (
        <>
          <div className="space-y-2">
            <span className={`text-3xl font-bold ${getMenuStyle('text-blue-300', 'text-sky-900')} tracking-wide group-hover:text-white transition-colors duration-300`}>마이페이지</span>
            <p className={`text-sm ${getMenuStyle('text-blue-200', 'text-sky-700')} group-hover:text-white transition-colors duration-300`}>시스템 설정 및 관리</p>
          </div>
          <div className="flex justify-end space-x-2">
            <FaCog className={`text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 ${getMenuStyle('text-white', 'text-sky-900')} group-hover:text-white`} />
            <FaCar className={`text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 ${getMenuStyle('text-white', 'text-sky-900')} group-hover:text-white`} />
          </div>
        </>
      ),
    },
    {
      title: 'Auth',
      route: '/auth',
      className: `col-span-2 row-span-1 ${getMenuStyle(
        'bg-gradient-to-r from-slate-800 via-slate-900 to-zinc-900 text-white',
        'bg-gradient-to-r from-sky-200 via-blue-100 to-white text-sky-900'
      )} flex flex-col justify-center items-center rounded-br-2xl shadow-lg hover:shadow-xl group hover:from-slate-700 hover:via-slate-800 hover:to-zinc-800 transition-all duration-300`,
      content: (
        <>
          <div className="space-y-2 text-center">
            <span className={`text-3xl font-bold ${getMenuStyle('text-blue-300', 'text-sky-900')} tracking-wide group-hover:text-white transition-colors duration-300`}>
              {user ? '로그아웃하기' : '로그인하기'}
            </span>
            <p className={`text-sm ${getMenuStyle('text-blue-200', 'text-sky-700')} group-hover:text-white transition-colors duration-300`}>{user ? '안전한 로그아웃' : '시스템 접속하기'}</p>
          </div>
          <div className="flex justify-center space-x-2">
            {user ? (
              <FaUserShield className={`text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 ${getMenuStyle('text-white', 'text-sky-900')} group-hover:text-white`} />
            ) : (
              <FaUserShield className={`text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 ${getMenuStyle('text-white', 'text-sky-900')} group-hover:text-white`} />
            )}
            <FaCar className={`text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 ${getMenuStyle('text-white', 'text-sky-900')} group-hover:text-white`} />
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
      className: `col-span-1 row-span-1 ${getMenuStyle(
        'bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-900 text-white',
        'bg-gradient-to-br from-sky-200 via-blue-100 to-white text-sky-900'
      )} flex flex-col justify-between shadow-lg hover:shadow-xl group hover:from-slate-700 hover:via-slate-800 hover:to-zinc-800 transition-all duration-300`,
      content: (
        <>
          <div className="space-y-2">
            <span className={`text-3xl font-bold ${getMenuStyle('text-blue-300', 'text-sky-900')} tracking-wide group-hover:text-white transition-colors duration-300`}>작업 관리</span>
            <p className={`text-sm ${getMenuStyle('text-blue-200', 'text-sky-700')} group-hover:text-white transition-colors duration-300`}>차량 등록 및 작업 관리</p>
          </div>
          <div className="flex justify-end space-x-2">
            <FaTasks className={`text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 ${getMenuStyle('text-white', 'text-sky-900')} group-hover:text-white`} />
            <FaCar className={`text-6xl opacity-80 transform hover:scale-110 transition-all duration-300 ${getMenuStyle('text-white', 'text-sky-900')} group-hover:text-white`} />
          </div>
        </>
      ),
    },
    {
      title: 'Motion',
      route: '/motion',
      className: `col-span-1 row-span-1 ${getMenuStyle(
        'bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-900 text-white',
        'bg-gradient-to-br from-sky-100 via-blue-50 to-white text-sky-900'
      )} flex flex-col justify-between shadow-lg hover:shadow-xl group hover:from-slate-700 hover:via-slate-800 hover:to-zinc-800 transition-all duration-300`,
      content: (
        <>
          <div className="space-y-2">
            <span className={`text-3xl font-bold ${getMenuStyle('text-blue-300', 'text-sky-900')} tracking-wide group-hover:text-white transition-colors duration-300`}>차량 감지</span>
            <p className={`text-sm ${getMenuStyle('text-blue-200', 'text-sky-700')} group-hover:text-white transition-colors duration-300`}>차량 동작 감지 및 분석</p>
          </div>
          <div className="flex justify-end space-x-2">
            <div className="relative">
              <svg width="60" height="60" className={`opacity-80 transform hover:scale-110 transition-all duration-300 ${getMenuStyle('text-white', 'text-sky-900')}`}>
                <circle cx="10" cy="50" r="5" fill="#059669" className={`${getMenuStyle('group-hover:fill-white', 'group-hover:fill-sky-900')} transition-colors duration-300`} />
                <circle cx="50" cy="10" r="5" fill="#059669" className={`${getMenuStyle('group-hover:fill-white', 'group-hover:fill-sky-900')} transition-colors duration-300`} />
                <path d="M10 50 Q35 0 50 10" stroke="#059669" strokeWidth="2" fill="none" className={`${getMenuStyle('group-hover:stroke-white', 'group-hover:stroke-sky-900')} transition-colors duration-300`} />
              </svg>
              <FaCar className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl ${getMenuStyle('text-white', 'text-sky-900')} group-hover:text-white transition-colors duration-300`} />
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className={`fixed inset-0 bg-blue-100 dark:bg-gray-900 flex items-center justify-center p-0 m-0 min-h-screen min-w-screen`}>
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