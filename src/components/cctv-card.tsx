import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useNavigate } from "react-router-dom";

type CCTVFeedProps = {
  camera: Camera;
};

const CCTVFeed = ({ camera }: CCTVFeedProps) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="relative overflow-hidden bg-gray-200 rounded cursor-pointer group"
      onClick={() => navigate(`/cctv/${camera.id}`)}
    >
      <AspectRatio ratio={16 / 9}>
        <img 
          src={camera.imageUrl} 
          alt={`CCTV 피드 - ${camera.name}`} 
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </AspectRatio>
      <div className="absolute bottom-0 left-0 right-0 p-2 text-xs text-white bg-black bg-opacity-50">
        <div className="flex items-center justify-between">
          <span>{camera.name}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/cctv/${camera.id}?fullscreen=true`);
            }}
          >
            전체화면
          </Button>
        </div>
      </div>
    </div>
  );
};

export function CCTVCard() {
  const navigate = useNavigate();
  const { data: cameras, isLoading, error } = useQuery<Camera[]>({
    queryKey: ["/api/cameras"],
    queryFn: async () => {
      const response = await fetch("/api/cameras");
      return response.json();
    },
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">실시간 CCTV 모니터링</CardTitle>
          <Button 
            variant="link" 
            className="h-auto p-0 text-sm"
            onClick={() => navigate("/cctv")}
          >
            전체 화면
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {isLoading ? (
            <>
              <Skeleton className="w-full rounded aspect-video" />
              <Skeleton className="w-full rounded aspect-video" />
              <Skeleton className="w-full rounded aspect-video" />
              <Skeleton className="w-full rounded aspect-video" />
            </>
          ) : error ? (
            <div className="col-span-2 py-4 text-center text-red-500">
              카메라 데이터를 불러오는 중 오류가 발생했습니다.
            </div>
          ) : cameras && cameras.length > 0 ? (
            cameras.slice(0, 4).map((camera) => (
              <CCTVFeed key={camera.id} camera={camera} />
            ))
          ) : (
            <div className="col-span-2 py-4 text-center text-gray-500">
              사용 가능한 카메라가 없습니다.
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          className="w-full mt-4 text-primary border-primary"
          onClick={() => navigate('/cctv')}
        >
          모든 카메라 보기
        </Button>
      </CardContent>
    </Card>
  );
}
