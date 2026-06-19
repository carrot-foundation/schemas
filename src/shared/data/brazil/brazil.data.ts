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

/**
 * Maps Brazilian state names to their 2-letter ISO 3166-2 subdivision part.
 * Source address data (`countryState`) is inconsistent — sometimes the
 * 2-letter code (`RS`), sometimes the full state name (`São Paulo`) — so
 * normalization to the canonical `BR-XX` code needs both forms. Keys are
 * lower-cased and accent-stripped (see `toSubdivisionLookupKey`).
 */
const BRAZIL_SUBDIVISION_PART_BY_NAME: Record<string, string> = {
  acre: 'AC',
  alagoas: 'AL',
  amapa: 'AP',
  amazonas: 'AM',
  bahia: 'BA',
  ceara: 'CE',
  'distrito federal': 'DF',
  'espirito santo': 'ES',
  goias: 'GO',
  maranhao: 'MA',
  'mato grosso': 'MT',
  'mato grosso do sul': 'MS',
  'minas gerais': 'MG',
  para: 'PA',
  paraiba: 'PB',
  parana: 'PR',
  pernambuco: 'PE',
  piaui: 'PI',
  'rio de janeiro': 'RJ',
  'rio grande do norte': 'RN',
  'rio grande do sul': 'RS',
  rondonia: 'RO',
  roraima: 'RR',
  'santa catarina': 'SC',
  'sao paulo': 'SP',
  sergipe: 'SE',
  tocantins: 'TO',
};

const BRAZIL_SUBDIVISION_PARTS = new Set(
  BRAZIL_SUBDIVISION_CODES.map((code) => code.split('-')[1]),
);

const toSubdivisionLookupKey = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/gu, '');

/**
 * Normalizes a raw Brazilian subdivision value to its canonical ISO 3166-2
 * code (`BR-XX`). Accepts an existing `BR-XX` code, a bare 2-letter part
 * (`RS`), or a full/accented state name (`São Paulo`). Throws when the value
 * is not a recognized Brazilian subdivision.
 */
export const normalizeBrazilSubdivision = (value: string): string => {
  const trimmedUpper = value.trim().toUpperCase();

  if (BRAZIL_SUBDIVISION_CODES.includes(trimmedUpper)) {
    return trimmedUpper;
  }

  if (BRAZIL_SUBDIVISION_PARTS.has(trimmedUpper)) {
    return `${BRAZIL_COUNTRY_CODE}-${trimmedUpper}`;
  }

  const subdivisionPart =
    BRAZIL_SUBDIVISION_PART_BY_NAME[toSubdivisionLookupKey(value)];

  if (subdivisionPart) {
    return `${BRAZIL_COUNTRY_CODE}-${subdivisionPart}`;
  }

  throw new Error(`Cannot normalize Brazilian subdivision from "${value}"`);
};
