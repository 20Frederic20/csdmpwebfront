"use client";

import { useState, useCallback } from "react";
import { DataTableWithFilters } from "@/components/ui/data-table-with-filters";
import { useOccupancies, RoomOccupancy } from "../";
import { occupancyColumns } from "./occupancy-columns";
import { TransferPatientModal } from "./transfer-patient-modal";
import { DischargePatientModal } from "./discharge-patient-modal";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { AdmitPatientModal } from "./admit-patient-modal";
import { OccupancyFilters } from "./occupancy-filters";

export function OccupancyList() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [filters, setFilters] = useState<Record<string, string | boolean | number | undefined>>({});

    const { data: occupancyResponse, isLoading } = useOccupancies({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
    });

    const [selectedOccupancy, setSelectedOccupancy] = useState<RoomOccupancy | null>(null);
    const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isDischargeModalOpen, setIsDischargeModalOpen] = useState(false);

    const handleTransfer = (occupancy: RoomOccupancy) => {
        setSelectedOccupancy(occupancy);
        setIsTransferModalOpen(true);
    };

    const handleDischarge = (occupancy: RoomOccupancy) => {
        setSelectedOccupancy(occupancy);
        setIsDischargeModalOpen(true);
    };

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    }, []);

    const occupancies = occupancyResponse?.data || [];
    const total = occupancyResponse?.total || 0;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={() => setIsAdmitModalOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Admettre un patient
                </Button>
            </div>

            <DataTableWithFilters
                title="Liste des occupations"
                columns={occupancyColumns(handleTransfer, handleDischarge)}
                data={occupancies}
                loading={isLoading}
                total={total}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                filterComponent={OccupancyFilters}
                initialFilters={filters}
                onFiltersChange={setFilters}
            />

            <AdmitPatientModal
                isOpen={isAdmitModalOpen}
                onClose={() => setIsAdmitModalOpen(false)}
            />

            {selectedOccupancy && (
                <>
                    <TransferPatientModal
                        isOpen={isTransferModalOpen}
                        onClose={() => {
                            setIsTransferModalOpen(false);
                            setSelectedOccupancy(null);
                        }}
                        patientId={selectedOccupancy.patient_id}
                        patientName={selectedOccupancy.patient_name || "Patient"}
                        currentRoomId={selectedOccupancy.room_id}
                    />
                    <DischargePatientModal
                        isOpen={isDischargeModalOpen}
                        onClose={() => {
                            setIsDischargeModalOpen(false);
                            setSelectedOccupancy(null);
                        }}
                        patientId={selectedOccupancy.patient_id}
                        patientName={selectedOccupancy.patient_name || "Patient"}
                        roomName={selectedOccupancy.room_name || "Chambre"}
                    />
                </>
            )}
        </div>
    );
}
