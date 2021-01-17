import axios from "axios";
import { useFormik } from "formik";
import StatusCodes from "http-status-codes";
import isEmpty from "lodash/isEmpty";
import { useContext, useEffect, useState } from "react";
import { Facebook, Google, Twitter } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { store } from "react-notifications-component";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { getUserData } from "../APIService";
import UserContext from "../contexts/UserContext";

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
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const getCurrUser = async () => {
      const userData = (await getUserData()) || {};
      setUser(userData as User);
      setLoading(false);
    };

    getCurrUser();
  }, [setUser]);

  useEffect(() => {
    if (!isEmpty(user)) {
      if (user.userType === "unknown") {
        history.push("/choose");
      } else if (user.userType === "applicant") {
        history.push("/applicant");
      } else {
        history.push("/recruiter");
      }
    }
  }, [user, history]);

  const formikLogin = useFormik({
    initialValues: {
      loginEmail: "",
      loginPassword: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await axios.post("/api/auth/login", {
          email: values.loginEmail,
          password: values.loginPassword,
        });

        localStorage.setItem("token", response.data.token);
        store.addNotification({
          container: "bottom-right",
          type: "success",
          message: response.data.message,
          dismiss: {
            duration: 3000,
            showIcon: true,
          },
        });

        const userData = (await getUserData()) || {};
        setUser(userData as User);
      } catch (error) {
        if (error.response) {
          // Handle wrong credentials
          if (error.response.status === StatusCodes.UNAUTHORIZED) {
            formikLogin.setErrors({
              loginEmail: " ",
              loginPassword: error.response.data.message,
            });
          } else {
            store.addNotification({
              container: "bottom-right",
              type: "danger",
              message:
                error.response?.data?.message || error.response.statusText,
              dismiss: {
                duration: 3000,
                showIcon: true,
              },
            });
          }
        } else {
          store.addNotification({
            container: "bottom-right",
            type: "danger",
            message: error.message,
            dismiss: {
              duration: 3000,
              showIcon: true,
            },
          });
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const formikSignup = useFormik({
    initialValues: {
      signupName: "",
      signupEmail: "",
      signupPassword: "",
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await axios.post("/api/auth/signup", {
          name: values.signupName,
          email: values.signupEmail,
          password: values.signupPassword,
        });

        store.addNotification({
          container: "bottom-right",
          type: "success",
          message: response.data.message,
          dismiss: {
            duration: 3000,
            showIcon: true,
          },
        });

        formikSignup.setTouched({}, false);
        formikSignup.setValues({
          signupName: "",
          signupEmail: "",
          signupPassword: "",
        });
      } catch (error) {
        if (error.response) {
          if (error.response.status === StatusCodes.CONFLICT) {
            formikSignup.setErrors({
              signupEmail: error.response.data.message,
            });
          } else {
            store.addNotification({
              container: "bottom-right",
              type: "danger",
              message:
                error.response?.data?.message || error.response.statusText,
              dismiss: {
                duration: 3000,
                showIcon: true,
              },
            });
          }
        } else {
          store.addNotification({
            container: "bottom-right",
            type: "danger",
            message: error.message,
            dismiss: {
              duration: 3000,
              showIcon: true,
            },
          });
        }
      } finally {
        setLoading(false);
      }
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
          <Card className="justify-content-center">
            {loading && (
              <Spinner
                style={{ position: "absolute", zIndex: 100 }}
                className="align-self-center"
                animation="border"
              />
            )}
            <div style={{ opacity: loading ? 0.5 : 1 }}>
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
                      />
                      <Form.Control.Feedback type="invalid">
                        {formikSignup.errors.signupEmail}
                      </Form.Control.Feedback>
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
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Landing;
