"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/ui/custom-select";
import { PhoneInput } from "@/components/ui/phone-input";
import { ArrowLeft, Building, User, Phone, MapPin, Users } from "lucide-react";
import { CreateHealthFacilityRequest, AdminUser, FacilityType, HealthcareLevel } from "@/features/health-facilities/types/health-facility.types";
import { HealthFacilityService } from "@/features/health-facilities/services/health-facility.service";
import { UserService } from "@/features/users/services/user.service";
import { getFacilityTypeOptions, getHealthcareLevelOptions } from "@/features/health-facilities/utils/health-facility.utils";
import LocationService from "@/features/location/services/location.service";
import { getDepartmentOptions, getCityOptions, getCountryOptions } from "@/features/location/utils/location.utils";
import { Country, Department, City } from "@/features/location/types/location.types";
import { useAuthToken } from "@/hooks/use-auth-token";
import { toast } from "sonner";
import Link from "next/link";

export default function AddHealthFacilityPage() {
  const router = useRouter();
  const { token } = useAuthToken();
  const [loading, setLoading] = useState(false);
  const [adminMode, setAdminMode] = useState<'create' | 'select'>('select');
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Options pour le type d'établissement
  const facilityTypeOptions = [
    { value: "university_hospital", label: "Hôpital universitaire" },
    { value: "departmental_hospital", label: "Hôpital départemental" },
    { value: "zone_hospital", label: "Hôpital de zone" },
    { value: "health_center", label: "Centre de santé" },
    { value: "dispensary", label: "Dispensaire" },
    { value: "private_clinic", label: "Clinique privée" },
  ];

  // Options pour les utilisateurs disponibles
  const userOptions = availableUsers.map((user) => ({
    value: user.id_,
    label: `${user.given_name} ${user.family_name} (${user.health_id})`
  }));

  const [formData, setFormData] = useState<CreateHealthFacilityRequest>({
    name: "",
    code: "",
    facility_type: FacilityType.HEALTH_CENTER,
    healthcare_level: HealthcareLevel.PRIMARY,
    region: "", // Ville
    district: "", // Département
    health_zone: "",
    country_code: "BJ", // Ajout du pays
    department_code: "", // Code du département (relié à district)
    city_code: "", // Code de la ville (relié à region)
    snis_code: null,
    tax_id: null,
    authorization_decree_number: null,
    authorization_decree_date: null,
    commune_code: null,
    latitude: null,
    longitude: null,
    phone: null,
    admin_user_id: null,
    admin_user: null,
    is_active: true,
  });

  const [adminUserData, setAdminUserData] = useState<AdminUser>({
    given_name: "",
    family_name: "",
    health_id: "",
    password: "",
    roles: ["user"],
  });

  // Charger les données de localisation (Bénin par défaut)
  useEffect(() => {
    const loadLocationData = async () => {
      try {
        const locationData = await LocationService.fetchLocationData('BJ');
        setCountries(locationData.countries);
        setDepartments(locationData.departments);
        setCities(locationData.cities);
        setFilteredCities(locationData.cities); // Initialiser avec toutes les villes
        
        // Set default country (Bénin)
        const benin = locationData.countries.find(c => c.country_code === 'BJ');
        if (benin) {
          setSelectedCountry(benin);
          setFormData(prev => ({
            ...prev,
            country_code: benin.country_code
          }));
        }
      } catch (error) {
        console.error('Error loading location data:', error);
        toast.error('Erreur lors du chargement des données de localisation');
      }
    };

    loadLocationData();
  }, []);

  // Handler pour le changement de pays
  const handleCountryChange = async (country: Country) => {
    setSelectedCountry(country);
    setFormData(prev => ({
      ...prev,
      country_code: country.country_code
    }));
    
    // Charger les départements et villes du nouveau pays
    try {
      const [newDepartments, newCities] = await Promise.all([
        LocationService.fetchDepartments(country.country_code),
        LocationService.fetchCities(country.country_code)
      ]);
      
      setDepartments(newDepartments);
      setCities(newCities);
      setFilteredCities(newCities); // Réinitialiser avec toutes les villes du nouveau pays
      
      // Réinitialiser les sélections
      setFormData(prev => ({
        ...prev,
        district: "",
        department_code: "",
        region: "",
        city_code: ""
      }));
    } catch (error) {
      console.error('Error loading country data:', error);
      toast.error('Erreur lors du chargement des données du pays');
    }
  };

  // Handler pour synchroniser district et department_code
  const handleDistrictChange = (value: string) => {
    const dept = departments.find(d => d.name === value);
    const deptCode = dept?.code || "";
    
    setFormData(prev => ({
      ...prev,
      district: value,
      department_code: deptCode,
      region: "", // Réinitialiser la ville
      city_code: "" // Réinitialiser le code ville
    }));
    
    // Filtrer les villes par département
    if (deptCode) {
      const deptCities = cities.filter(city => city.state_code === deptCode);
      setFilteredCities(deptCities); // Mettre à jour les villes filtrées
    } else {
      setFilteredCities(cities); // Si pas de département, montrer toutes les villes
    }
  };

  // Handler pour synchroniser region et city_code
  const handleRegionChange = (value: string) => {
    const city = filteredCities.find(c => c.name === value); // Chercher dans les villes filtrées
    setFormData(prev => ({
      ...prev,
      region: value,
      city_code: city?.code || "",
      health_zone: value // Injecter automatiquement le nom de la ville dans zone sanitaire
    }));
  };

  // Obtenir les villes filtrées par département
  const getFilteredCities = () => {
    return filteredCities;
  };

  // Charger la liste des utilisateurs disponibles
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await UserService.getUsers({
          limit: 100,
          is_active: true
        }, token || undefined);
        setAvailableUsers(response.data || []);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    if (token) {
      loadUsers();
    }
  }, [token]);

  const handleInputChange = (field: string, value: string | boolean | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdminUserChange = (field: string, value: string | string[]) => {
    setAdminUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation : un admin est obligatoire
      if (adminMode === 'select' && !formData.admin_user_id) {
        toast.error("Veuillez sélectionner un administrateur existant");
        setLoading(false);
        return;
      }

      if (adminMode === 'create' && !adminUserData.given_name && !adminUserData.family_name) {
        toast.error("Veuillez remplir les informations de l'administrateur");
        setLoading(false);
        return;
      }

      const submitData: CreateHealthFacilityRequest = {
        ...formData,
        admin_user: adminMode === 'create' ? adminUserData : null,
        admin_user_id: adminMode === 'select' ? formData.admin_user_id : null,
      };

      await HealthFacilityService.createHealthFacility(submitData, token || undefined);
      toast.success("Établissement de santé créé avec succès");
      router.push("/health-facilities");
    } catch (error) {
      console.error('Error creating health facility:', error);
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue lors de la création de l\'établissement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/health-facilities">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Ajouter un établissement de santé</h1>
          <p className="text-muted-foreground">
            Créez un nouvel hôpital, centre de santé ou dispensaire
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informations générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'établissement <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Hôpital Central de..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code <span className="text-red-500">*</span></Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  placeholder="HC001"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facility_type">Type d'établissement <span className="text-red-500">*</span></Label>
                <CustomSelect
                  options={getFacilityTypeOptions()}
                  value={formData.facility_type}
                  onChange={(value) => handleInputChange("facility_type", value as FacilityType)}
                  placeholder="Sélectionner un type d'établissement"
                  height="h-12"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="healthcare_level">Niveau sanitaire <span className="text-red-500">*</span></Label>
                <CustomSelect
                  options={getHealthcareLevelOptions()}
                  value={formData.healthcare_level}
                  onChange={(value) => handleInputChange("healthcare_level", value as HealthcareLevel)}
                  placeholder="Sélectionner un niveau sanitaire"
                  height="h-12"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Pays <span className="text-red-500">*</span></Label>
                <CustomSelect
                  options={getCountryOptions(countries)}
                  value={selectedCountry?.country_code || ''}
                  onChange={(value) => {
                    const country = countries.find(c => c.country_code === value);
                    if (country) handleCountryChange(country);
                  }}
                  placeholder="Sélectionner un pays"
                  height="h-12"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">Département <span className="text-red-500">*</span></Label>
                <CustomSelect
                  options={getDepartmentOptions(departments)}
                  value={formData.district}
                  onChange={(value) => handleDistrictChange(value || '')}
                  placeholder="Sélectionner un département"
                  height="h-12"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Ville <span className="text-red-500">*</span></Label>
                <CustomSelect
                  options={getCityOptions(getFilteredCities())}
                  value={formData.region}
                  onChange={(value) => handleRegionChange(value || '')}
                  placeholder="Sélectionner une ville"
                  height="h-12"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone <span className="text-red-500">*</span></Label>
              <div className="flex">
                <div className="flex items-center px-3 py-2 border border-r-0 border-input bg-muted text-muted-foreground rounded-l-md">
                  {selectedCountry?.phone_prefix || '+...'}
                </div>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone && selectedCountry ? 
                    formData.phone.startsWith(selectedCountry.phone_prefix) ? 
                      formData.phone.substring(selectedCountry.phone_prefix.length) : 
                      formData.phone.replace(/\D/g, '') : 
                    formData.phone || ""}
                  onChange={(e) => {
                    const cleanPhone = e.target.value.replace(/\D/g, '');
                    const fullPhone = selectedCountry ? selectedCountry.phone_prefix + cleanPhone : cleanPhone;
                    handleInputChange("phone", fullPhone);
                  }}
                  placeholder="xxx xxx xxx"
                  disabled={!selectedCountry}
                  className="rounded-l-none"
                />
              </div>
              {selectedCountry && (
                <p className="text-xs text-muted-foreground">
                  {selectedCountry.phone_prefix} xxx xxx xxx ({selectedCountry.national_length} chiffres)
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="health_zone">Zone sanitaire</Label>
                <Input
                  id="health_zone"
                  value={formData.health_zone || ""}
                  onChange={(e) => handleInputChange("health_zone", e.target.value || null)}
                  placeholder="Zone sanitaire"
                />
              </div>
            </div>

            
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Informations supplémentaires
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="snis_code">Code SNIS</Label>
                <Input
                  id="snis_code"
                  value={formData.snis_code || ""}
                  onChange={(e) => handleInputChange("snis_code", e.target.value || null)}
                  placeholder="Code SNIS"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax_id">ID Fiscal</Label>
                <Input
                  id="tax_id"
                  value={formData.tax_id || ""}
                  onChange={(e) => handleInputChange("tax_id", e.target.value || null)}
                  placeholder="ID Fiscal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="authorization_decree_number">Numéro d'arrêté d'autorisation</Label>
                <Input
                  id="authorization_decree_number"
                  value={formData.authorization_decree_number || ""}
                  onChange={(e) => handleInputChange("authorization_decree_number", e.target.value || null)}
                  placeholder="Numéro d'arrêté"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorization_decree_date">Date d'arrêté d'autorisation</Label>
                <Input
                  id="authorization_decree_date"
                  type="date"
                  value={formData.authorization_decree_date || ""}
                  onChange={(e) => handleInputChange("authorization_decree_date", e.target.value || null)}
                  placeholder="Date d'arrêté"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commune_code">Code de la commune</Label>
                <Input
                  id="commune_code"
                  value={formData.commune_code || ""}
                  onChange={(e) => handleInputChange("commune_code", e.target.value || null)}
                  placeholder="Code de la commune"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude?.toString() || ""}
                  onChange={(e) => handleInputChange("latitude", e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="6.123456"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude?.toString() || ""}
                  onChange={(e) => handleInputChange("longitude", e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="2.123456"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Administrateur de l'établissement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Label className="text-base font-medium">Choix de l'administrateur <span className="text-red-500">*</span></Label>
              
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="adminMode"
                    checked={adminMode === 'select'}
                    onChange={() => setAdminMode('select')}
                    className="text-blue-600"
                  />
                  <span>Sélectionner un utilisateur existant</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="adminMode"
                    checked={adminMode === 'create'}
                    onChange={() => setAdminMode('create')}
                    className="text-blue-600"
                  />
                  <span>Créer un nouvel administrateur</span>
                </label>
              </div>
            </div>

            {adminMode === 'select' && (
              <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="admin_user_id">Utilisateur existant <span className="text-red-500">*</span></Label>
                  <CustomSelect
                    options={userOptions}
                    value={formData.admin_user_id}
                    onChange={(value) => handleInputChange("admin_user_id", value as string | null)}
                    placeholder="Sélectionner un utilisateur"
                    height="h-12"
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {adminMode === 'create' && (
              <div className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin_given_name">Prénom de l'administrateur <span className="text-red-500">*</span></Label>
                    <Input
                      id="admin_given_name"
                      value={adminUserData.given_name}
                      onChange={(e) => handleAdminUserChange("given_name", e.target.value)}
                      placeholder="Jean"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin_family_name">Nom de l'administrateur <span className="text-red-500">*</span></Label>
                    <Input
                      id="admin_family_name"
                      value={adminUserData.family_name}
                      onChange={(e) => handleAdminUserChange("family_name", e.target.value)}
                      placeholder="Dupont"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin_health_id">ID Santé <span className="text-red-500">*</span></Label>
                    <Input
                      id="admin_health_id"
                      value={adminUserData.health_id}
                      onChange={(e) => handleAdminUserChange("health_id", e.target.value)}
                      placeholder="TG123456"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin_password">Mot de passe <span className="text-red-500">*</span></Label>
                    <Input
                      id="admin_password"
                      type="password"
                      value={adminUserData.password}
                      onChange={(e) => handleAdminUserChange("password", e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/health-facilities">
            <Button variant="outline" type="button" className="cursor-pointer">
              Annuler
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="cursor-pointer">
            {loading ? "Création en cours..." : "Créer l'établissement"}
          </Button>
        </div>
      </form>
    </div>
  );
}
