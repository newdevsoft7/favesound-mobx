import * as actionTypes from '../constants/actionTypes';
import {apiUrl, addAccessTokenWith, getLazyLoadingUrl} from '../utils/soundcloudApi';

function mergeFollowings(followings) {
  return {
    type: actionTypes.MERGE_FOLLOWINGS,
    followings
  };
}

export function fetchFollowings(user, nextHref) {

  const initHref = apiUrl(`users/${user.id}/followings?limit=200&offset=0`, '&');
  const followingsUrl = nextHref || initHref;

  return dispatch => {
    return fetch(followingsUrl)
      .then(response => response.json())
      .then(data => {
        dispatch(mergeFollowings(data.collection));

        if (data.next_href) {
          dispatch(fetchFollowings(user, data.next_href));
        }
      });
  };
}

function mergeActivities(activities) {
  return {
    type: actionTypes.MERGE_ACTIVITIES,
    activities
  };
}

function setActivitiesNextHref(nextHref) {
  return {
    type: actionTypes.SET_ACTIVITIES_NEXT_HREF,
    nextHref
  };
}

function setActivitiesRequestInProcess(inProcess) {
  return {
    type: actionTypes.SET_ACTIVITIES_REQUEST_IN_RPOCESS,
    inProcess
  };
}

export function fetchActivities(user, nextHref) {
  return (dispatch, getState) => {

    let url = getLazyLoadingUrl(user, nextHref, 'activities?limit=50&offset=0');
    let requestInProcess = getState().user.get('activitiesRequestInProcess');

    if (requestInProcess) { return; }

    dispatch(setActivitiesRequestInProcess(true));

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        dispatch(mergeActivities(data.collection));
        dispatch(setActivitiesNextHref(data.next_href));
        dispatch(setActivitiesRequestInProcess(false));
      });
  };

}

function mergeFollowers(followers) {
  return {
    type: actionTypes.MERGE_FOLLOWERS,
    followers
  };
}

function setFollowersNextHref(nextHref) {
  return {
    type: actionTypes.SET_FOLLOWERS_NEXT_HREF,
    nextHref
  };
}

function setFollowersRequestInProcess(inProcess) {
  return {
    type: actionTypes.SET_FOLLOWERS_REQUEST_IN_RPOCESS,
    inProcess
  };
}

export function fetchFollowers(user, nextHref) {
  return (dispatch, getState) => {

    let url = getLazyLoadingUrl(user, nextHref, 'followers?limit=200&offset=0');
    let requestInProcess = getState().user.get('followersRequestInProcess');

    if (requestInProcess) { return; }

    dispatch(setFollowersRequestInProcess(true));

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        dispatch(mergeFollowers(data.collection));
        dispatch(setFollowersNextHref(data.next_href));
        dispatch(setFollowersRequestInProcess(false));
      });
  };

}