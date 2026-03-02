declare module "zipcodes" {
  export type ZipRecord = {
    zip: string;
    latitude?: number;
    longitude?: number;
    city: string;
    state: string;
    country?: string;
  };

  export const codes: Record<string, ZipRecord>;

  export function lookup(zip: string): ZipRecord | null;

  export function lookupByName(city: string, state: string): ZipRecord[] | null;

  export function distance(zipA: string, zipB: string): number;

  const zipcodes: {
    codes: typeof codes;
    lookup: typeof lookup;
    lookupByName: typeof lookupByName;
    distance: typeof distance;
  };

  export default zipcodes;
}
