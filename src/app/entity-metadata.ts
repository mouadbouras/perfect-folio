import { EntityMetadataMap } from '@ngrx/data';
import { Portfolio } from './business-logic/models';

const entityMetadata: EntityMetadataMap = {
  Portfolio: {
    selectId: (portfolio: Portfolio) => portfolio.key,
  },
  User: {},
};

const pluralNames = {};

export const entityConfig = {
  entityMetadata,
  pluralNames,
};
