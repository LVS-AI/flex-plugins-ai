/* eslint-disable react/jsx-max-depth */
import React, { Dispatch } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { AnyAction } from 'redux';
import { Template } from '@twilio/flex-ui';
import PhoneIcon from '@material-ui/icons/Phone';

import { namespace, referrableResourcesBase, RootState } from '../../states';
import { loadResource } from '../../states/resources/loadResource';
import { Box, Column } from '../../styles/HrmStyles';
import SearchResultsBackButton from '../search/SearchResults/SearchResultsBackButton';
import {
  ResourceAttributesColumn,
  ResourceAttributesContainer,
  ResourceTitle,
  ViewResourceArea,
} from '../../styles/ReferrableResources';
import ResourceAttribute from './ResourceAttribute';
import { openSearchAction } from '../../states/resources';

type OwnProps = {
  resourceId: string;
};

const mapStateToProps = (state: RootState, { resourceId }: OwnProps) => ({
  resource: state[namespace][referrableResourcesBase].resources[resourceId]?.resource,
  error: state[namespace][referrableResourcesBase].resources[resourceId]?.error,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, { resourceId }: OwnProps) => ({
  loadViewedResource: () => loadResource(dispatch, resourceId),
  openSearch: () => dispatch(openSearchAction()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = OwnProps & ConnectedProps<typeof connector>;

const ViewResource: React.FC<Props> = ({ resource, error, loadViewedResource, openSearch }) => {
  if (!resource && !error) {
    loadViewedResource();
    return <div>Loading...</div>;
  }

  return (
    <Column>
      <Box marginTop="10px" marginBottom="10px">
        <SearchResultsBackButton
          text={<Template code="SearchResultsIndex-BackToResults" />}
          // eslint-disable-next-line no-empty-function
          handleBack={() => openSearch()}
        />
      </Box>
      <ViewResourceArea>
        {error && ( // TODO: translation / friendlyisation layer
          <>
            <ResourceTitle>
              <Template code="Resources-LoadResourceError" />
            </ResourceTitle>
            <p>{error.message}</p>
          </>
        )}
        {resource && (
          <>
            <ResourceTitle>{resource.name}</ResourceTitle>
            {resource.attributes && (
              <ResourceAttributesContainer>
                <ResourceAttributesColumn>
                  <ResourceAttribute description="Details" content={resource.attributes.Details} />
                  <ResourceAttribute description="Fee" content={resource.attributes.Fee} />
                  <ResourceAttribute
                    description="Application Process"
                    content={resource.attributes['Application Process']}
                  />
                  <ResourceAttribute description="Accessibility" content={resource.attributes.Accessibility} />
                  <ResourceAttribute description="Special Needs" content={resource.attributes['Special Needs']} />
                </ResourceAttributesColumn>
                <ResourceAttributesColumn>
                  <ResourceAttribute
                    description="Contact Info"
                    content={
                      <>
                        <PhoneIcon
                          fontSize="inherit"
                          style={{ color: '#616C864D', marginRight: 5, marginBottom: -2 }}
                        />
                        {resource.attributes.Phone}
                        {' | '}
                        {resource.attributes.Address}
                      </>
                    }
                  />
                  <ResourceAttribute
                    description="Service Categories"
                    content={resource.attributes['Service Categories']}
                  />
                  <ResourceAttribute description="Hours" content={resource.attributes.Hours} />
                  <ResourceAttribute description="Ages Served" content={resource.attributes['Ages Served']} />
                </ResourceAttributesColumn>
              </ResourceAttributesContainer>
            )}
          </>
        )}
      </ViewResourceArea>
    </Column>
  );
};

ViewResource.displayName = 'ViewResource';

export default connector(ViewResource);
