import brazilMunicipalities from './brazil-municipalities.json';

export const BRAZIL_COUNTRY_CODE = 'BR';

export const BRAZIL_SUBDIVISION_CODES = [
  'BR-AC',
  'BR-AL',
  'BR-AP',
  'BR-AM',
  'BR-BA',
  'BR-CE',
  'BR-DF',
  'BR-ES',
  'BR-GO',
  'BR-MA',
  'BR-MT',
  'BR-MS',
  'BR-MG',
  'BR-PA',
  'BR-PB',
  'BR-PR',
  'BR-PE',
  'BR-PI',
  'BR-RJ',
  'BR-RN',
  'BR-RS',
  'BR-RO',
  'BR-RR',
  'BR-SC',
  'BR-SP',
  'BR-SE',
  'BR-TO',
];

interface BrazilMunicipality {
  id: number;
  name: string;
  subdivision: string;
}

export const BRAZIL_MUNICIPALITIES: BrazilMunicipality[] = brazilMunicipalities;

export const BRAZIL_MUNICIPALITIES_NAMES = BRAZIL_MUNICIPALITIES.map(
  (municipality) => municipality.name,
);
