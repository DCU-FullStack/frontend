import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";

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

  const { data: searchResults, isLoading } = useQuery<SearchResult>({
    queryKey: ["/api/search", query],
    queryFn: async () => {
      if (!query || query.trim().length === 0) return { incidents: [], tasks: [], cameras: [] };
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Search failed");
      return await res.json();
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
  const handleResultClick = (type: string, id: number) => {
    setIsSearching(false);
    switch (type) {
      case "incident":
        navigate(`/incidents?id=${id}`);
        break;
      case "task":
        navigate(`/tasks?id=${id}`);
        break;
      case "camera":
        navigate(`/cctv?id=${id}`);
        break;
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      

      {/* Search Results Dropdown */}
      {isSearching && query.trim().length > 0 && (
        <div className="absolute z-50 w-full mt-2 overflow-y-auto bg-white rounded-md shadow-lg max-h-80">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500">검색 중...</div>
          ) : searchResults && (
            <>
              {/* Incidents */}
              {searchResults.incidents.length > 0 && (
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    이상 보고
                  </h3>
                  <ul className="mt-2 divide-y divide-gray-100">
                    {searchResults.incidents.map((incident) => (
                      <li 
                        key={`incident-${incident.id}`}
                        className="px-2 py-2 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleResultClick("incident", incident.id)}
                      >
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">{incident.title}</p>
                          <Badge 
                            variant={incident.severity === "긴급" ? "destructive" : "outline"}
                            className="text-xs"
                          >
                            {incident.severity}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{incident.location}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tasks */}
              {searchResults.tasks.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    작업
                  </h3>
                  <ul className="mt-2 divide-y divide-gray-100">
                    {searchResults.tasks.map((task) => (
                      <li 
                        key={`task-${task.id}`}
                        className="px-2 py-2 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleResultClick("task", task.id)}
                      >
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">{task.title}</p>
                          <Badge 
                            variant={task.status === "긴급" ? "destructive" : "outline"}
                            className="text-xs"
                          >
                            {task.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{task.location}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cameras */}
              {searchResults.cameras.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    CCTV
                  </h3>
                  <ul className="mt-2 divide-y divide-gray-100">
                    {searchResults.cameras.map((camera) => (
                      <li 
                        key={`camera-${camera.id}`}
                        className="px-2 py-2 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleResultClick("camera", camera.id)}
                      >
                        <p className="text-sm font-medium text-gray-900">{camera.name}</p>
                        <p className="mt-1 text-xs text-gray-500">{camera.location}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {searchResults.incidents.length === 0 && searchResults.tasks.length === 0 && searchResults.cameras.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500">
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
