import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';

import { Home } from './components/Home';
import { Registration } from './components/Registration';
import { Authorization } from './components/Authorization';
import { Administration } from './components/Administration';
import { Profile } from './components/Profile';
import { EditArticle } from './components/EditArticle';
import { Article } from './components/Article';
import { ArticleListTopic } from './components/ArticleListTopic';
import { ArticleListSearch } from './components/ArticleListSearch';
import { EmailConfirmed } from './components/EmailConfirmed';

import './custom.css';


export default class App extends Component {
    static displayName = App.name;

    render () {
        return (
            <Layout>
                <Route exact path='/' component={Home} />
                <Route exact path='/article/articleID=:articleID' component={Article} />
                <Route exact path='/article-list-topic/:topicID' component={ArticleListTopic} />
                <Route exact path='/article-list-search/:search' component={ArticleListSearch} />
                <Route exact path='/registration' component={Registration} />
                <Route exact path='/authorization' component={Authorization} />
                <Route exact path='/administration' component={Administration} />
                <Route exact path='/profile/:userID' component={Profile} />
                <Route exact path='/administration/edit-article/:articleID' component={EditArticle} />

                <Route exact path='/email-confirmed/username=:username&token=:token' component={EmailConfirmed} />
            </Layout>
        );
    }
}
