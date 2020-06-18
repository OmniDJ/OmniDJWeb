import React, { useCallback, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Button, Modal, message } from "antd";
import { TextInput } from "forms/Controls";

export const CreateRoomModal = ({ visibility, onSuccess, createRoom }) => {
  const [modalVisible, setModalVisible] = visibility;
  const [modalLoading, setModalLoading] = useState(false);
  const descriptionInputRef = useCallback((node) => {
    if (node) node.focus();
  }, []);

  const onCancel = useCallback(() => {
    setModalVisible(false);
  }, [setModalVisible]);

  const onOk = useCallback(
    (values) => {
      createRoom({
        description: String(values.description),
        numPublishers: Number(10),
        notify_joining: true,
      }).then((result) => {
        setModalLoading(false);
        setModalVisible(false);
        onSuccess && onSuccess();
      });
    },
    [createRoom, onSuccess, setModalVisible]
  );

  const formik = useFormik({
    initialValues: {
      description: "",
    },
    validationSchema: Yup.object({
      description: Yup.string().required("Please enter a description"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      onOk(values);
    },
    validate: (values) => {
      const errors = {};
      if (values.password !== values.confirmPassword) {
        errors.passwordConfirmation = "Passwords do not match";
      }
      return errors;
    },
  });

  useEffect(() => {
    if (modalVisible === true) {
      formik.resetForm();
    }
  }, [modalVisible]);

  return (
    <Modal
      title="Create a new virtual scene"
      visible={modalVisible}
      footer={[
        <Button key="back" onClick={onCancel}>
          Return
        </Button>,
        <Button
          key="register"
          type="primary"
          loading={modalLoading}
          onClick={() => formik.handleSubmit()}
        >
          Create virtual scene
        </Button>,
      ]}
      onCancel={onCancel}
      destroyOnClose={true}
    >
      <form onSubmit={formik.handleSubmit}>
        <TextInput
          label="Description"
          name="description"
          type="text"
          placeholder="Enter a description for this virtual scene"
          formik={formik}
          theRef={descriptionInputRef}
        />
      </form>
    </Modal>
  );
};
