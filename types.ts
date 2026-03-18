export interface Record {
  id: string;
  date: string;
  type: string;
  doctor: string;
  notes: string;
  results?: boolean;
}

export interface Patient {
  id: string;
  name: string;
  status: string;
  lastVisit: string;
  age: number;
  bloodType: string;
  allergies: string[];
  records: Record[];
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  status: string;
}

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "PT-2849",
    name: "Jean Dupont",
    status: "Stable",
    lastVisit: "12 Mars 2026",
    age: 45,
    bloodType: "A+",
    allergies: ["Pénicilline", "Arachides"],
    records: [
      {
        id: "REC-001",
        date: "12 Mars 2026",
        type: "Consultation",
        doctor: "Dr. Aris",
        notes: "Suivi post-opératoire. Cicatrisation normale. Tension stable.",
      },
      {
        id: "REC-002",
        date: "05 Fév 2026",
        type: "Analyse",
        doctor: "Labo Central",
        notes: "Bilan sanguin complet conforme aux attentes.",
        results: true
      }
    ]
  },
  {
    id: "PT-3102",
    name: "Marie Curie",
    status: "Observation",
    lastVisit: "15 Mars 2026",
    age: 38,
    bloodType: "O-",
    allergies: [],
    records: [
      {
        id: "REC-003",
        date: "15 Mars 2026",
        type: "Consultation",
        doctor: "Dr. Vance",
        notes: "Douleurs abdominales persistantes. Examens complémentaires prévus.",
      }
    ]
  },
  {
    id: "PT-4421",
    name: "Lucas Martin",
    status: "Critical",
    lastVisit: "18 Mars 2026",
    age: 29,
    bloodType: "B+",
    allergies: ["Lactose"],
    records: [
      {
        id: "REC-004",
        date: "18 Mars 2026",
        type: "Urgences",
        doctor: "Dr. Ross",
        notes: "Admis pour traumatisme crânien léger suite à un accident.",
      }
    ]
  }
];

export const MOCK_STAFF: Staff[] = [
  {
    id: "ST-001",
    name: "Dr. Sarah Aris",
    role: "Chef Cardiologue",
    department: "Cardiologie",
    status: "Active"
  },
  {
    id: "ST-002",
    name: "Dr. James Vance",
    role: "Neurologue",
    department: "Neurologie",
    status: "Active"
  },
  {
    id: "ST-003",
    name: "Inf. Marie Chen",
    role: "Infirmière en Chef",
    department: "Pédiatrie",
    status: "Active"
  },
  {
    id: "ST-004",
    name: "Dr. David Ross",
    role: "Urgentiste",
    department: "Urgences",
    status: "Active"
  }
];
