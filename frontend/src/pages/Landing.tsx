import { useFormik } from "formik";
import { useState } from "react";
import { Facebook, Google, Twitter } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  loginEmail: Yup.string().email().required().label("Email"),
  loginPassword: Yup.string().required().label("Password"),
});

const SignupSchema = Yup.object().shape({
  signupName: Yup.string().required().label("Name"),
  signupEmail: Yup.string().email().required().label("Email"),
  signupPassword: Yup.string().min(8).required().label("Password"),
});

function Landing() {
  // State denoting selected tab on landing page
  const [tab, setTab] = useState("login");

  const formikLogin = useFormik({
    initialValues: {
      loginEmail: "",
      loginPassword: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const formikSignup = useFormik({
    initialValues: {
      signupName: "",
      signupEmail: "",
      signupPassword: "",
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Container>
      <Row className="vh-100 align-items-center">
        <Col xs={7}>
          <div style={{ fontSize: "4em" }}>
            Welcome to <b>FakedIn</b>!
          </div>
          <br />
          <div style={{ fontSize: "1.5em" }}>
            A place where you can Hire and get Hired
          </div>
        </Col>
        <Col>
          <Card>
            <Card.Header>
              <Nav
                fill
                variant="tabs"
                defaultActiveKey="login"
                onSelect={(selectedTab) => {
                  if (selectedTab) {
                    setTab(selectedTab);
                  }
                }}
              >
                <Nav.Item>
                  <Nav.Link eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="signup">Signup</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            {tab === "login" && (
              <Card.Body>
                <Card.Title>Login</Card.Title>
                <Form onSubmit={formikLogin.handleSubmit}>
                  <Form.Group controlId="loginEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      onChange={formikLogin.handleChange}
                      value={formikLogin.values.loginEmail}
                      onBlur={formikLogin.handleBlur}
                      isInvalid={
                        formikLogin.touched.loginEmail &&
                        !!formikLogin.errors.loginEmail
                      }
                      isValid={
                        formikLogin.touched.loginEmail &&
                        !formikLogin.errors.loginEmail
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikLogin.errors.loginEmail}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="loginPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={formikLogin.handleChange}
                      value={formikLogin.values.loginPassword}
                      onBlur={formikLogin.handleBlur}
                      isInvalid={
                        formikLogin.touched.loginPassword &&
                        !!formikLogin.errors.loginPassword
                      }
                      isValid={
                        formikLogin.touched.loginPassword &&
                        !formikLogin.errors.loginPassword
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikLogin.errors.loginPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button variant="dark" type="submit">
                    Login
                  </Button>
                </Form>
              </Card.Body>
            )}
            {tab === "signup" && (
              <Card.Body>
                <Card.Title>Sign Up</Card.Title>
                <Form onSubmit={formikSignup.handleSubmit}>
                  <Form.Group controlId="signupName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Name"
                      onChange={formikSignup.handleChange}
                      value={formikSignup.values.signupName}
                      onBlur={formikSignup.handleBlur}
                      isInvalid={
                        formikSignup.touched.signupName &&
                        !!formikSignup.errors.signupName
                      }
                      isValid={
                        formikSignup.touched.signupName &&
                        !formikSignup.errors.signupName
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikSignup.errors.signupName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="signupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      onChange={formikSignup.handleChange}
                      value={formikSignup.values.signupEmail}
                      onBlur={formikSignup.handleBlur}
                      isInvalid={
                        formikSignup.touched.signupEmail &&
                        !!formikSignup.errors.signupEmail
                      }
                      isValid={
                        formikSignup.touched.signupEmail &&
                        !formikSignup.errors.signupEmail
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikSignup.errors.signupEmail}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group controlId="signupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={formikSignup.handleChange}
                      value={formikSignup.values.signupPassword}
                      onBlur={formikSignup.handleBlur}
                      isInvalid={
                        formikSignup.touched.signupPassword &&
                        !!formikSignup.errors.signupPassword
                      }
                      isValid={
                        formikSignup.touched.signupPassword &&
                        !formikSignup.errors.signupPassword
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formikSignup.errors.signupPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button variant="dark" type="submit">
                    Sign Up
                  </Button>
                </Form>
              </Card.Body>
            )}
            <hr />
            <Card.Body>
              <Card.Title>Or continue with</Card.Title>
              <div className="d-flex justify-content-around">
                <Button variant="dark" type="submit">
                  <Google />
                  &nbsp;&nbsp;Google
                </Button>
                <Button variant="dark" type="submit">
                  <Facebook />
                  &nbsp;&nbsp;Facebook
                </Button>
                <Button variant="dark" type="submit">
                  <Twitter />
                  &nbsp;&nbsp;Twitter
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Landing;
