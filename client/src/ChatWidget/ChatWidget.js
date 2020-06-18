import React, { useState, useCallback, useEffect, useRef } from "react";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { Input } from "antd";
import { scrollToBottom } from "./scroll";

import "./ChatWidget.css";

const ChatIcon = require("./ChatIcon.svg");

export const MessageInput = ({ onSendMessage, messageInputRef }) => {
  const [value, setValue] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    onSendMessage(value);
    setValue("");
  };
  return (
    <div className="message-input border rounded-b-md p-2">
      <Input
        label="Description"
        name="description"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        placeholder="Type a message..."
        ref={messageInputRef}
        onPressEnter={handleSendMessage}
        autoComplete="off"
      />
    </div>
  );
};

export const Conversation = ({
  onSendMessage,
  currentRoom,
  messages,
  messagesListRef,
  messageInputRef,
  isOpen,
}) => {
  var conversationClass = "chat-container rounded-md m-4";
  if (isOpen == false) {
    conversationClass += " hidden";
  }
  var prevMessage;
  return (
    <div className={conversationClass}>
      <div className="chat-header select-none border rounded-t-md p-2">
        Chat
      </div>
      <div
        className="messages-list border-l border-r p-2 flex flex-col"
        ref={messagesListRef}
      >
        {messages.map((message, index) => {
          let isOurMessage = currentRoom.userID == message.user_id;
          let className = "flex flex-col ";
          if (isOurMessage == true) {
            className += "float-right";
          }
          let timeClassName = "message-timestamp py-1 px-2 text-xs ";
          if (isOurMessage == true) {
            timeClassName += "self-end";
          }
          let samesUserAsPrev = false;
          if (prevMessage) {
            if (prevMessage.user_id == message.user_id) {
              samesUserAsPrev = true;
            }
          }
          prevMessage = message;
          return (
            <div
              key={`${index}-${format(parseISO(message.timestamp), "hh:mm")}`}
            >
              <div className={className}>
                <div className="pb-1">
                  {isOurMessage === false && samesUserAsPrev === false ? (
                    <div className="message-author pl-2">
                      {message.user_name}
                    </div>
                  ) : null}
                  <div className="message-content inline-flex rounded-md p-2">
                    {message.message}
                  </div>
                </div>
                {/* <div className={timeClassName}>
                  {format(parseISO(message.timestamp), "hh:mm")}
                </div> */}
              </div>
            </div>
          );
        })}
      </div>
      <MessageInput
        onSendMessage={onSendMessage}
        messageInputRef={messageInputRef}
      />
    </div>
  );
};

export const ChatWidget = ({ socketConnection, userInfo, currentRoom }) => {
  const [isOpen, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesListRef = useRef();
  const messageInputRef = useRef();

  const onSendMessage = (message) => {
    socketConnection.emit("message", {
      action: "chat_message",
      room: currentRoom.id,
      user_id: currentRoom.userID,
      user_name: userInfo.username,
      message: message,
      timestamp: new Date(),
    });
  };

  const onReceiveMessage = useCallback(
    (message) => {
      setMessages((messages) => messages.concat(message));
      scrollToBottom(messagesListRef.current);
    },
    [messages, messagesListRef]
  );

  const toggleWidget = () => {
    setOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen == true) {
      scrollToBottom(messagesListRef.current);
      messageInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    console.log(
      "ChatWidget constructor - socketConnection: ",
      socketConnection,
      " - userInfo: ",
      userInfo,
      " - currentRoom: ",
      currentRoom
    );
    console.log("Subscribing for chat messages");
    socketConnection.on("chat_message", onReceiveMessage);
    return () => {
      console.log(
        "ChatWidget destructor - socketConnection: ",
        socketConnection,
        " - userInfo: ",
        userInfo,
        " - currentRoom: ",
        currentRoom
      );
    };
  }, []);
  return (
    <>
      <div
        className="chat-widget 
            fixed
            bottom-0
            right-0
            flex
            flex-col"
      >
        <Conversation
          onSendMessage={onSendMessage}
          currentRoom={currentRoom}
          messages={messages}
          messagesListRef={messagesListRef}
          messageInputRef={messageInputRef}
          isOpen={isOpen}
        />
        <div
          onClick={toggleWidget}
          className="toggle-button self-end cursor-pointer select-none bg-blue-500 flex items-center justify-center border"
        >
          <img src={ChatIcon} className="w-8 h-8" />
        </div>
      </div>
    </>
  );
};
