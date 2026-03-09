"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTableWithFilters } from "@/components/ui/data-table-with-filters";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import {
    useRooms,
    useToggleRoomStatus,
    Room,
    RoomQueryParams
} from "@/features/rooms";
import { roomColumns } from "@/features/rooms/components/room-columns";
import { RoomFilters } from "@/features/rooms/components/room-filters";
import { RoomFormModal } from "@/features/rooms/components/room-form-modal";
import { DeleteRoomModal } from "@/features/rooms/components/delete-room-modal";
import { OccupancyList } from "@/features/rooms/components/occupancy-list";

export default function RoomsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [filters, setFilters] = useState<RoomQueryParams>({
        search: "",
        is_active: undefined,
    });

    const { mutateAsync: toggleStatus } = useToggleRoomStatus();

    // Queries
    const { data: roomsData, isLoading, error: queryError } = useRooms({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        search: filters.search || undefined,
        // type_: filters.type_ || undefined,
    });

    // State for modals
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(undefined);

    const handleCreate = () => {
        setSelectedRoom(undefined);
        setIsFormModalOpen(true);
    };

    const handleEdit = (room: Room) => {
        setSelectedRoom(room);
        setIsFormModalOpen(true);
    };

    const handleDelete = (room: Room) => {
        setSelectedRoom(room);
        setIsDeleteModalOpen(true);
    };

    const handleToggleStatus = async (id: string) => {
        try {
            await toggleStatus(id);
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    }, []);

    const handleFiltersChange = useCallback((newFilters: RoomQueryParams) => {
        setFilters(newFilters);
    }, []);

    const rooms = roomsData?.data || [];
    const total = roomsData?.total || 0;
    const error = queryError instanceof Error ? queryError.message : null;

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestion des Hospitalisations</h1>
                    <p className="text-muted-foreground">
                        Gérez les chambres, la capacité et les occupations en temps réel.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="rooms" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="rooms">Gestion des Chambres</TabsTrigger>
                    <TabsTrigger value="occupancy">Occupations & Admissions</TabsTrigger>
                </TabsList>

                <TabsContent value="rooms" className="space-y-6 pt-6">
                    <div className="flex justify-end">
                        <Button onClick={handleCreate} className="cursor-pointer">
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter une chambre
                        </Button>
                    </div>

                    <DataTableWithFilters
                        title="Liste des chambres"
                        columns={roomColumns(handleEdit, handleDelete, handleToggleStatus)}
                        data={rooms}
                        loading={isLoading}
                        error={error}
                        total={total}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        filterComponent={RoomFilters}
                        initialFilters={filters}
                        onFiltersChange={handleFiltersChange}
                    />
                </TabsContent>

                <TabsContent value="occupancy" className="pt-6">
                    <OccupancyList />
                </TabsContent>
            </Tabs>

            <RoomFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                room={selectedRoom}
            />

            {selectedRoom && (
                <DeleteRoomModal
                    room={selectedRoom}
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                />
            )}
        </div>
    );
}
