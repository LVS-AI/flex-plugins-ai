/**
 * Copyright (C) 2021-2023 Technology Matters
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
 */

import { configurationBase, namespace } from '../../../states';
import { retrieveCategories, taskFormToHrmServiceContact } from '../../../states/contacts/contactDetailsAdapter';
import * as ContactService from '../../../services/ContactService';

describe('retrieveCategories', () => {
  test('empty object input, empty object output', () => expect(retrieveCategories({})).toStrictEqual({}));
  test('Categories with enabled subcategories input, categories with enables subcategories in a list as output', () =>
    expect(
      retrieveCategories({
        category1: { sub1: true, sub2: false, sub3: true },
        category2: { sub1: true, sub2: true, sub3: false },
      }),
    ).toStrictEqual({ category1: ['sub1', 'sub3'], category2: ['sub1', 'sub2'] }));
  test('Falsy categories - throw', () =>
    expect(() =>
      retrieveCategories({
        category1: null,
        category2: { sub1: true, sub2: true, sub3: false },
      }),
    ).toThrow());
  test('Categories with no subcategories input, not included in output', () =>
    expect(
      retrieveCategories({
        category1: {},
        category2: { sub1: true, sub2: true, sub3: false },
      }),
    ).toStrictEqual({ category2: ['sub1', 'sub2'] }));
  test('Categories with no enabled subcategories input, not included in output', () =>
    expect(
      retrieveCategories({
        category1: { sub1: false, sub2: false, sub3: false },
        category2: { sub1: true, sub2: true, sub3: false },
      }),
    ).toStrictEqual({ category2: ['sub1', 'sub2'] }));
});

jest.mock('../../../services/ContactService', () => ({
  ...jest.requireActual('../../../services/ContactService'),
  transformForm: (form: any) => ({
    callType: '',
    childInformation: {},
    callerInformation: {},
    contactlessTask: {
      channel: 'web',
    },
    caseInformation: {
      callSummary: '',
    },
    categories: {
      category1: ['subCategory1', 'subCategory2'],
      category2: ['subCategory3'],
    },
  }),
}));

describe('taskFormToHrmServiceContact', () => {
  test('should return Partial<HrmServiceContact>', () => {
    const task = {
      taskSid: 'offline-contact-task-sid',
      channelType: 'default',
    };
    const form = {};
    const date = '2023-01-01';
    const twilioWorkerId = 'WKxxx';
    const temporaryId = '123';

    const contact = taskFormToHrmServiceContact(task, form, date, twilioWorkerId, temporaryId);

    expect(contact.id).toEqual(temporaryId);
    expect(contact.twilioWorkerId).toEqual(twilioWorkerId);
    expect(contact.timeOfContact).toEqual(date);
    expect(contact.taskId).toEqual(task.taskSid);
    expect(contact.channel).toEqual(task.channelType);
    expect(contact.rawJson?.categories).toStrictEqual({
      category1: ['subCategory1', 'subCategory2'],
      category2: ['subCategory3'],
    });
  });
});
