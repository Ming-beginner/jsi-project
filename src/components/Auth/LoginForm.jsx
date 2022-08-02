import React, {useState} from 'react'
import {Form, Button} from 'react-bootstrap'
import { Formik } from 'formik';
import * as yup from 'yup';

const LoginForm = () => {
  const [validated, setValidated] = useState(false);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };
  const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters long.')
  });
  return (
    <Formik
        initialValues={{ email: '', password: '', terms: false, }}
        validate={values => {
            const errors = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
                errors.email = 'Invalid email address';
            }
            return errors;
       }}
    >
        {({
         values,
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit,
         isSubmitting,
         /* and other goodies */
       }) => (
            <Form noValidate onSubmit={handleSubmit}>
                <Form.Group md="3" controlId="validationFormik05">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.email}
                    />
                </Form.Group>
                <Form.Group md="3" controlId="validationFormik06">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!errors.password}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Check
                    required
                    name="terms"
                    label="Agree to terms and conditions"
                    onChange={handleChange}
                    isInvalid={!!errors.terms}
                    feedback={errors.terms}
                    feedbackType="invalid"
                    id="validationFormik0"
                    />
                </Form.Group>
                <Button>Submit form</Button>
            </Form>
       )}
    </Formik>
  )
}

export default LoginForm