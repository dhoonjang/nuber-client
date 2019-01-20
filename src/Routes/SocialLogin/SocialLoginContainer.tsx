import React from "react";
import SocialLoginPresenter from "./SocialLoginPresenter";
import { Mutation, MutationFn } from "react-apollo";
import { facebookConnect, facebookConnectVariables } from "src/types/api";
import { FACEBOOK_CONNECT } from "./SocialLoginQueries.q";
import { toast } from "react-toastify";
import { LOG_USER_IN } from "src/sharedQueries";

class LoginMutation extends Mutation<facebookConnect, facebookConnectVariables> {}

interface IState {
  firstName: string;
  lastName: string;
  email?: string;
  fbId: string;
}
class SocialLoginContainer extends React.Component<{}, IState> {
  public state = {
    email: "",
    fbId: "",
    firstName: "",
    lastName: ""
  }
  public facebookMutation: MutationFn;
  public render() {
    return (
      <Mutation mutation={LOG_USER_IN}>
        {logUserIn => (
          <LoginMutation 
            mutation={FACEBOOK_CONNECT}
            onCompleted={data => {
              const { FacebookConnect } = data;
              if (FacebookConnect.ok) {
                logUserIn({
                  variables: {
                    token: FacebookConnect.token
                  }
                });
              } else {
                toast.error(FacebookConnect.error);
              }
            }}
          >
            {(facebookMutation, {loading})=>{
              this.facebookMutation = facebookMutation;
              return <SocialLoginPresenter loginCallback={this.loginCallback}/>
            }}
          </LoginMutation>
        )}
      </Mutation>
      
    );
  }

  public loginCallback = fbData => {
    const { name, first_name, last_name, email, id, accessToken } = fbData;
    if (accessToken) {
      toast.success(`Welcome ${name}!`);
      this.facebookMutation({
        variables: {
          email,
          fbId: id,
          firstName: first_name,
          lastName: last_name
        }
      });
    } else {
      toast.error("Could not log you in 😔");
    }
  };
}

export default SocialLoginContainer;