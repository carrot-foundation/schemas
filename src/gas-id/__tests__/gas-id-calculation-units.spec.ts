import { describe, expect, it } from 'vitest';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { GasIDDataSchema } from '../gas-id.data.schema';
import { GasIDIpfsSchema } from '../gas-id.schema';
import example from '../../../schemas/ipfs/gas-id/gas-id.example.json';
import jsonSchema from '../../../schemas/ipfs/gas-id/gas-id.schema.json';

const ajv = new Ajv({ strict: false });
addFormats(ajv);
const validateFull = ajv.compile(jsonSchema);
const validateData = ajv.compile(jsonSchema.properties.data);

describe('GasID calculation result units', () => {
  it.each([
    ['first', 't CO₂e'],
    ['first', 'kg CO2e'],
    ['first', ' kg CO₂e '],
    ['later', 't CO₂e'],
    ['later', 'kg CO2e'],
    ['later', ' kg CO₂e '],
  ] as const)('rejects a %s R with unit "%s"', (position, unit) => {
    const document = structuredClone(example);
    const values = document.data.prevented_emissions_calculation.values;
    expect(values[0].reference).toBe('R');

    if (position === 'later') {
      values.push({ ...values[0], unit });
    } else {
      values[0].unit = unit;
    }

    const fullResult = GasIDIpfsSchema.safeParse(document);
    const dataResult = GasIDDataSchema.safeParse(document.data);
    expect({
      fullZod: fullResult.success,
      dataZod: dataResult.success,
      fullJsonSchema: validateFull(document),
      dataJsonSchema: validateData(document.data),
    }).toEqual({
      fullZod: false,
      dataZod: false,
      fullJsonSchema: false,
      dataJsonSchema: false,
    });

    const index = position === 'later' ? values.length - 1 : 0;
    if (!fullResult.success && !dataResult.success) {
      expect(fullResult.error.issues).toContainEqual(
        expect.objectContaining({
          path: [
            'data',
            'prevented_emissions_calculation',
            'values',
            index,
            'unit',
          ],
        }),
      );
      expect(dataResult.error.issues).toContainEqual(
        expect.objectContaining({
          path: ['prevented_emissions_calculation', 'values', index, 'unit'],
        }),
      );
    }
  });

  it.each(['W', 'r', 'R1'])(
    'preserves the source unit of non-R reference "%s"',
    (reference) => {
      const document = structuredClone(example);
      const values = document.data.prevented_emissions_calculation.values;
      values.unshift({
        reference,
        value: 1,
        unit: 't',
        label: 'Illustrative source quantity',
      });

      const fullResult = GasIDIpfsSchema.safeParse(document);
      const dataResult = GasIDDataSchema.safeParse(document.data);
      expect({
        fullZod: fullResult.success,
        dataZod: dataResult.success,
        fullJsonSchema: validateFull(document),
        dataJsonSchema: validateData(document.data),
      }).toEqual({
        fullZod: true,
        dataZod: true,
        fullJsonSchema: true,
        dataJsonSchema: true,
      });
      if (fullResult.success && dataResult.success) {
        expect(
          fullResult.data.data.prevented_emissions_calculation.values,
        ).toEqual(values);
        expect(dataResult.data.prevented_emissions_calculation.values).toEqual(
          values,
        );
      }
    },
  );

  it('accepts kg CO₂e for every R without converting recorded values', () => {
    const document = structuredClone(example);
    const values = document.data.prevented_emissions_calculation.values;
    values.push({ ...values[0] });

    expect({
      fullZod: GasIDIpfsSchema.safeParse(document).success,
      dataZod: GasIDDataSchema.safeParse(document.data).success,
      fullJsonSchema: validateFull(document),
      dataJsonSchema: validateData(document.data),
    }).toEqual({
      fullZod: true,
      dataZod: true,
      fullJsonSchema: true,
      dataJsonSchema: true,
    });
    expect(values.map(({ unit, value }) => ({ unit, value }))).toEqual([
      { unit: 'kg CO₂e', value: example.data.summary.prevented_co2e_kg },
      { unit: 'kg CO₂e', value: example.data.summary.prevented_co2e_kg },
    ]);
  });
});
