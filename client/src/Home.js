import React, { useState, useCallback } from "react";

import { Login } from "./Login";
import { DJApp } from "./DJApp";
import { AdminApp } from "./AdminApp";
import { ProfileModal } from "./Profile";
import { useAppState } from "./context/App";
import { Avatar, Dropdown, Menu } from "antd";

// const BORDER_COLOR = "#353344";
const BORDER_COLOR = "#444c67";

export const Home = () => {
  const appState = useAppState();

  const { userInfo, doLogin, doLogout, isAdmin } = appState;

  const [menuVisible, setMenuVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const handleMenuClick = useCallback((e) => {
    if (e.key === "logout") {
      setMenuVisible(false);
      doLogout();
    }
    if (e.key === "profile") {
      setMenuVisible(false);
      setProfileModalVisible(true);
      // showProfile();
    }
  }, []);

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile">Profile</Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  const LogoImage = require("./images/logo.png");

  const FBShare = () => (
    <iframe
      src="https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fomnidj.kig.ro%2F&layout=button&size=small&appId=604039383843289&width=67&height=20&quote=Love"
      width="67"
      height="20"
      style={{
        border: "none",
        overflow: "hidden",
      }}
      scrolling="no"
      frameborder="0"
      allowTransparency="true"
      allow="encrypted-media"
    ></iframe>
  );

  const PrivacyPolicy = () => (
    <div className="fixed bottom-0 left-0 right-0 h-5 text-center mb-2">
      <div className="flex flex-row items-center justify-center">
        <a className="text-xs mr-2" href="privacy_policy.html" target="_blank">
          Contact, Help Desk and Privacy information
        </a>
        <FBShare />
      </div>
    </div>
  );

  if (userInfo)
    return (
      <>
        <div className="mx-auto px-20 ">
          <div className="flex flex-col h-full">
            <div className="flex-initial">
              <div className="flex flex-row justify-between items-baseline py-4">
                {/* <div className="font-semibold text-lg select-none">OmniDJ</div> */}
                <div
                  className="w-20 h-5 bg-contain bg-no-repeat bg-center"
                  style={{ backgroundImage: `url(${LogoImage})` }}
                ></div>
                <Dropdown
                  placement="bottomRight"
                  visible={menuVisible}
                  overlay={menu}
                  onVisibleChange={(flag) => setMenuVisible(flag)}
                >
                  <div className="flex flex-row items-center select-none cursor-pointer">
                    <div className="font-medium mr-2">{userInfo.username}</div>
                    <Avatar
                      style={{ backgroundColor: "#87d068" }}
                      icon="user"
                    />
                    {/* <Avatar style={{ backgroundColor: "#ffb700" }} icon="user" /> */}
                  </div>
                </Dropdown>
              </div>
              <div
                style={{ height: "1px", backgroundColor: BORDER_COLOR }}
              ></div>
            </div>
            <div className="flex-auto overflow-auto relative">
              {/* <div className="absolute inset-0"> */}
              {isAdmin === false ? <DJApp /> : <AdminApp />}
              {/* </div> */}
            </div>
            <PrivacyPolicy />
            {/* <div className="flex-initial py-2">OmniDJ</div> */}
          </div>
        </div>
        <ProfileModal
          visibility={[profileModalVisible, setProfileModalVisible]}
          onProfileEditSuccess={() => {}}
        ></ProfileModal>
      </>
    );
  else
    return (
      <>
        <Login onLogin={doLogin} /*onLoginError={doLogout}*/ />{" "}
        <PrivacyPolicy />
      </>
    );
};
