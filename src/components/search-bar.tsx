import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Input
            type="search"
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300"
            placeholder="검색을 원하시나요?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsSearching(true)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isSearching && query.trim().length > 0 && (
        <div className="absolute mt-2 w-full bg-white rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500">검색 중...</div>
          ) : searchResults && (
            <>
              {/* Incidents */}
              {searchResults.incidents.length > 0 && (
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    이상 보고
                  </h3>
                  <ul className="mt-2 divide-y divide-gray-100">
                    {searchResults.incidents.map((incident) => (
                      <li 
                        key={`incident-${incident.id}`}
                        className="px-2 py-2 hover:bg-gray-50 cursor-pointer"
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
                        <p className="text-xs text-gray-500 mt-1">{incident.location}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tasks */}
              {searchResults.tasks.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    작업
                  </h3>
                  <ul className="mt-2 divide-y divide-gray-100">
                    {searchResults.tasks.map((task) => (
                      <li 
                        key={`task-${task.id}`}
                        className="px-2 py-2 hover:bg-gray-50 cursor-pointer"
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
                        <p className="text-xs text-gray-500 mt-1">{task.location}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cameras */}
              {searchResults.cameras.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    CCTV
                  </h3>
                  <ul className="mt-2 divide-y divide-gray-100">
                    {searchResults.cameras.map((camera) => (
                      <li 
                        key={`camera-${camera.id}`}
                        className="px-2 py-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleResultClick("camera", camera.id)}
                      >
                        <p className="text-sm font-medium text-gray-900">{camera.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{camera.location}</p>
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
