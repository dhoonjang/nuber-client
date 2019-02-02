import React from "react";
import { RouteComponentProps } from "react-router-dom";
import RidePresenter from "./RidePresenter";
import { GET_RIDE, RIDE_SUBSCRIPTION, UPDATE_RIDE_STATUS } from "./RideQueries.q";
import { Query, Mutation } from "react-apollo";
import { getRide, getRideVariables, userProfile, updateRide, updateRideVariables } from "src/types/api";
import { USER_PROFILE } from "src/sharedQueries.q";
import { SubscribeToMoreOptions } from "apollo-boost";

class RideQuery extends Query<getRide, getRideVariables> { }
class ProfileQuery extends Query<userProfile> { }
class RideUpdate extends Mutation<updateRide, updateRideVariables> { }


interface IProps extends RouteComponentProps<any> { }

class RideContainer extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    if (!props.match.params.rideId) {
      props.history.push("/");
    }
  }
  public render() {
    const {
      match: {
        params: { rideId }
      }
    } = this.props;

    const numRideId = Number(rideId);
    console.log(numRideId);
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data: userData }) => (
          <RideQuery query={GET_RIDE} variables={{ rideId: numRideId }}>
            {({ data, loading, subscribeToMore }) => {
              const subscribeOptions: SubscribeToMoreOptions = {
                document: RIDE_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) {
                    return prev;
                  }
                  const {
                    data: {
                      RideStatusSubscription: { status }
                    }
                  } = subscriptionData;
                  if (status === "FINISHED") {
                    window.location.href = "/";
                  }
                }
              };
              subscribeToMore(subscribeOptions);
              return (
                <RideUpdate
                  mutation={UPDATE_RIDE_STATUS}
                >
                  {updateRideFn => (
                    <RidePresenter
                      userData={userData}
                      loading={loading}
                      data={data}
                      updateRideFn={updateRideFn}
                    />
                  )}
                </RideUpdate>
              );
            }}
          </RideQuery>
        )}
      </ProfileQuery>
    )
  }
}

export default RideContainer;