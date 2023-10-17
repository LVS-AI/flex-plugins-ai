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

// Action types
export const CHANGE_ROUTE = 'CHANGE_ROUTE';

export type TabbedFormSubroutes =
  | 'search'
  | 'contactlessTask'
  | 'callerInformation'
  | 'childInformation'
  | 'categories'
  | 'caseInformation'
  | 'profileDetails';

export const NewCaseSectionSubroutes = {
  Note: 'note',
  Referral: 'referral',
  Household: 'household',
  Perpetrator: 'perpetrator',
  Incident: 'incident',
  Document: 'document',
  CaseSummary: 'caseSummary',
} as const;

const OtherCaseRoutes = {
  CasePrintView: 'case-print-view',
  ViewContact: 'view-contact',
} as const;

export type CaseSectionSubroute = typeof NewCaseSectionSubroutes[keyof typeof NewCaseSectionSubroutes];

export type CaseViewContactRoute = CaseRoute & {
  subroute?: typeof OtherCaseRoutes.ViewContact;
  id: string;
};

export const NewCaseSubroutes = Object.freeze({
  ...NewCaseSectionSubroutes,
  ...OtherCaseRoutes,
});

export enum CaseItemAction {
  Add = 'add',
  Edit = 'edit',
  View = 'view',
}

type CaseRoute =
  | {
      route: 'tabbed-forms' | 'new-case';
      autoFocus?: boolean;
    }
  | {
      route: 'select-call-type';
    };

type CaseSectionRoute = CaseRoute & {
  subroute?: CaseSectionSubroute;
};

export type EditCaseSectionRoute = CaseSectionRoute & {
  action: CaseItemAction.Edit;
  id: string;
};

export type AddCaseSectionRoute = CaseSectionRoute & {
  action: CaseItemAction.Add;
};

export type ViewCaseSectionRoute = CaseSectionRoute & {
  action: CaseItemAction.View;
  id: string;
};

export function isAddCaseSectionRoute(appRoute: AppRoutes): appRoute is AddCaseSectionRoute {
  return (<any>appRoute).action === CaseItemAction.Add;
}

export function isViewCaseSectionRoute(appRoute: AppRoutes): appRoute is ViewCaseSectionRoute {
  return (<any>appRoute).action === CaseItemAction.View;
}

export function isEditCaseSectionRoute(appRoute: AppRoutes): appRoute is EditCaseSectionRoute {
  return (<any>appRoute).action === CaseItemAction.Edit;
}

export function isViewContactRoute(appRoute: AppRoutes): appRoute is CaseViewContactRoute {
  return (<AppRoutes>appRoute).subroute === 'view-contact';
}

// Routes that may lead to Case screen (maybe we need an improvement here)
export type AppRoutesWithCase =
  // TODO: enum the possible subroutes on each route
  | AddCaseSectionRoute
  | EditCaseSectionRoute
  | ViewCaseSectionRoute
  | CaseViewContactRoute
  | (CaseRoute & { subroute?: TabbedFormSubroutes | 'case-print-view' })
  | {
      route: 'tabbed-forms';
      subroute?: TabbedFormSubroutes;
      autoFocus?: boolean;
    };

export function isAppRouteWithCase(appRoute: AppRoutes): appRoute is AppRoutesWithCase {
  return ['tabbed-forms', 'new-case', 'select-call-type'].includes(appRoute?.route);
}

export type CSAMReportRoute = {
  route: 'csam-report';
  subroute: 'form' | 'loading' | 'status' | 'report-type-picker';
  previousRoute: AppRoutes;
};

type OtherRoutes = CSAMReportRoute;

// The different routes we have in our app
export type AppRoutes = AppRoutesWithCase | OtherRoutes;

type ChangeRouteAction = {
  type: typeof CHANGE_ROUTE;
  routing: AppRoutes;
  taskId: string;
};

export type RoutingActionType = ChangeRouteAction;
