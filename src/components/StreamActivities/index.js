import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/index';
import * as requestTypes from '../../constants/requestTypes';
import * as paginateLinkTypes from '../../constants/paginateLinkTypes';
import { getAndCombined } from '../../services/filter';
import Activities from '../../components/Activities';
import { StreamInteractions } from '../../components/StreamInteractions';
import { DURATION_FILTER_FUNCTIONS } from '../../constants/durationFilter';

function StreamActivities({
  activities,
  requestInProcess,
  nextHref,
  trackEntities,
  activeFilter,
  onFetchActivities,
}) {
  return (
    <div>
      <StreamInteractions />
      <Activities
        requestInProcess={requestInProcess}
        entities={trackEntities}
        ids={activities}
        activeFilter={activeFilter}
        scrollFunction={() => onFetchActivities(null, nextHref)}
      />
    </div>
  );
}

function mapStateToProps(state) {
  const { durationFilter } = state.filter;
  const filters = [DURATION_FILTER_FUNCTIONS[durationFilter]];

  return {
    trackEntities: state.entities.tracks,
    activities: state.user.activities,
    requestInProcess: state.request[requestTypes.ACTIVITIES],
    nextHref: state.paginate[paginateLinkTypes.ACTIVITIES],
    activeFilter: getAndCombined(filters)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onFetchActivities: bindActionCreators(actions.fetchActivities, dispatch)
  };
}

StreamActivities.propTypes = {
  trackEntities: React.PropTypes.object,
  activities: React.PropTypes.array,
  requestInProcess: React.PropTypes.bool,
  nextHref: React.PropTypes.string,
  activeFilter: React.PropTypes.func,
  onFetchActivities: React.PropTypes.func,
};

const StreamActivitiesContainer = connect(mapStateToProps, mapDispatchToProps)(StreamActivities);

export {
  StreamActivities,
  StreamActivitiesContainer
};