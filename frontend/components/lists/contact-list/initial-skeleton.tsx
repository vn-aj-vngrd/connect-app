import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function InitialSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Website</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index} className="border-none cursor-pointer">
              <TableCell className="flex items-center">
                <Skeleton className="relative flex w-10 h-10 mr-5 overflow-hidden rounded-full shrink-0" />
                <Skeleton className="flex flex-1 h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-full h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-full h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-full h-4" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
