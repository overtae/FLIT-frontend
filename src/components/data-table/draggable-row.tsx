import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Row, flexRender } from "@tanstack/react-table";

import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function DraggableRow<TData>({ row }: { row: Row<TData> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: (row.original as { id: number }).id,
  });
  const isSelected = row.getIsSelected();
  return (
    <TableRow
      data-state={isSelected ? "selected" : undefined}
      data-dragging={isDragging}
      ref={setNodeRef}
      className={cn("relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80", isSelected && "bg-muted")}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  );
}
