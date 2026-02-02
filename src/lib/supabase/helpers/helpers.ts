import { IdProject } from "../queriesClient";

/**
 * Converts a project slug string to its corresponding numeric ID.
 *
 * @param project - The project slug identifier (e.g., 'slotcarracing', 'numberops', 'website')
 * @returns The numeric project ID, or 0 if no matching project is found
 *
 * @example
 * ```ts
 * getProjectNameByString('numberops'); // returns 2
 * getProjectNameByString('unknown');   // returns 0
 * ```
 */
export const getProjectNameByString = (project: string): number => {
  switch (project) {
    case 'slotcarracing':
      return 1;
    case 'numberops':
      return 2;
    case 'website':
      return 3;
    default:
      return 0;
  }
};

/**
 * Converts a project ID enum to its human-readable display name.
 *
 * @param project - The project ID from the IdProject enum
 * @returns The formatted project display name, or 'No projects found' for invalid IDs
 *
 * @example
 * ```ts
 * getProjectByID(IdProject.numberops);    // returns 'Number Ops'
 * getProjectByID(IdProject.slotcarracing); // returns 'Slotcar Racing'
 * ```
 */
export const getProjectByID = (project: IdProject): string => {
  switch (project) {
    case IdProject.numberops:
      return 'Number Ops';
    case IdProject.slotcarracing:
      return 'Slotcar Racing';
    case IdProject.website:
      return 'Website';
    default:
      return 'No projects found';
  }
};
