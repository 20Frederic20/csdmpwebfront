"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Calendar, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  UserCheck,
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  ChevronsUpDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthToken } from "@/hooks/use-auth-token";
import { Appointment, ListAppointmentsQueryParams } from "@/features/appointments/types/appointments.types";
import { appointmentsService } from "@/features/appointments/services/appointments.service";
import { Patient } from "@/features/patients";
import { PatientService } from "@/features/patients";
import { HospitalStaff } from "@/features/hospital-staff";
import { HospitalStaffService } from "@/features/hospital-staff";
import CustomSelect from '@/components/ui/custom-select';

const APPOINTMENT_STATUS = {
  scheduled: { label: "Programmé", color: "bg-blue-100 text-blue-800" },
  confirmed: { label: "Confirmé", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Annulé", color: "bg-red-100 text-red-800" },
  completed: { label: "Terminé", color: "bg-gray-100 text-gray-800" },
  no_show: { label: "Non présenté", color: "bg-orange-100 text-orange-800" },
};

export default function AppointmentsPage() {
  const router = useRouter();
  const { token } = useAuthToken();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<HospitalStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortingField, setSortingField] = useState('scheduled_at');
  const [sortingOrder, setSortingOrder] = useState<'asc' | 'desc'>('desc');

  const statusFilterOptions = [
    { value: '', label: 'Tous les statuts' },
    ...Object.entries(APPOINTMENT_STATUS).map(([key, value]) => ({
      value: key,
      label: value.label
    }))
  ];

  const totalPages = Math.ceil(total / itemsPerPage);

  useEffect(() => {
    loadAppointments();
    loadPatients();
    loadDoctors();
  }, [currentPage, itemsPerPage, sortingField, sortingOrder, searchTerm, statusFilter]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const params: ListAppointmentsQueryParams = {
        page: currentPage,
        items_per_page: itemsPerPage,
        sort_by: sortingField,
        sort_order: sortingOrder,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      };

      const response = await appointmentsService.getAppointments(params, token || undefined);
      setAppointments(response.data || []);
      setTotal(response.total || 0);
    } catch (error: any) {
      console.error('Error loading appointments:', error);
      toast.error('Erreur lors du chargement des rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async () => {
    try {
      const response = await PatientService.getPatients({ limit: 50 }, token || undefined);
      setPatients(response.data || []);
    } catch (error: any) {
      console.error('Error loading patients:', error);
    }
  };

  const loadDoctors = async () => {
    try {
      const response = await HospitalStaffService.getHospitalStaff({ limit: 50 }, token || undefined);
      setDoctors(response.data || []);
    } catch (error: any) {
      console.error('Error loading doctors:', error);
    }
  };

  const handleSort = (field: string) => {
    if (sortingField === field) {
      setSortingOrder(sortingOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortingField(field);
      setSortingOrder('asc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: string) => {
    if (sortingField !== field) return <ChevronsUpDown className="h-4 w-4" />;
    return sortingOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await appointmentsService.toggleAppointmentStatus(id, token || undefined);
      toast.success('Statut du rendez-vous mis à jour');
      loadAppointments();
    } catch (error: any) {
      console.error('Error toggling appointment status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);
      
      if (currentPage > 3) {
        items.push('ellipsis');
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        items.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        items.push('ellipsis');
      }
      
      items.push(totalPages);
    }
    
    return items;
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id_ === patientId);
    return patient ? `${patient.given_name} ${patient.family_name}` : 'Patient inconnu';
  };

  const getDoctorName = (doctorId: string | null) => {
    if (!doctorId) return 'Non assigné';
    const doctor = doctors.find(d => d.id_ === doctorId);
    return doctor ? `Dr. ${doctor.matricule}` : 'Médecin inconnu';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rendez-vous</h1>
          <p className="text-muted-foreground">
            Gérer les rendez-vous des patients
          </p>
        </div>
        <Button 
          onClick={() => router.push('/appointments/add')}
          className="cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau rendez-vous
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <CustomSelect
              options={statusFilterOptions}
              value={statusFilter}
              onChange={(value) => setStatusFilter((value as string) || "")}
              placeholder="Statut"
              className="h-12"
            />
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Liste des rendez-vous ({total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Chargement...</div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">Aucun rendez-vous trouvé</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter || patientFilter || doctorFilter 
                  ? "Aucun rendez-vous ne correspond à vos critères de recherche" 
                  : "Commencez par créer un nouveau rendez-vous"}
              </p>
              <Button 
                onClick={() => router.push('/appointments/add')}
                className="cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouveau rendez-vous
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('patient_id')}
                    >
                      <div className="flex items-center gap-1">
                        Patient
                        {getSortIcon('patient_id')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('doctor_id')}
                    >
                      <div className="flex items-center gap-1">
                        Médecin
                        {getSortIcon('doctor_id')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('scheduled_at')}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        {getSortIcon('scheduled_at')}
                      </div>
                    </TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Motif</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Confirmation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        {getPatientName(appointment.patient_id)}
                      </TableCell>
                      <TableCell>
                        {getDoctorName(appointment.doctor_id)}
                      </TableCell>
                      <TableCell>
                        {formatDate(appointment.scheduled_at)}
                      </TableCell>
                      <TableCell>
                        {appointment.estimated_duration ? `${appointment.estimated_duration} min` : '-'}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {appointment.reason || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={APPOINTMENT_STATUS[appointment.status as keyof typeof APPOINTMENT_STATUS]?.color || 'bg-gray-100 text-gray-800'}>
                          {APPOINTMENT_STATUS[appointment.status as keyof typeof APPOINTMENT_STATUS]?.label || appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={appointment.is_confirmed_by_patient ? "default" : "secondary"}>
                          {appointment.is_confirmed_by_patient ? "Confirmé" : "En attente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Ouvrir le menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => {
                                // TODO: Implémenter modal voir
                                console.log('Voir rendez-vous:', appointment.id);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => {
                                // TODO: Implémenter modal modifier
                                console.log('Modifier rendez-vous:', appointment.id);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handleToggleStatus(appointment.id)}
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              {appointment.is_active ? 'Désactiver' : 'Activer'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-600"
                              onClick={() => {
                                // TODO: Implémenter modal supprimer
                                console.log('Supprimer rendez-vous:', appointment.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <p className="text-md text-muted-foreground">
                    Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, total)} sur {total} résultats
                  </p>
                  <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={itemsPerPage.toString()} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[10, 20, 30, 40, 50].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 flex justify-end">
                  <Pagination className="justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {getPaginationItems().map((item, index) => (
                        <PaginationItem key={index}>
                          {item === 'ellipsis' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              onClick={() => setCurrentPage(item as number)}
                              className={currentPage === item ? "cursor-pointer" : "cursor-pointer"}
                              isActive={currentPage === item}
                            >
                              {item}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
