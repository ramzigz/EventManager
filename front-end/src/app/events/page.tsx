"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useMutation,
  useQuery,
  useQueryClient,
  QueryClientProvider,
} from "react-query";
import {
  fetchEvents,
  deleteEvent,
  updateEvent,
  createEvent,
} from "@/services/eventsService";
import ConfirmAction from "@/components/ConfirmAction";
import EventForm from "@/components/EventForm";

export type Event = {
  id?: string;
  title: string;
  description: string;
  date: string;
  category: string;
};

export default function Events() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    "events",
    () => fetchEvents({ limit: 10000, skip: 0 }),
    {
      refetchOnWindowFocus: false,
    }
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<Event | undefined>(
    undefined
  );
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = React.useState(false);
  const [eventIdToDelete, setEventIdToDelete] = React.useState<string | null>(
    null
  );

  const { mutate: deleteEventMutation } = useMutation(deleteEvent, {
    onSuccess: () => {
      setIsAlertOpen(false);
      queryClient.invalidateQueries("events");
    },
  });

  const { mutate: saveEventMutation } = useMutation(
    (event: Event) =>
      rowSelection?.id
        ? updateEvent(rowSelection.id, event)
        : createEvent(event),
    {
      onSuccess: () => {
        setRowSelection(undefined);
        queryClient.invalidateQueries("events");
      },
    }
  );

  const removeEvent = (id: string) => {
    deleteEventMutation(id);
    setIsAlertOpen(false);
  };

  const editEvent = (eventData: Event) => {
    saveEventMutation(eventData);
  };

  const addEvent = (eventData: Event) => {
    saveEventMutation(eventData);
  };

  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("date")}</div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("category")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const event = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setRowSelection(event);
                  setIsEventDialogOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (event.id) {
                    setEventIdToDelete(event.id);
                  }
                  setIsAlertOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    // onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      // rowSelection,
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full">
        <div className="p-8">
          <div className="flex items-center space-x-4 my-4">
            <Input
              placeholder="Find Events"
              value={
                (table.getColumn("title")?.getFilterValue() as string) ?? ""
              }
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                table.getColumn("title")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <Button
              onClick={() => setIsEventDialogOpen(true)}
              variant="default"
            >
              Add Event
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      // data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
        <ConfirmAction
          isOpen={isAlertOpen}
          title={"Are you absolutely sure?"}
          message={
            "This action cannot be undone. This will permanently delete this Event."
          }
          onConfirm={() => eventIdToDelete && removeEvent(eventIdToDelete)}
          onCancel={() => {
            setIsAlertOpen(false);
            setEventIdToDelete(null);
          }}
          onClose={() => setIsAlertOpen(true)}
        />
        <EventForm
          event={rowSelection}
          onSave={(eventData) =>
            rowSelection ? editEvent(eventData) : addEvent(eventData)
          }
          isOpen={isEventDialogOpen}
          onClose={() => {
            setRowSelection(undefined);
            setIsEventDialogOpen(false);
          }}
        />
      </div>
    </QueryClientProvider>
  );
}
