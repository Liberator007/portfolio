import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/loginRegistry.css';

export class Registration extends Component {
    static displayName = Registration.name;
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    userRegistrySubmit = (data) => {
        fetch('api/registry/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            referrer: 'no-referrer',
        })
            .then(response => {
                if (response.ok !== true) {
                    alert('Имя пользователя уже существует');
                }
                else {
                    alert('На вашу почту было выслано письмо для подтвреждения регистрации, передйтите по ссылке в письме для ее окончания');
                    window.location.href = '/authorization';
                }
            })
    }

    userRegistry = (e) => {
        e.preventDefault();

        let username = e.currentTarget.elements[0].value;
        let email = e.currentTarget.elements[1].value
        let password = e.currentTarget.elements[2].value;
        let passwordRepeat = e.currentTarget.elements[3].value;

        if (username.length >= 8) {
            if (password.length >= 8) {
                if (password == passwordRepeat) {
                    let body = {
                        Username: username,
                        Email: email,
                        Password: password
                    };
                    this.userRegistrySubmit(body);
                }
                else {
                    alert("Пароли не совпадают");
                }
            }
            else {
                alert("Пароль слишком короткий");
            }

        } else {
            alert("Имя пользователя слишком короткое");
        }
    }

    render() {
        return (
            <div>
                <div class="tab row justify-content-center">
                    <Form onSubmit={this.userRegistry}>
                        <h1>Регистрация</h1>
                        <br />
                        <br />
                        <FormGroup>
                            <Label for="username">Имя пользователя</Label>
                            <Input name="username" id="username" placeholder="Имя пользователя" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Электронная почта</Label>
                            <Input name="email" id="email" placeholder="Электронная почта" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Пароль</Label>
                            <Input type="password" name="password" id="password" placeholder="Пароль" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="passwordRepeat">Подтвердите свой пароль</Label>
                            <Input type="password" name="passwordRepeat" id="passwordRepeat" placeholder="Подтверждение пароля" />
                        </FormGroup>
                        <Button color="success">Зарегистрироваться</Button>
                    </Form>
                </div>
            </div>
        );
    }
}