import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TreatmentCardSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Skeleton className="h-3 w-12" />
          <Skeleton className="mt-1 h-4 w-32" />
        </div>
        <div>
          <Skeleton className="h-3 w-8" />
          <Skeleton className="mt-1 h-4 w-24" />
        </div>
        <div>
          <Skeleton className="h-3 w-10" />
          <Skeleton className="mt-1 h-5 w-20" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-32" />
      </CardFooter>
    </Card>
  );
}
