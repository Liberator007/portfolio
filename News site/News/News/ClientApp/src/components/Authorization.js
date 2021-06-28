import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/loginRegistry.css';

export class Authorization  extends Component {
    static displayName = Authorization.name;
    constructor(props) {
        super(props);
        this.state = {
            keyLogin: 'login',
            keyRole: 'role',
            keyToken: 'token'
        };
    }

    async userAuthorizationSubmit (data) {
        const response = await fetch('api/authorization/authorization', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            referrer: 'no-referrer',
        })
        const tokenObject = await response.json();
        if (response.ok === true) {
            localStorage.setItem(this.state.keyLogin, tokenObject.username);
            localStorage.setItem(this.state.keyRole, tokenObject.role);
            localStorage.setItem(this.state.keyToken, tokenObject.token);
            window.location.href = '/';
        } else {
            alert('Неправильный логин или пароль');
            return;
        }
    }

    userAuthorization = (e) => {
        e.preventDefault();
        let username = e.currentTarget.elements[0].value;
        let password = e.currentTarget.elements[1].value;
        let body = {
            Username: username,
            Password: password,
        };
        this.userAuthorizationSubmit(body);
    }

    render() {
        return (
            <div>
                <div class="tab row justify-content-center">
                    <Form onSubmit={this.userAuthorization}>
                        <h1>Авторизация</h1>
                        <br />
                        <br />
                        <FormGroup>
                            <Label for="username">Имя пользователя</Label>
                            <Input name="username" id="username" placeholder="Имя пользователя" required />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Пароль</Label>
                            <Input type="password" name="password" id="password" placeholder="Пароль" required />
                        </FormGroup>
                        <Button color="success">Войти</Button>
                    </Form>
                </div>
            </div>
        );
    }
}