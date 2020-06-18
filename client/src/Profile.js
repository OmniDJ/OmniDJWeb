import React, { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useAppState } from "./context/App";

import { Button, Col, Modal, message, Typography } from "antd";
import { TextInput } from "forms/Controls";

const { Text } = Typography;

export const ProfileModal = ({ visibility, onProfileEditSuccess }) => {
  const [modalVisible, setModalVisible] = visibility;
  const [profileModalLoading, setProfileModalLoading] = useState(false);

  const appState = useAppState();
  const { authState, setAuthState, doLogout } = appState;
  let { backendServer } = appState;

  const onOk = useCallback(
    (values) => {
      fetch(backendServer + "/users/edit", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.accessToken}`,
        },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
        }),
      })
        .then((response) => {
          if (response.ok === false) {
            Modal.error({
              title: "Could not modify profile",
              content: "Server said: " + response.statusText,
            });
            doLogout();
          }
          return response.json();
        })
        .then((json) => {
          if (json.error) {
            handleError(json.error);
            setProfileModalLoading(false);
          } else {
            if (json.msg == "usermodified") {
              console.log("User was modified");
              let newAuthState = { ...authState };
              newAuthState.userInfo.firstName = json.info.firstName;
              newAuthState.userInfo.lastName = json.info.lastName;
              newAuthState.userInfo.email = json.info.email;
              setAuthState(newAuthState);
            }
            setProfileModalLoading(false);
            setModalVisible(false);
            onProfileEditSuccess(json);
          }
        })
        .catch((error) => {
          handleError(error);
          setProfileModalLoading(false);
        });
    },
    [backendServer, onProfileEditSuccess, setModalVisible]
  );

  const formik = useFormik({
    // initialValues: {
    //   username: appState.userInfo.username,
    //   email: appState.userInfo.email,
    //   firstName: appState.userInfo.firstName ? appState.userInfo.firstName : "",
    //   lastName: appState.userInfo.lastName ? appState.userInfo.lastName : "",
    // },
    validationSchema: Yup.object({
      username: Yup.string().required("Please enter a username"),
      email: Yup.string()
        .email("Please enter a valid email address")
        .required("Plese enter an email address"),
      firstName: Yup.string().required("Please enter first name"),
      lastName: Yup.string().required("Please enter last name"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      onOk(values);
    },
  });

  const onCancel = useCallback(() => {
    setModalVisible(false);
  }, [setModalVisible]);

  const handleError = (error) => {
    console.log("Got error: ", error);
    message.error({
      content: String(error),
      key: "editError",
      duration: 2,
    });
  };

  useEffect(() => {
    if (modalVisible === true) {
      formik.setValues({
        username: appState.userInfo.username,
        email: appState.userInfo.email,
        firstName: appState.userInfo.firstName
          ? appState.userInfo.firstName
          : "",
        lastName: appState.userInfo.lastName ? appState.userInfo.lastName : "",
      });
    }
  }, [modalVisible]);

  return (
    <Modal
      title="Edit your profile"
      visible={modalVisible}
      onOk={() => {
        formik.handleSubmit();
      }}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Return
        </Button>,
        <Button
          key="saveuser"
          type="primary"
          loading={profileModalLoading}
          onClick={() => formik.handleSubmit()}
        >
          Save
        </Button>,
      ]}
      destroyOnClose={true}
    >
      <Col>
        <form onSubmit={formik.handleSubmit}>
          <TextInput
            label="Username"
            name="username"
            type="text"
            placeholder="Enter a username"
            formik={formik}
          />
          <TextInput
            label="E-mail"
            name="email"
            type="email"
            placeholder="Enter your e-mail"
            formik={formik}
          />
          <TextInput
            label="First name"
            name="firstName"
            type="text"
            placeholder="Enter first name"
            formik={formik}
          />
          <TextInput
            label="Last name"
            name="lastName"
            type="text"
            placeholder="Enter last name"
            formik={formik}
          />
        </form>
        <div className="py-2">
          <Text strong>Pay for your membership</Text>
        </div>

        <div className="py-2">
          <Text strong>Total due: 0 EUR</Text>
        </div>
        <form
          action="https://www.paypal.com/cgi-bin/webscr"
          method="post"
          target="blank"
        >
          <input type="hidden" name="cmd" value="_s-xclick" />
          <input type="hidden" name="hosted_button_id" value="J3BQ3EEG9YZ9S" />
          <input
            className="outline-none"
            type="image"
            src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif"
            border="0"
            name="submit"
            alt="PayPal - The safer, easier way to pay online!"
          />
          <img
            alt=""
            border="0"
            src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
            width="1"
            height="1"
          />
        </form>
      </Col>
    </Modal>
  );
};
