// Centralized endorsement API module — re-exports all endpoint groups.
import * as inquiriesApi from "./inquiries";
import * as endorsementsApi from "./endorsements";
import * as opportunitiesApi from "./opportunities";
import * as claimsApi from "./claims";
import * as inspectionsApi from "./inspections";
import * as classificationApi from "./classification";
import * as coverageApi from "./coverage";
import * as riskApi from "./risk";
import * as sponsorshipApi from "./sponsorship";
import * as notificationsApi from "./notifications";
import * as adminApi from "./admin";
import { ApiError, authenticatedRequest } from "./client";

export const endorsementApi = {
  ...inquiriesApi,
  ...endorsementsApi,
  ...opportunitiesApi,
  ...claimsApi,
  ...inspectionsApi,
  ...classificationApi,
  ...coverageApi,
  ...riskApi,
  ...sponsorshipApi,
  ...notificationsApi,
  ...adminApi
};

export { ApiError, authenticatedRequest };
