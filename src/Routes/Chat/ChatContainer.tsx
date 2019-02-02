import React from "react";
import { RouteComponentProps } from "react-router-dom";
import ChatPresenter from "./ChatPresenter";
import { Query, Mutation, MutationFn } from "react-apollo";
import { userProfile, getChat, getChatVariables, sendMessage, sendMessageVariables } from "src/types/api";
import { USER_PROFILE } from "src/sharedQueries.q";
import { GET_CHAT, SEND_MESSAGE, SUBSCRIBE_TO_MESSAGES } from "./ChatQueries.q";
import { SubscribeToMoreOptions } from "apollo-boost";

interface IProps extends RouteComponentProps<any> {}

class ProfileQuery extends Query<userProfile> { }
class ChatQuery extends Query<getChat, getChatVariables> { }
class SendMessageMutation extends Mutation<sendMessage, sendMessageVariables> {}


interface IState {
  message: "";
}

class ChatContainer extends React.Component<IProps, IState> {
  public sendMessageFn: MutationFn;
  constructor(props: IProps) {
    super(props);
    if (!props.match.params.chatId) {
      props.history.push("/");
    }
    this.state = {
      message: ""
    };
  }
  public render() {
    const {
      match: {
        params: { chatId }
      }
    } = this.props;
    const numChatId = Number(chatId);
    const { message } = this.state;
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data: userData }) => {
          console.log(userData);
          return (
          <ChatQuery query={GET_CHAT} variables={{ chatId: numChatId } }>
            {({ data, loading,subscribeToMore }) => {
              const subscribeToMoreOptions: SubscribeToMoreOptions = {
                document: SUBSCRIBE_TO_MESSAGES,
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) {
                    return prev;
                  }
                  const {
                    data: { MessageSubscription }
                  } = subscriptionData;
                  const {
                    GetChat: {
                      chat: { messages }
                    }
                  } = prev;
                  const newMessageId = MessageSubscription.id;
                  const latestMessageId = messages[messages.length - 1].id;

                  if (newMessageId === latestMessageId) {
                    return;
                  }
                  const newObject = Object.assign({}, prev, {
                    GetChat: {
                      ...prev.GetChat,
                      chat: {
                        ...prev.GetChat.chat,
                        messages: [
                          ...messages,
                          MessageSubscription
                        ]
                      }
                    }
                  });
                  return newObject;
                }
              };
              subscribeToMore(subscribeToMoreOptions);
              return (
                <SendMessageMutation mutation={SEND_MESSAGE}>
                  {sendMessageFn => {
                    this.sendMessageFn = sendMessageFn;
                    if (!loading) {
                      return (
                        <ChatPresenter
                          data={data}
                          loading={loading}
                          userData={userData}
                          messageText={message}
                          onInputChange={this.onInputChange}
                          onSubmit={this.onSubmit}
                        />
                      );
                    } else {
                      return "Loading";
                    }
                  }}
                </SendMessageMutation>
              )
            }}
          </ChatQuery>
        )}}
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
  public onSubmit = () => {
    const { message } = this.state;
    const {
      match: {
        params: { chatId }
      }
    } = this.props;
    const numChatId = Number(chatId);
    if (message !== "") {
      this.setState({
        message: ""
      });
      this.sendMessageFn({
        variables: {
          chatId: numChatId,
          text: message
        }
      });
    }
    return;
  };
}

export default ChatContainer;