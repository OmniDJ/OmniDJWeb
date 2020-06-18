import React, { useState, useRef, useEffect } from "react";
import { useAppState } from "./context/App";
import { message, Button, Input, Row, Col, Typography, Modal } from "antd";
import { Icon } from "antd";

import { RegisterModal } from "./Register";

import { RegisterGoogleModal } from "./RegisterGoogle";
import GoogleLogin from "react-google-login";

const UEImage = require("./images/ue.jpg");

const { Text } = Typography;

const enterUsernameKey = "enterusername";
const loginErrorKey = "loginerror";

const LogoImage = require("./images/logo.png");

export const Login = ({ onLogin, onLoginError }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [registerGoogleModalVisible, setRegisterGoogleModalVisible] = useState(
    false
  );
  const [registerGoogleValues, setRegisterGoogleValues] = useState({
    email: "google",
    firstName: "google",
    lastName: "google",
    accountType: "viewer",
  });

  const appState = useAppState();
  let { backendServer } = appState;

  const loginUserRef = useRef();
  const loginPassRef = useRef();

  const handleError = (json) => {
    console.log("Got error: ", json);
    message.error({
      content: json.error,
      key: loginErrorKey,
      duration: 2,
    });
    onLoginError && onLoginError(json);
  };

  useEffect(() => {
    loginUserRef.current.focus();
  }, []);

  const onLoginClick = (e) => {
    e.preventDefault();
    if (username === "") {
      message.error("Please enter a username");
      return;
    }
    if (password === "") {
      message.error("Please enter a password");
      return;
    }
    fetch(backendServer + "/users/login", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => {
        if (response.ok === false) {
          if (response.statusText === "UNAUTHORIZED") {
            message.error("Please check username and password and try again");
          } else
            Modal.error({
              title: "Could not login",
              content: "Server said: " + response.statusText,
            });
          throw new Error("Could not login");
        }
        return response.json();
      })
      .then((json) => {
        if (json.error) {
          handleError(json);
        } else {
          const accessToken = json.access_token;
          onLogin(accessToken);
        }
      })
      .catch((error) => {
        console.log("Error on json: ", error);
      })
      .catch((error) => {
        console.log("Error on login: ", error);
      });
  };

  const onUsernameEnter = () => {
    console.log("onUsernameEnter");
    if (username === "") {
      message.error({
        content: "Please enter a username",
        key: enterUsernameKey,
        duration: 2,
      });
      loginUserRef.current.focus();
    } else {
      loginPassRef.current.focus();
    }
  };

  const onRegisterClick = () => {
    setRegisterModalVisible(true);
  };

  const onRegisterSuccess = (params) => {
    console.log("onRegisterSuccess - params: ", params);
    setUsername(params.username);
    setPassword(params.password);
  };

  const onRegisterGoogleSuccess = (params) => {
    console.log("onRegisterGoogleSuccess - params: ", params);
    onLogin(params.access_token);
  };

  const onGoogleLoginSuccess = (response) => {
    console.log(response);
    fetch(backendServer + "/users/login-google", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: response.tokenId,
      }),
    })
      .then((response) => {
        console.log("login-google response is: ", response);
        return response.json();
      })
      .then((json) => {
        if (json.error) {
          console.log("login-google failed with error: ", json);
          setRegisterGoogleValues({
            username: json.info.email,
            email: json.info.email,
            firstName: json.info.firstName,
            lastName: json.info.lastName,
            accountType: "viewer",
            token: response.tokenId,
          });
          setRegisterGoogleModalVisible(true);
        } else {
          const accessToken = json.access_token;
          onLogin(accessToken);
        }
      });
  };

  const onGoogleLoginFailed = (response) => {
    console.log("Google login FAILED");
    console.log(response);
  };

  return (
    <Col>
      <Row type="flex" justify="center" align="middle">
        <div className="w-full bg-white flex justify-center">
          <div
            className="bg-contain bg-center bg-no-repeat rounded"
            style={{
              width: "40em",
              height: "5em",
              backgroundImage: `url(${UEImage})`,
            }}
          ></div>
        </div>
      </Row>
      <Row type="flex" justify="center" align="middle" className="py-4">
        {/* <Title level={2}>OmniDJ</Title> */}
        <div
          className="w-20 h-5 bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${LogoImage})` }}
        ></div>
      </Row>
      <Row type="flex" justify="center" align="middle">
        <form>
          <div className="py-2">
            <Text strong>Username</Text>
            <div className="mt-2">
              <Input
                ref={loginUserRef}
                placeholder="Enter a username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onPressEnter={onUsernameEnter}
              />
            </div>
          </div>
          <div className="py-2">
            <Text strong>Password</Text>
            <div className="mt-2">
              <Input.Password
                placeholder="Enter a password"
                ref={loginPassRef}
                // type="password"
                // name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onPressEnter={onLoginClick}
              />
            </div>
          </div>
          <div className="py-2">
            Don't have an account?{" "}
            <span
              onClick={onRegisterClick}
              className="text-blue-200 cursor-pointer select-none"
            >
              Create one
            </span>
          </div>
        </form>
      </Row>
      <Row type="flex" justify="center" align="middle">
        <div className="py-5">
          <Button onClick={onLoginClick}>Login</Button>
        </div>
      </Row>
      <Row type="flex" justify="center" align="middle">
        <div className=""></div>
      </Row>
      <Row type="flex" justify="center" align="middle">
        <GoogleLogin
          clientId="616734494172-vmk91do8de4l853tn9fatgjn33f0jpfb.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={onGoogleLoginSuccess}
          onFailure={onGoogleLoginFailed}
          cookiePolicy={"single_host_origin"}
          render={(renderProps) => (
            <Button
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <Icon
                type="google"
                style={{ verticalAlign: "middle", marginTop: "-4px" }}
              />
              Login with Google
            </Button>
          )}
        />
      </Row>

      <RegisterModal
        visibility={[registerModalVisible, setRegisterModalVisible]}
        onRegisterSuccess={onRegisterSuccess}
      />
      <RegisterGoogleModal
        visibility={[registerGoogleModalVisible, setRegisterGoogleModalVisible]}
        values={[registerGoogleValues, setRegisterGoogleValues]}
        onRegisterSuccess={onRegisterGoogleSuccess}
      />
    </Col>
  );
};
