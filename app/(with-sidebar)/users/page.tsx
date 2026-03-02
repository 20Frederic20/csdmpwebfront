"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter, Users, Shield, UserCheck, MoreHorizontal, Edit, Trash2, Eye, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { User, ListUsersQueryParams } from "@/features/users/types/user.types";
import { UserService } from "@/features/users/services/user.service";
import { useAuthToken } from "@/hooks/use-auth-token";
import { formatUserRoles, getPrimaryRole, getUserRoleBadge, getUserStatusBadge, getUserFullName, getUserInitials } from "@/features/users/utils/user.utils";
import { AddUserModal } from "@/features/users/components/add-user-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const [sortingField, setSortingField] = useState('family_name');
  const [sortingOrder, setSortingOrder] = useState<'asc' | 'desc'>('asc');
  const { token } = useAuthToken();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const params: ListUsersQueryParams = {
        search: searchTerm || undefined,
        limit: itemsPerPage,
        offset,
        sort_by: sortingField,
        sort_order: sortingOrder,
      };

      const response = await UserService.getUsers(params, token || undefined);
      setUsers(response.data || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, itemsPerPage, searchTerm, sortingField, sortingOrder]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Revenir à la première page lors de la recherche
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1); // Revenir à la première page lors du changement d'items par page
  };

  // Gérer le tri
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

  const totalPages = Math.ceil(total / itemsPerPage);

  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      if (start > 1) {
        items.push(1);
        if (start > 2) items.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        items.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) items.push('...');
        items.push(totalPages);
      }
    }
    
    return items;
  };

  const handleUserAdded = () => {
    loadUsers();
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await UserService.toggleUserStatus(userId, !currentStatus, token || undefined);
      toast.success(`Utilisateur ${!currentStatus ? 'activé' : 'désactivé'} avec succès`);
      loadUsers(); // Recharger la liste
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Erreur lors du changement de statut');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await UserService.deleteUser(userId, token || undefined);
      toast.success('Utilisateur supprimé avec succès');
      loadUsers(); // Recharger la liste
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les utilisateurs du système et leurs permissions.
          </p>
        </div>
        <AddUserModal onUserAdded={handleUserAdded} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Liste des utilisateurs
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="cursor-pointer">
                <Filter className="mr-2 h-4 w-4" />
                Filtrer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chargement des utilisateurs...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? 'Aucun utilisateur trouvé pour cette recherche.' 
                  : 'Aucun utilisateur enregistré.'
                }
              </p>
              <Link href="/users/add">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter le premier utilisateur
                </Button>
              </Link>
              <AddUserModal onUserAdded={handleUserAdded} />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('family_name')}
                    >
                      <div className="flex items-center gap-2">
                        Utilisateur
                        {getSortIcon('family_name')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('health_id')}
                    >
                      <div className="flex items-center gap-2">
                        ID Santé
                        {getSortIcon('health_id')}
                      </div>
                    </TableHead>
                    <TableHead>Rôles</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort('is_active')}
                    >
                      <div className="flex items-center gap-2">
                        Statut
                        {getSortIcon('is_active')}
                      </div>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const primaryRole = getPrimaryRole(user.roles);
                    const roleBadge = primaryRole ? getUserRoleBadge(primaryRole) : null;
                    const statusBadge = getUserStatusBadge(user.is_active);
                    const fullName = getUserFullName(user.given_name, user.family_name);
                    const initials = getUserInitials(user.given_name, user.family_name);
                    
                    return (
                      <TableRow key={user.id_}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-md font-medium">
                              {initials}
                            </div>
                            <div>
                              <div className="font-medium">{fullName}</div>
                              <div className="text-md text-muted-foreground">{user.id_}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-md">{user.health_id}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {roleBadge && (
                              <Badge variant={roleBadge.variant as "default" | "secondary" | "destructive" | "outline"}>
                                {roleBadge.label}
                              </Badge>
                            )}
                            {user.roles.length > 1 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.roles.length - 1}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadge.variant}>
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="cursor-pointer">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href={`/users/${user.id_}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Voir
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href={`/users/${user.id_}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleToggleStatus(user.id_, user.is_active)}
                                className="cursor-pointer"
                              >
                                <UserCheck className="h-4 w-4 mr-2" />
                                {user.is_active ? 'Désactiver' : 'Activer'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUser(user.id_)}
                                className="text-red-600 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50 cursor-pointer' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {getPaginationItems().map((item, index) => (
                        <PaginationItem key={index}>
                          {item === 'ellipsis' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              onClick={() => setCurrentPage(item as number)}
                              isActive={currentPage === item}
                              className="cursor-pointer"
                            >
                              {item}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50 cursor-pointer' : 'cursor-pointer'}
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
