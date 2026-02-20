"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import CustomSelect from "@/components/ui/custom-select";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Activity, 
  DollarSign,
  CheckCircle,
  AlertTriangle,
  ChevronsUpDown,
  Eye,
  MoreHorizontal,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Consultation, ListConsultationsQM, ListConsultationsQueryParams } from "@/features/consultations";
import { ConsultationService } from "@/features/consultations";
import { useAuthToken } from "@/hooks/use-auth-token";
import { usePermissions } from "@/hooks/use-permissions";
import { 
  getConsultationStatusLabel, 
  getConsultationStatusBadge, 
  getConsultationStatusOptions,
  formatVitalSigns,
  formatAmount,
  canDeleteConsultation,
  canRestoreConsultation
} from "@/features/consultations";
import { toast } from "sonner";
import Link from "next/link";
import { DataPagination } from "@/components/ui/data-pagination";
import { useRouter } from "next/navigation";

export default function ConsultationsPage() {
  const router = useRouter();
  const [consultationsData, setConsultationsData] = useState<ListConsultationsQM | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [sortingField, setSortingField] = useState('chief_complaint');
  const [sortingOrder, setSortingOrder] = useState<'asc' | 'desc'>('desc');
  const { token } = useAuthToken();
  const { canAccess } = usePermissions();

  // États pour les modals
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsDeleteModalOpen(true);
  };

  const handleViewConsultation = (consultation: Consultation) => {
    router.push(`/consultations/${consultation.id_}`);
  };

  const handleEditConsultation = (consultation: Consultation) => {
    router.push(`/consultations/${consultation.id_}/edit`);
  };

  const handleConsultationDeleted = async (consultation: Consultation) => {
    try {
      await ConsultationService.deleteConsultation(consultation.id_);
      
      if (consultationsData) {
        setConsultationsData({
          ...consultationsData,
          data: consultationsData.data.map(c =>
            c.id_ === consultation.id_ ? { 
              ...c,
              deleted_at: new Date().toISOString(),
              is_active: false,
              patient_full_name: consultation.patient_full_name || c.patient_full_name,
              consulted_by_full_name: consultation.consulted_by_full_name || c.consulted_by_full_name
            } : c
          )
        });
      }
      
      toast.success('Consultation supprimée avec succès');
    } catch (error) {
      console.error('Error deleting consultation:', error);
      toast.error('Erreur lors de la suppression de la consultation');
    }
  };

  const handleConsultationRestored = async (consultation: Consultation) => {
    try {
      const restoredConsultation = await ConsultationService.restoreConsultation(consultation.id_);
      
      // Mettre à jour l'état localement immédiatement
      if (consultationsData) {
        setConsultationsData({
          ...consultationsData,
          data: consultationsData.data.map(c =>
            c.id_ === consultation.id_ ? { 
              ...c,
              deleted_at: undefined,
              ...(restoredConsultation && typeof restoredConsultation === 'object' ? restoredConsultation : {}),
              patient_full_name: consultation.patient_full_name || restoredConsultation?.patient_full_name,
              consulted_by_full_name: consultation.consulted_by_full_name || restoredConsultation?.consulted_by_full_name
            } : c
          )
        });
      }
      
      toast.success('Consultation restaurée avec succès');
    } catch (error) {
      console.error('Error restoring consultation:', error);
      toast.error('Erreur lors de la restauration de la consultation');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const updatedConsultation = await ConsultationService.toggleConsultationStatus(id, token || undefined);
      
      if (updatedConsultation && typeof updatedConsultation.is_active === 'boolean') {
        // Mettre à jour l'état localement sans recharger toute la liste
        if (consultationsData) {
          setConsultationsData({
            ...consultationsData,
            data: consultationsData.data.map(consultation => 
              consultation.id_ === id ? { 
                ...updatedConsultation, 
                id_: consultation.id_,
                patient_full_name: consultation.patient_full_name || updatedConsultation.patient_full_name,
                consulted_by_full_name: consultation.consulted_by_full_name || updatedConsultation.consulted_by_full_name
              } : consultation
            )
          });
        }
        
        toast.success(`Consultation ${updatedConsultation.is_active ? 'activée' : 'désactivée'} avec succès`);
      }
    } catch (error: any) {
      console.error('Error toggling consultation status:', error);
      toast.error(error.message || "Erreur lors du changement de statut");
    }
  };

  const handlePermanentlyDeleted = async (consultation: Consultation) => {
    try {
      await ConsultationService.permanentlyDeleteConsultation(consultation.id_);
      
      // Retirer de la liste
      if (consultationsData) {
        setConsultationsData({
          ...consultationsData,
          data: consultationsData.data.filter(c => c.id_ !== consultation.id_),
          total: consultationsData.total - 1
        });
      }
      
      toast.success('Consultation supprimée définitivement');
    } catch (error) {
      console.error('Error permanently deleting consultation:', error);
      toast.error('Erreur lors de la suppression définitive de la consultation');
    }
  };

  const loadConsultations = async () => {
    try {
      setLoading(true);
      setError(null);

      const offset = (currentPage - 1) * itemsPerPage;

      const params: ListConsultationsQueryParams = {
        limit: itemsPerPage,
        offset,
        sort_by: sortingField as any,
        sort_order: sortingOrder,
      };

      // Ajouter les filtres de recherche
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus as any;

      const data = await ConsultationService.getConsultations(params);
      setConsultationsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadConsultations();
    } else {
      setLoading(false);
      setError('Token d\'authentification manquant');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadConsultations();
    }
  }, [currentPage, itemsPerPage, search, filterStatus, sortingField, sortingOrder, token]);

  // Gestion du tri
  const handleSort = (field: string) => {
    if (sortingField === field) {
      // Même champ : inverser l'ordre
      setSortingOrder(sortingOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Nouveau champ : réinitialiser à asc
      setSortingField(field);
      setSortingOrder('asc');
    }
    setCurrentPage(1); // Revenir à la première page
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

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  // Reset page 1 quand le nombre d'éléments par page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const totalPages = consultationsData ? Math.ceil(consultationsData.total / itemsPerPage) : 0;
  const consultations = consultationsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consultations</h1>
          <p className="text-muted-foreground">
            Gérer les consultations médicales et les dossiers patients.
          </p>
        </div>
        {canAccess('consultations', 'create') && (
          <Link href="/consultations/add">
            <Button className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle consultation
            </Button>
          </Link>
        )}
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recherche</label>
              <input
                type="text"
                placeholder="Rechercher une consultation..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <CustomSelect
                value={filterStatus}
                onChange={(value: string | string[] | null) => handleFilterChange(value as string)}
                options={[
                  { value: '', label: 'Tous les statuts' },
                  ...getConsultationStatusOptions()
                ]}
                placeholder="Sélectionner un statut"
                className="w-full"
              />
            </div>
            <div className="space-y-2 flex items-end">
              <Button onClick={() => {
                setSearch('');
                setFilterStatus('');
                setCurrentPage(1);
              }} className="w-full">
                Effacer les filtres
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des consultations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Liste des consultations ({consultationsData?.total || 0})
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
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-lg text-red-600">{error}</div>
            </div>
          ) : !loading && !error && consultations.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Aucune consultation trouvée.
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
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('patient_full_name')}
                    >
                      <div className="flex items-center gap-2">
                        Patient
                        {getSortIcon('patient_full_name')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('consulted_by_full_name')}
                    >
                      <div className="flex items-center gap-2">
                        Médecin
                        {getSortIcon('consulted_by_full_name')}
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
                    <TableHead>Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultations.map((consultation) => {
                    const statusBadge = getConsultationStatusBadge(consultation.status);
                    const isDeleted = consultation.deleted_at != null && consultation.deleted_at !== undefined && consultation.deleted_at !== '';
                    console.log('Debug - Consultation ID:', consultation.id_, 'deleted_at:', consultation.deleted_at, 'isDeleted:', isDeleted, 'typeof deleted_at:', typeof consultation.deleted_at);
                    return (
                      <TableRow key={consultation.id_} className={isDeleted ? 'opacity-60' : ''}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="max-w-xs truncate" title={consultation.patient_full_name || consultation.patient_id}>
                              {consultation.patient_full_name || consultation.patient_id}
                            </div>
                            {isDeleted && (
                              <Badge variant="secondary" className="text-xs">
                                Supprimé
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={consultation.consulted_by_full_name || 'Non assigné'}>
                            {consultation.consulted_by_full_name || 'Non assigné'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={statusBadge.variant as "default" | "secondary" | "destructive" | "outline"}
                              className={statusBadge.className}
                            >
                              {getConsultationStatusLabel(consultation.status)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm max-w-xs truncate" title={formatVitalSigns(consultation.vital_signs)}>
                            {formatVitalSigns(consultation.vital_signs)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm max-w-xs truncate" title={consultation.diagnosis || 'Non défini'}>
                            {consultation.diagnosis || 'Non défini'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{formatAmount(consultation.amount_paid)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {canAccess('consultations', 'toggle') && !isDeleted ? (
                            <Switch 
                              checked={consultation.is_active}
                              onCheckedChange={() => handleToggleStatus(consultation.id_)}
                              className="data-[state=checked]:bg-green-500"
                            />
                          ) : (
                            <Badge variant={consultation.is_active ? "default" : "secondary"}>
                              {consultation.is_active ? 'Oui' : 'Non'}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="cursor-pointer">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/consultations/${consultation.id_}`} className="cursor-pointer">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Voir
                                </Link>
                              </DropdownMenuItem>
                              {!isDeleted && (
                                <DropdownMenuItem asChild>
                                  <Link href={`/consultations/${consultation.id_}/edit`} className="cursor-pointer">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {!isDeleted && canDeleteConsultation(consultation) && (
                                <DropdownMenuItem 
                                  className="cursor-pointer text-red-600"
                                  onClick={() => handleConsultationDeleted(consultation)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Supprimer
                                </DropdownMenuItem>
                              )}
                              {isDeleted && canRestoreConsultation(consultation) && (
                                <DropdownMenuItem 
                                  className="cursor-pointer"
                                  onClick={() => handleConsultationRestored(consultation)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Restaurer
                                </DropdownMenuItem>
                              )}
                              {isDeleted && (
                                <DropdownMenuItem 
                                  className="cursor-pointer text-red-600"
                                  onClick={() => handlePermanentlyDeleted(consultation)}
                                >
                                  <AlertTriangle className="h-4 w-4 mr-2" />
                                  Supprimer définitivement
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              <DataPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={consultationsData?.total || 0}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedConsultation && isDeleteModalOpen && (
        <>
          {/* TODO: Ajouter modal de suppression quand il sera créé */}
        </>
      )}
    </div>
  );
}
