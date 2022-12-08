/* eslint-disable no-console */
/**
 * The intention of this file is to test that the form definition files are correct and complying with the specification provided.
 */

import { get } from 'lodash';
import each from 'jest-each';
import { validateFormDefinition, validateCategoriesDefinition } from '../../specification/validate';
import {
  aseloFormTemplates,
  CategoriesDefinition,
  DefinitionSpecification,
  DefinitionVersion,
  DefinitionVersionId,
  FormDefinition,
  FormFileSpecification,
  loadDefinition,
} from '../..';

/**
 * Given a DefinitionSpecification and a CategoriesDefinition, will expect that the CategoriesDefinition is valid under the DefinitionSpecification.
 */
const testCategoriesDefinition =
  (definitionVersionId: DefinitionVersionId, specificationPath: string) =>
  (specification: DefinitionSpecification, definition: CategoriesDefinition) => {
    const result = validateCategoriesDefinition(specification, definition);

    if (!result.valid)
      // eslint-disable-next-line no-console
      console.error(
        `Error: invalid definition on ${specificationPath} for definition ${definitionVersionId}`,
        JSON.stringify(result.issues, null, 2),
      );

    expect(result.valid).toBe(true);
  };

/**
 * Given a FormFileSpecification and a FormDefinition, will expect that the FormDefinition is valid under the FormFileSpecification.
 */
const testFormFileSpecification =
  (definitionVersionId: DefinitionVersionId, specificationPath: string) =>
  (specification: FormFileSpecification, definition: FormDefinition) => {
    const result = validateFormDefinition(specification, definition);

    if (!result.valid) {
      const failingItemReports = Object.entries(result.itemReports).reduce(
        (accum, [item, report]) => (report.valid ? accum : { ...accum, [item]: report }),
        {},
      );

      console.error(
        `Error: invalid definition on ${specificationPath} for definition ${definitionVersionId}`,
        JSON.stringify(failingItemReports, null, 2),
      );
    }
    return result;
  };

/**
 * Given a particular DefinitionVersionId, will check that testFormFileSpecification is valid for aseloFormTemplates
 */
const testFormAgainstAseloTemplates = async (definitionVersionId: DefinitionVersionId) => {
  const definitionVersion = await loadDefinition(definitionVersionId);

  const formFileSpecificationPaths = [
    'caseForms.HouseholdForm',
    'caseForms.IncidentForm',
    'caseForms.NoteForm',
    'caseForms.PerpetratorForm',
    'caseForms.ReferralForm',
    'caseForms.DocumentForm',
    'tabbedForms.CallerInformationTab',
    'tabbedForms.CaseInformationTab',
    'tabbedForms.ChildInformationTab',
    'callTypeButtons',
  ];

  const results = formFileSpecificationPaths.map((path) => {
    const assertFun = testFormFileSpecification(definitionVersionId, path);
    const specification = get(aseloFormTemplates, path);
    const definition = get(definitionVersion, path);

    return assertFun(specification, definition);
  });

  expect(results).not.toContainEqual({
    valid: false,
    issues: expect.anything(),
    itemReports: expect.anything(),
  });

  const helplines = definitionVersion.helplineInformation.helplines.map((h) => h.value);
  const categoriesDefinitions = helplines.map((helpline) => ({
    helpline,
    categoriesDefinition: definitionVersion.tabbedForms.IssueCategorizationTab(helpline),
  }));

  categoriesDefinitions.forEach(({ helpline, categoriesDefinition }) => {
    const assertFun = testCategoriesDefinition(
      definitionVersionId,
      `tabbedForms.IssueCategorizationTab (helpline ${helpline})`,
    );

    assertFun(aseloFormTemplates.tabbedForms.IssueCategorizationTab, categoriesDefinition);
  });
};

describe('Validate form definitions', () => {
  const definitionVersionsIds = Object.values(DefinitionVersionId).map((definitionId) => ({
    definitionId,
  }));

  each(definitionVersionsIds).describe(
    'Testing definition for $definitionId',
    ({ definitionId }) => {
      let definitionVersion: DefinitionVersion;
      let categoriesDefinitions: { helpline: string; categoriesDefinition: CategoriesDefinition }[];

      beforeAll(async () => {
        definitionVersion = await loadDefinition(definitionId);
        const helplines = definitionVersion.helplineInformation.helplines.map((h) => h.value);
        categoriesDefinitions = helplines.map((helpline) => ({
          helpline,
          categoriesDefinition: definitionVersion.tabbedForms.IssueCategorizationTab(helpline),
        }));
      });

      const formFileSpecificationPaths = [
        'caseForms.HouseholdForm',
        'caseForms.IncidentForm',
        'caseForms.NoteForm',
        'caseForms.PerpetratorForm',
        'caseForms.ReferralForm',
        'caseForms.DocumentForm',
        'tabbedForms.CallerInformationTab',
        'tabbedForms.CaseInformationTab',
        'tabbedForms.ChildInformationTab',
        'callTypeButtons',
      ];

      each(formFileSpecificationPaths.map((path) => ({ path }))).test(
        'Validating form definition $path',
        ({ path }) => {
          const assertFun = testFormFileSpecification(definitionId, path);
          const specification = get(aseloFormTemplates, path);
          const definition = get(definitionVersion, path);

          const result = assertFun(specification, definition);
          expect(result).toEqual({
            valid: true,
            issues: [],
            itemReports: expect.anything(),
          });
        },
      );
      // Would like to 'each' per helpline, but jest doesn't support loading an array for pass to the 'each' function asynchronously
      // See https://github.com/facebook/jest/issues/9709
      test('Validating categories for all helplines', () => {
        categoriesDefinitions.forEach(({ helpline, categoriesDefinition }) => {
          const assertFun = testCategoriesDefinition(
            definitionId,
            `tabbedForms.IssueCategorizationTab (helpline ${helpline})`,
          );

          assertFun(aseloFormTemplates.tabbedForms.IssueCategorizationTab, categoriesDefinition);
        });
      });
    },
  );
});
