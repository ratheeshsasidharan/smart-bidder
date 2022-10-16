import {Button, Col, Row} from "reactstrap";
import {useForm} from "react-hook-form";
import {useAppDispatch, useAppSelector} from "../config/store";
import {login} from "./authentication.reducer";

export const Login = () => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
    const loginSubmit = data => {
        const loginData = {
            ...data
        };
        dispatch(login(data.username, data.password));
    }

    return (
      <div>
          <form onSubmit={handleSubmit(loginSubmit)}>
              <Row className="justify-content-center">
                  <Col md="12">
                      <h2 id="login">
                          Login
                      </h2>
                  </Col>
              </Row>
              <Row className="justify-content-center">
                  <Col md="4" class="form-group">
                      <label htmlFor="username">Username</label>
                      <input className="form-control" defaultValue="" {...register("username",{ required: true })} />
                      {errors.username?.type === 'required' && <p role="alert">Username is required</p>}
                  </Col>
              </Row>
              <Row className="justify-content-center">
                  <Col md="4" class="form-group">
                      <label htmlFor="username">Password</label>
                      <input className="form-control" type="password" defaultValue="" {...register("password",{ required: true })} />
                      {errors.password?.type === 'required' && <p role="alert">Password is required</p>}
                  </Col>
              </Row>
              <Row className="justify-content-center" style={{paddingTop:"20px"}}>
                  <Col md="6" class="form-group">
                  </Col>
                  <Col md="2" class="form-group" style={{textAlign:"right"}}>
                      <Button color="primary" type="submit" data-cy="submit">
                          Sign in
                      </Button>
                  </Col>
              </Row>
          </form>
      </div>
    );
}

export default Login;