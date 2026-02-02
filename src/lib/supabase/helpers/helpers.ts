import { IdProject } from "../queriesClient";

export const getProjectNameByString = (project: string): number => {
  switch (project) {
    case 'slotcarracing':
      return 1;
    case 'numberops':
      return 2;
    case 'website':
      return 3;
    default: return 0;
  }
}

export const getProjectByID = (project: IdProject): string => {
  switch (project) {
    case IdProject.numberops:
      return 'Number Ops';
    case IdProject.slotcarracing:
      return 'Slotcar Racing';
    case IdProject.website:
      return 'Website'
    default: return 'No projects found';
  }
}
