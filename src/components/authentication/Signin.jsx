import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link as ReactLink, useLocation, useNavigate } from "react-router-dom";
import { usePostSigninMutation } from "globalStore/dashboardApi";
import { useSelector } from "react-redux";

export default function Signin() {
  const [sent, setSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from.pathname || "/dashboard";

  console.log(from);
  const [postSignin, { isLoading, isError, error, isSuccess }] =
    usePostSigninMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setSent(true);
    setSubmitting(true);

    const resp = {
      email: data.get("email"),
      password: data.get("password"),
    };

    await postSignin(resp)
      .unwrap()
      .then((response) => {
        console.log("RESP1:", response);
        setSent(false);
        setSubmitting(false);
      })
      .then((error) => {
        console.log(error);
      })
      .catch((error) => {
        // console.log("Dilip");
        setSent(false);
        setSubmitting(false);
      });

    // console.log("DDRESP:", response);

    // navigate("/");
  };

  useEffect(() => {
    if (isSuccess) {
      // toast.success('You successfully logged in');
      navigate(from);
    }
    if (isError) {
      if (Array.isArray(error.data.error)) {
        error.data.error.forEach(
          (el) => {
            setErrorMsg(el.message);
            setSent(false);
            setSubmitting(false);
          }
          // console.log("DILIPEL::", el.message)
        );
      } else {
        // toast.error((error as any).data.message, {
        //   position: 'top-right',
        // });
        setSent(false);
        setSubmitting(false);
        setErrorMsg(error.data.message);
        console.log(error.data.message);
      }
    }
  }, [isLoading]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOpenOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {errorMsg}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={submitting || sent}
          >
            {submitting || sent ? "In progress…" : "Sign In"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgotPassword" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item xs>
              <Link href="/changePassword" variant="body2">
                Change password?
              </Link>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              marginTop: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "end",
            }}
          >
            <Grid item>
              {/* <Link href="" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link> */}
              <ReactLink underline="none" to="/Signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </ReactLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
