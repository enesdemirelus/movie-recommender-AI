import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MovieCardProps {
  id: number;
  title: string;
  poster_url: string;
}

function MovieCard({ title, poster_url }: MovieCardProps) {
  return (
    <Card className="w-[200px] border-none shadow-none">
      <CardContent className="p-0">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
          <Image
            src={poster_url}
            alt={title}
            fill
            sizes="200px"
            className="object-cover"
          />
        </div>
      </CardContent>

      <CardHeader className="px-0 pt-2">
        <CardTitle className="text-sm text-center font-semibold leading-tight">
          {title}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default MovieCard;
