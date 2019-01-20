import React from "react";
import { Mutation, Query } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { updateProfile, updateProfileVariables, userProfile } from "../../types/api";
import EditAccountPresenter from "./EditAccountPresenter";
import { UPDATE_PROFILE } from "./EditAccountQueries.q";
import { USER_PROFILE } from "src/sharedQueries.q";
import { toast } from "react-toastify";

interface IState {
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
}

interface IProps extends RouteComponentProps<any> {}

class UpdateProfileMutation extends Mutation<
  updateProfile,
  updateProfileVariables
> {}

class ProfileQuery extends Query<userProfile> {}

class EditAccountContainer extends React.Component<IProps, IState> {
  public state = {
    email: "",
    firstName: "",
    lastName: "",
    profilePhoto: ""
  };
  public render() {
    const { email, firstName, lastName, profilePhoto } = this.state;
    return (
        <ProfileQuery 
            query={USER_PROFILE} 
            fetchPolicy={"cache-and-network"} 
            onCompleted={this.updateFields}
        >
            {() => (
                <UpdateProfileMutation
                    mutation={UPDATE_PROFILE}
                    refetchQueries={[{ query: USER_PROFILE }]}
                    onCompleted={data => {
                    const { UpdateMyProfile } = data;
                    if (UpdateMyProfile.ok) {
                        toast.success("Profile updated!");
                    } else if (UpdateMyProfile.error) {
                        toast.error(UpdateMyProfile.error);
                    }
                    }}
                    variables={{
                        email,
                        firstName,
                        lastName,
                        profilePhoto
                    }}
                >
                    {(updateProfileFn, { loading }) => (
                        <EditAccountPresenter
                            email={email}
                            firstName={firstName}
                            lastName={lastName}
                            profilePhoto={profilePhoto}
                            onInputChange={this.onInputChange}
                            loading={loading}
                            onSubmit={updateProfileFn}
                        />
                    )}
                </UpdateProfileMutation>
            )}
        </ProfileQuery>
    );
  }
  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {
      target: { name, value }
    } = event;

    this.setState({
      [name]: value
    } as any);
  };

  public updateFields = (data: {} | userProfile) => {
    if ("GetMyProfile" in data) {
      const {
        GetMyProfile: { user }
      } = data;
      if (user !== null) {
        const { firstName, lastName, email, profilePhoto } = user;
        this.setState({
          email,
          firstName,
          lastName,
          profilePhoto
        } as any);
        console.log("gggg");
      }
    }
  };
}

export default EditAccountContainer;