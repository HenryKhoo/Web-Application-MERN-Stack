import React, { Component } from 'react';
import {Link} from "react-router-dom";
import swal from 'sweetalert';
import { Button, TextField } from '@material-ui/core';

const axios = require('axios');
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    document.body.style.backgroundColor = "#D7E5F0";

  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  login = () => {

    const pwd = bcrypt.hashSync(this.state.password, salt);

    axios.post('https://limitless-beyond-20794.herokuapp.com/login', {
      username: this.state.username,
      password: pwd,
    }).then((res) => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user_id', res.data.id);

      document.body.style.background = "#34065b";
      swal({
        text: "Successful Login",
        icon: "success",
        type: "success"
      });
      this.props.history.push('/app');
    }).catch((err) => {
      if (err.response && err.response.data && err.response.data.errorMessage) {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error"
        });
      }
    });
  }

  render() {
    return (
      <div className="userAuth" style={{ marginTop: '200px' }}>
        <div>
          <h2>Login</h2>
        </div>
        <br/>
        <div>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            value={this.state.username}
            onChange={this.onChange}
            placeholder="User Name"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            placeholder="Password"
            required
          />
          <br /><br />
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="large"
            disabled={this.state.username === '' && this.state.password === ''}
            onClick={this.login}
          >
            Login
          </Button> 
          <div className='footer'><Link to ="/register">New User? Register Here</Link></div>
        </div>
      </div>
    );
  }
}
