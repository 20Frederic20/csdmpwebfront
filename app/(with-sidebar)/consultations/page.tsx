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
import { 
  Plus, 
  Activity, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  UserCheck,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  DollarSign,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Consultation, ListConsultationsQueryParams } from "@/features/consultations";
import { ConsultationService } from "@/features/consultations";
import { useAuthToken } from "@/hooks/use-auth-token";
import { 
  getConsultationStatusLabel, 
  getConsultationStatusBadge, 
  getConsultationStatusOptions,
  formatVitalSigns,
  formatAmount
} from "@/features/consultations";
import { toast } from "sonner";
import Link from "next/link";

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [sortingField, setSortingField] = useState('id');
  const [sortingOrder, setSortingOrder] = useState<'asc' | 'desc'>('desc');
  const { token } = useAuthToken();

  const loadConsultations = async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const params: ListConsultationsQueryParams = {
        limit: itemsPerPage,
        offset,
        sort_by: sortingField,
        sort_order: sortingOrder,
      };

      const response = await ConsultationService.getConsultations(params, token || undefined);
      setConsultations(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Error loading consultations:', error);
      toast.error('Erreur lors du chargement des consultations');
      setConsultations([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, [currentPage, itemsPerPage, sortingField, sortingOrder]);

  const handleSort = (field: string) => {
    if (sortingField === field) {
      setSortingOrder(sortingOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortingField(field);
      setSortingOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // Obtenir l'icône de tri pour un champ
  const getSortIcon = (field: string) => {
    if (sortingField !== field) {
      return <ChevronsUpDown className="h-4 w-4" />;
    }
    return sortingOrder === 'asc' 
      ? <ChevronUp className="h-4 w-4" />
      : <ChevronDown className="h-4 w-4" />;
  };

  const handleConsultationUpdated = () => {
    loadConsultations();
  };

  const handleConsultationDeleted = () => {
    loadConsultations();
  };

  const handleToggleStatus = async (consultationId: string, currentStatus: boolean) => {
    try {
      await ConsultationService.toggleConsultationStatus(consultationId, token || undefined);
      toast.success(`Consultation ${currentStatus ? 'désactivée' : 'activée'} avec succès`);
      loadConsultations();
    } catch (error) {
      console.error('Error toggling consultation status:', error);
      toast.error('Erreur lors du changement de statut');
    }
  };

  // Fonction pour obtenir l'icône de statut
  const getStatusIcon = (status: Consultation['status']) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Calcul de pagination
  const totalPages = Math.ceil(total / itemsPerPage);
  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          items.push(i);
        }
        items.push('ellipsis');
        items.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        items.push(1);
        items.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push(i);
        }
      } else {
        items.push(1);
        items.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(i);
        }
        items.push('ellipsis');
        items.push(totalPages);
      }
    }
    
    return items;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consultations</h1>
          <p className="text-muted-foreground">
            Gérer les consultations médicales
          </p>
        </div>
        <Link href="/consultations/add">
          <Button className="cursor-pointer h-12">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle consultation
          </Button>
        </Link>
      </div>

      {/* Tableau des consultations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Liste des consultations ({total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Chargement des consultations...</p>
              </div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('patient_id')}
                    >
                      <div className="flex items-center gap-2">
                        Patient
                        {getSortIcon('patient_id')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('chief_complaint')}
                    >
                      <div className="flex items-center gap-2">
                        Motif principal
                        {getSortIcon('chief_complaint')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        Statut
                        {getSortIcon('status')}
                      </div>
                    </TableHead>
                    <TableHead>Signes vitaux</TableHead>
                    <TableHead>Diagnostic</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Confidentialité</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="text-center">
                          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">
                            Aucune consultation enregistrée.
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Commencez par créer la première consultation.
                          </p>
                          <Link href="/consultations/add">
                            <Button>
                              <Plus className="h-4 w-4 mr-2" />
                              Créer la première consultation
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    consultations.map((consultation) => {
                      const statusBadge = getConsultationStatusBadge(consultation.status);
                      return (
                        <TableRow key={consultation.id_}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-md font-medium">
                                {consultation.patient_id?.substring(0, 2).toUpperCase() || 'PT'}
                              </div>
                              <div>
                                <div className="font-medium">{consultation.patient_id}</div>
                                <div className="text-md text-muted-foreground">ID: {consultation.id_}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate" title={consultation.chief_complaint}>
                              {consultation.chief_complaint}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(consultation.status)}
                              <Badge 
                                variant={statusBadge.variant as "default" | "secondary" | "destructive" | "outline"}
                                className={statusBadge.className}
                              >
                                {getConsultationStatusLabel(consultation.status)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-md max-w-xs truncate" title={formatVitalSigns(consultation.vital_signs)}>
                              {formatVitalSigns(consultation.vital_signs)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-md max-w-xs truncate" title={consultation.diagnosis || 'Non défini'}>
                              {consultation.diagnosis || 'Non défini'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-md">{formatAmount(consultation.amount_paid)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {consultation.is_confidential && (
                                <Shield className="h-4 w-4 text-red-500" />
                              )}
                              <Badge 
                                variant={consultation.is_confidential ? "destructive" : "outline"}
                                className={consultation.is_confidential ? "bg-red-100 text-red-800" : ""}
                              >
                                {consultation.is_confidential ? 'Confidentiel' : 'Normal'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="cursor-pointer">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  className="cursor-pointer"
                                  onClick={() => {
                                    // TODO: Implémenter modal voir
                                    console.log('Voir consultation:', consultation.id_);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Voir
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="cursor-pointer"
                                  onClick={() => {
                                    // TODO: Implémenter modal modifier
                                    console.log('Modifier consultation:', consultation.id_);
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="cursor-pointer"
                                  onClick={() => handleToggleStatus(consultation.id_, consultation.is_active)}
                                >
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  {consultation.is_active ? 'Désactiver' : 'Activer'}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="cursor-pointer text-red-600"
                                  onClick={() => {
                                    // TODO: Implémenter modal supprimer
                                    console.log('Supprimer consultation:', consultation.id_);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
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
