import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, Camera } from "lucide-react";
import { sampleCameras } from "@/pages/cctv-page";

type SearchResult = {
  incidents: any[];
  tasks: any[];
  cameras: any[];
};

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [location, navigate] = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isLoading } = useQuery<any>({
    queryKey: ["/api/search-local", query],
    queryFn: async () => {
      if (!query || query.trim().length === 0) return { incidents: [], tasks: [], cameras: [] };
      // incidents
      const token = localStorage.getItem('token');
      const incidentsRes = await fetch("/api/incidents", {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const incidentsData = await incidentsRes.json();
      const filteredIncidents = incidentsData.filter((incident: any) =>
        incident.title?.toLowerCase().includes(query.toLowerCase()) ||
        incident.location?.toLowerCase().includes(query.toLowerCase())
      );
      // tasks
      const tasksRes = await fetch("/api/tasks", {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const tasksData = await tasksRes.json();
      const filteredTasks = tasksData.filter((task: any) =>
        task.title?.toLowerCase().includes(query.toLowerCase()) ||
        task.location?.toLowerCase().includes(query.toLowerCase())
      );
      // cameras (from sampleCameras)
      const filteredCameras = sampleCameras.filter((camera: any) =>
        camera.name?.toLowerCase().includes(query.toLowerCase()) ||
        camera.location?.toLowerCase().includes(query.toLowerCase())
      );
      return {
        incidents: filteredIncidents,
        tasks: filteredTasks,
        cameras: filteredCameras,
      };
    },
    enabled: query.trim().length > 0 && isSearching,
  });

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
  };

  // Navigate to appropriate page when clicking on search result
  const handleResultClick = (type: string, id?: number) => {
    setIsSearching(false);
    if (!id) return;
    switch (type) {
      case "incident":
        window.dispatchEvent(new CustomEvent('go-incidents-menu'));
        break;
      case "task":
        window.dispatchEvent(new CustomEvent('go-tasks-menu'));
        break;
      case "camera":
        window.dispatchEvent(new CustomEvent('go-cctv-menu'));
        break;
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-200 rounded-full h-9 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none dark:text-white"
          placeholder="검색"
          value={query}
          onChange={e => { setQuery(e.target.value); setIsSearching(true); }}
        />
      </form>

      {/* Search Results Dropdown */}
      {isSearching && query.trim().length > 0 && (
        <div className="absolute z-50 w-full mt-2 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700 max-h-80">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">검색 중...</div>
          ) : searchResults && (
            <>
              {/* Incidents */}
              {searchResults.incidents.length > 0 && (
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-300">
                    이상 보고
                  </h3>
                  <ul className="mt-2 divide-y divide-gray-100">
                    {searchResults.incidents.map((incident: any) => (
                      <li 
                        key={`incident-${incident.id}`}
                        className={`px-2 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 ${!incident.id ? 'opacity-50 pointer-events-none' : ''}`}
                        onClick={() => handleResultClick("incident", incident.id)}
                      >
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <div className="flex-1">
                        <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{incident.title}</p>
                            
                          </div>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{incident.location}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tasks */}
              {searchResults.tasks.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-300">
                    작업
                  </h3>
                  <ul className="mt-2 divide-y divide-gray-100">
                    {searchResults.tasks.map((task: any) => (
                      <li 
                        key={`task-${task.id}`}
                        className={`px-2 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 ${!task.id ? 'opacity-50 pointer-events-none' : ''}`}
                        onClick={() => handleResultClick("task", task.id)}
                      >
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <div className="flex-1">
                        <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                            
                          </div>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{task.location}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cameras */}
              {searchResults.cameras.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-300">
                    CCTV
                  </h3>
                  <ul className="mt-2 divide-y divide-gray-100">
                    {searchResults.cameras.map((camera: any) => (
                      <li 
                        key={`camera-${camera.id}`}
                        className={`px-2 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 ${!camera.id ? 'opacity-50 pointer-events-none' : ''}`}
                        onClick={() => handleResultClick("camera", camera.id)}
                      >
                        <Camera className="w-4 h-4 text-green-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{camera.name}</p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{camera.location}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {searchResults.incidents.length === 0 && searchResults.tasks.length === 0 && searchResults.cameras.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-300">
                  검색 결과가 없습니다.
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
