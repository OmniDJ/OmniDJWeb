import React, { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useAppState } from "./context/App";

import { Button, Col, Select, Modal, message } from "antd";
import { TextInput, SelectInput } from "forms/Controls";

const { Option } = Select;

export const RegisterGoogleModal = ({
  visibility,
  values,
  onRegisterSuccess,
}) => {
  const [modalVisible, setModalVisible] = visibility;
  const [modalValues, setModalValues] = values;
  const [registerGoogleModalLoading, setRegisterGoogleModalLoading] = useState(
    false
  );

  const appState = useAppState();
  let { backendServer } = appState;
  const focusedField = useCallback((node) => {
    if (node) node.focus();
  }, []);

  const onOk = useCallback(
    (values) => {
      fetch(backendServer + "/users/login-google", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          accountType: values.accountType,
          token: values.token,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.error) {
            handleError(json.error);
            setRegisterGoogleModalLoading(false);
          } else {
            setRegisterGoogleModalLoading(false);
            setModalVisible(false);
            onRegisterSuccess(json);
          }
        })
        .catch((error) => {
          handleError(error);
          setRegisterGoogleModalLoading(false);
        });
    },
    [backendServer, onRegisterSuccess, setModalVisible]
  );

  const formik = useFormik({
    initialValues: modalValues,
    validationSchema: Yup.object({
      username: Yup.string().required("Please enter a username"),
      firstName: Yup.string().required("Please enter first name"),
      lastName: Yup.string().required("Please enter last name"),
      accountType: Yup.string()
        .oneOf(["dj", "viewer"])
        .required("Please specify an account type"),
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
      key: "registerError",
      duration: 2,
    });
  };

  useEffect(() => {
    formik.setValues(modalValues);
  }, [modalValues]);

  return (
    <Modal
      title="Create an account to use OmniDJ"
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
          key="register"
          type="primary"
          loading={registerGoogleModalLoading}
          onClick={() => formik.handleSubmit()}
        >
          Create account
        </Button>,
      ]}
      destroyOnClose={true}
    >
      <Col>
        <form onSubmit={formik.handleSubmit}>
          <TextInput
            label="E-mail"
            name="email"
            type="email"
            placeholder="Enter your e-mail"
            formik={formik}
            disabled
          />
          <TextInput
            label="First name"
            name="firstName"
            type="text"
            placeholder="Enter first name"
            theRef={focusedField}
            formik={formik}
          />
          <TextInput
            label="Last name"
            name="lastName"
            type="text"
            placeholder="Enter last name"
            formik={formik}
          />
          <SelectInput
            label="Account Type"
            name="accountType"
            value={formik.values.accountType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            formik={formik}
          >
            <Option value="dj">DJ</Option>
            <Option value="viewer">Viewer</Option>
          </SelectInput>
        </form>
      </Col>
    </Modal>
  );
};
