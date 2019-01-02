import { FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import React from "react";

function FieldGroup({ id, label, validationState, ...props }) {
  return (
    <FormGroup controlId={id} validationState={validationState}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      <FormControl.Feedback />
    </FormGroup>
  );
}

export default FieldGroup;
