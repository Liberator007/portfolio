import React, { Component } from 'react';
import {
    Card, Button, CardImg, CardTitle, CardText, CardDeck,
    CardSubtitle, CardBody
} from 'reactstrap';
import { Article } from './Article';
import './css/button.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './css/image.css';
import './css/article.css';
import './css/comment.css';
import './css/link.css';

export class ArticleListSearch extends Component {
    static displayName = ArticleListSearch.name;
    constructor(props) {
        super(props);
        this.state = {
            keyLogin: 'login',
            keyToken: 'token',
            articleID: 0,
            search: 0,
            listImageID: [],
            listImage: [],
            listTopic: [],
            listPreview: [],
            listArticle: [],
            listTopic: [],
            listRateArticle: []
        };
    }

    componentDidMount() {
        const search = this.props.match.params.search;
        this.setState({ search: search });
        this.getPreviewListRequest();
        this.getArticleListRequest(search);
        this.getRateArticleList();
        this.getTopicListRequest();
    }

    getArticleListRequest = (search) => {
        let url = 'api/article/getArticleListSearchName?search=' + search;
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then(response => {
                for (var i = 0; i < response.length; i++) {
                    response[i].dateRelease = this.parseDatetime(response[i].dateRelease);
                }
                this.setState({ listArticle: response });
            })
    }

    getPreviewListRequest = () => {
        let url = 'api/preview/getPreviewList';
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ listPreview: response });
                for (let preview of response) {
                    this.getImageSelectById(preview.imageID);
                };
            })
    }

    getImageSelectById = (imageID) => {
        fetch('api/image/getImage?imageID=' + imageID, {
            method: 'GET',
        })
            .then(response => {
                let listImage = this.state.listImage;
                listImage.push({ "imageID": imageID, "url": response.url });
                this.setState({ listImage: listImage });
            })
    }

    getRateArticleList = () => {
        let url = 'api/rateArticle/getRateArticleList';
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ listRateArticle: response });
            })
    }

    getTopicListRequest = () => {
        let url = 'api/article/getTopicList';
        fetch(url, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then(response => {
                this.setState({ listTopic: response });
            })
    }

    goToOneArticle = (articleID) => {
        window.location.href = '/article/articleID=' + articleID;
    }

    render() {
        let listArticle = this.state.listArticle;
        let listTopic = this.state.listTopic;
        let listImage = this.state.listImage;
        let listPreview = this.state.listPreview;
        let search = this.state.search;
        let widthImage = 318;
        let heightImage = 180;
        return (
            <div>
                <h3>Результаты поиска по слову "{search}"</h3>
                {listArticle
                    .map(article =>
                        <div>
                            {listPreview
                                .filter(preview => preview.previewID == article.previewID)
                                .slice(0, 3)
                                .map(preview =>
                                    <div>
                                        <div class="my-3 p-3 bg-body rounded shadow-sm">
                                            <h5 class="border-bottom pb-2 mb-0">
                                                <a class="item" onClick={() => this.goToOneArticle(article.articleID)}>{article.name}</a>
                                            </h5>
                                            <a class="item" onClick={() => this.goToOneArticle(article.articleID)}>
                                                <div class="d-flex text-muted pt-3">
                                                    {listImage
                                                        .filter(image => image.imageID == preview.imageID)
                                                        .slice(0, 1)
                                                        .map(image =>
                                                            <img src={image.url} class="bd-placeholder-img flex-shrink-0 me-2 rounded list" width="80" height="80"></img>
                                                        )}
                                                    <p class="pb-3 mb-0 small lh-sm border-bottom">
                                                        {listTopic
                                                            .filter(topic => article.topicID == topic.topicID)
                                                            .slice(0, 1)
                                                            .map(topic =>
                                                                <strong class="d-block text-gray-dark">&emsp; {topic.name}</strong>
                                                            )}
                                                        <p class="text-muted text-sm"><i class="fa fa-mobile fa-lg"></i>&emsp; {article.dateRelease}</p>
                                                    &emsp; {article.description}
                                                    </p>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                )}
                        </div>
                )}
                <br />
                <br />
            </div>
        );
    }

    parseDatetime = (dateAndTime) => {
        if (dateAndTime.length > 0) {
            let datetime = ('' + dateAndTime + '').split("T");
            let date = datetime[0].split("-");
            let time = datetime[1].split(":");
            datetime = date[2] + "-" + date[1] + "-" + date[0] + ", " + time[0] + ":" + time[1];
            return datetime;
        }
    }
}