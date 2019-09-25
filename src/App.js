import React from "react";
import "./App.css";
import { Pagination } from "antd";
import {
  Tooltip,
  Divider,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid
} from "@material-ui/core";
import axios from "axios";
import moment from "moment";

function CL(args) {
  console.log(args);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articleIds: [],
      articles: [],
      limit: 10,
      currentPage: 1,
      loading: false
    };
  }
  componentDidMount() {
    this.getArticleIds();
  }

  getArticleIds = async () => {
    this.setState({ loading: true });
    const response = await axios.get(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    const { data: articleIds = [] } = response;
    this.setState({ articleIds, loading: false }, () => this.getArticles());
  };

  getArticles = async () => {
    this.setState({ loading: true });
    const { limit, articleIds, currentPage } = this.state;
    const startIndex = (currentPage - 1) * limit;
    const topArtcles = articleIds.slice(startIndex, startIndex + limit);
    const promises = topArtcles.map(article =>
      axios.get(`https://hacker-news.firebaseio.com/v0/item/${article}.json`)
    );
    const responses = await Promise.all(promises);
    const articles = responses.map(res => res.data);
    this.setState({ articles, loading: false });
  };

  render() {
    const { loading, articles = [] } = this.state;
    return (
      <div style={{ padding: 50 }}>
        <div style={{ display: "flex", marginBottom: 10 }}>
          <Typography variant="h3" style={{ flex: 1 }}>
            Hacker News
          </Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Pagination
              defaultCurrent={1}
              total={500}
              onChange={page =>
                this.setState({ currentPage: page }, () => this.getArticles())
              }
            />
          </div>
        </div>
        <Divider />
        <div
          style={{
            paddingTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            articles.map(article => {
              const { title, score, by, time, url } = article;
              return (
                <Card
                  style={{
                    width: "500px",
                    marginBottom: 10,
                    cursor: "pointer"
                  }}
                  onClick={() => window.open(url, "_blank")}
                >
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={9} style={{ padding: 5 }}>
                        <Tooltip title="Title" placement="left">
                          <Typography variant="h6">
                            <b>{title}</b>
                          </Typography>
                        </Tooltip>
                        <Tooltip title="Author" placement="left">
                          <Typography variant="subtitle1">{by}</Typography>
                        </Tooltip>
                        <Tooltip title="Date" placement="left">
                          <Typography variant="overline" display="block">
                            {moment(time).format("LLL")}
                          </Typography>
                        </Tooltip>
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Typography variant="h4">
                          <Tooltip title="Score" placement="bottom">
                            <span>{score}</span>
                          </Tooltip>
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    );
  }
}

export default App;
