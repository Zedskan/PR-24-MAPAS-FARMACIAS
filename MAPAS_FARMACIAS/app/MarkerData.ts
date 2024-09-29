// /app/MarkerData.ts

export interface Marker1 {
    id: string;       // Identificador único para el marcador
    latitude: number; // Latitud del marcador
    longitude: number; // Longitud del marcador
    name: string;     // Nombre del establecimiento
    sector?: string;  // Sector (opcional)
    tipo?: string;    // Tipo de establecimiento (opcional)
    direccion?: string; // Dirección (opcional)
    zona?: string;    // Zona (opcional)
    codigoZona?: string; // Código de zona (opcional)
    redDeSalud?: string; // Red de salud (opcional)
    municipio?: string; // Municipio (opcional)
    propietario?: string; // Propietario (opcional)
    nit?: string;      // NIT (opcional)
    numeroReferencia?: string; // Número de referencia (opcional)
    medicamentosControlados?: string; // Medicamentos controlados (opcional)
    horas?: string;    // Horas de operación (opcional)
}

// Array de datos de farmacias
export const markers: Marker1[] = [
    {
        id: '1',
        latitude: -17.45736643,
        longitude: -66.15706839,
        name: '12 DE DICIEMBRE',
        sector: 'Privados',
        tipo: 'Farmacia Privada',
        direccion: 'AV.ENCAÑADA S/N ACERA OESTE ENRE C. ALONZO YAÑEZ MENDOZA E INNOMINADA',
        zona: 'PUCARA GRANDE',
        municipio: 'Cochabamba',
        propietario: 'LISBETH MAIDA VARGAS',
        nit: '5873971013',
        numeroReferencia: '77365876',
        medicamentosControlados: 'NINGUNO',
        horas: 'h8'
    },
    {
        id: '2',
        latitude: -17.3934218,
        longitude: -66.15620203,
        name: '12 DE DICIEMBRE SUCURSAL I',
        sector: 'Privados',
        tipo: 'Farmacia Privada',
        direccion: 'Calle San Juan s/n Esquina Virgen de Guadalupe',
        zona: 'Lacma',
        municipio: 'Cochabamba',
        propietario: 'PARDO ESCOBAR PAOLA ANDREA',
        nit: '7977320',
        numeroReferencia: '76449377',
        medicamentosControlados: 'NINGUNO',
        horas: 'h8'
    },
    {
        id: '3',
        latitude: -17.36684135,
        longitude: -66.15641661,
        name: '12RICH',
        sector: 'Privados',
        tipo: 'Farmacia Privada',
        direccion: 'AV. SANTA CRUZ N° 2185 ENTRE AV. CIRCUNVALACIÓN Y CALLE ELENA RENDON ZONA QUERU QUERU',
        zona: 'QUERU QUERU',
        municipio: 'Cochabamba',
        propietario: 'SANCHEZ MEDRANO VERONICA',
        nit: '7947315015',
        numeroReferencia: '76433357',
        medicamentosControlados: 'NINGUNO',
        horas: 'h8'
    },
    {
        id: '4',
        latitude: -17.39757848,
        longitude: -66.15748949,
        name: '18 DE MARZO',
        sector: 'Privados',
        tipo: 'Farmacia Privada',
        direccion: 'CALLE LADISLAO CABRERA N° 120 ENTRE AV. AYACUCHO Y NATANIEL AGUIRRE',
        zona: 'CENTRAL',
        municipio: 'Cochabamba',
        propietario: '18 DE MARZO',
        nit: '6556965016',
        numeroReferencia: '77940770',
        medicamentosControlados: 'NINGUNO',
        horas: 'h8'
    },
    {
        id: '5',
        latitude: -17.40659796,
        longitude: -66.1510361,
        name: '18 DE MARZO SUCURSAL I',
        sector: 'Privados',
        tipo: 'Farmacia Privada',
        direccion: 'AV. REPUBLICA N° 1530 ENTRE AV. GUAYARAMERINY CALLE PULACAYO',
        zona: 'SAN MIGUEL',
        municipio: 'Cochabamba',
        propietario: 'MONTAÑO SOLIZ JHANNETH',
        nit: '6556965016',
        numeroReferencia: '77940770',
        medicamentosControlados: 'NINGUNO',
        horas: 'h8'
    },
    // Nueva farmacia "22 DE ENERO"
    {
        id: '6',
        latitude: -17.40300455,
        longitude: -66.0310448,
        name: '22 DE ENERO',
        sector: 'Privados',
        tipo: 'Farmacia Privada',
        direccion: 'AV. BARRIENTOS KM13 S/N ENTRE CALLE SANTA CRUZ Y AV. AMERICA',
        zona: '7 ESQUINAS',
        municipio: 'Sacaba',
        propietario: 'SEJAS AVENDAÑO GABRIELA',
        nit: '9410495019',
        numeroReferencia: 'NINGUNO',
        medicamentosControlados: 'NINGUNO',
        horas: 'h8'
    },
    // Nueva farmacia "24/7"
    {
        id: '7',
        latitude: -17.35262676,
        longitude: -66.28693961,
        name: '24/7',
        sector: 'Privados',
        tipo: 'Farmacia Privada',
        direccion: 'AV. SANTA CRUZ ACERA NORTE ENTRE LA AV. TUPUYAN Y CALLE INNOMINADA S/N',
        zona: 'MARQUINA',
        municipio: 'Quillacollo',
        propietario: 'CARRILLO LOPEZ CLEVER ABDUL',
        nit: '7935503017',
        numeroReferencia: 'NINGUNO',
        medicamentosControlados: 'NINGUNO',
        horas: 'h8'
    },
];
