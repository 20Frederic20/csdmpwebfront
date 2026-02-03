"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter, Building } from "lucide-react";
import { HealthFacility } from "@/features/health-facilities/types/health-facility.types";
import { HealthFacilityService } from "@/features/health-facilities/services/health-facility.service";
import { formatFacilityType, getFacilityTypeBadge, formatHealthFacilityStatus, getHealthFacilityStatusBadge } from "@/features/health-facilities/utils/health-facility.utils";
import { useAuthToken } from "@/hooks/use-auth-token";
import { toast } from "sonner";

export default function HealthFacilitiesPage() {
  const [facilities, setFacilities] = useState<HealthFacility[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [total, setTotal] = useState(0);
  const { token } = useAuthToken();

  const loadFacilities = async () => {
    setLoading(true);
    try {
      const response = await HealthFacilityService.getHealthFacilities({
        search: searchTerm || undefined,
        limit: 50,
        offset: 0,
      }, token || undefined);
      
      setFacilities(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Error loading health facilities:', error);
      toast.error('Erreur lors du chargement des établissements de santé');
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacilities();
  }, [searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Établissements de santé</h1>
          <p className="text-muted-foreground">
            Gérez les hôpitaux, cliniques, pharmacies et autres établissements de santé
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un établissement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Liste des établissements ({total})
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un établissement..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chargement des établissements...</p>
            </div>
          ) : facilities.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? 'Aucun établissement trouvé pour cette recherche.' 
                  : 'Aucun établissement de santé enregistré.'
                }
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter le premier établissement
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facilities.map((facility) => (
                  <TableRow key={facility.id}>
                    <TableCell className="font-medium">{facility.name}</TableCell>
                    <TableCell>
                      <Badge variant={getFacilityTypeBadge(facility.facility_type).variant as "default" | "secondary" | "destructive" | "outline"}>
                        {getFacilityTypeBadge(facility.facility_type).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getHealthFacilityStatusBadge(facility.is_active).variant as "default" | "secondary" | "destructive" | "outline"}>
                        {getHealthFacilityStatusBadge(facility.is_active).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {facility.district && facility.region 
                        ? `${facility.district}, ${facility.region}`
                        : facility.district || facility.region || '—'
                      }
                    </TableCell>
                    <TableCell>
                      {facility.phone || '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Modifier
                        </Button>
                        <Button variant="outline" size="sm">
                          Voir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
