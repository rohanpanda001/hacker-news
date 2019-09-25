import React from "react";
import "./App.css";
import { Pagination, Tooltip } from "antd";
import {
  Divider,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid
} from "@material-ui/core";
import { Star } from "@material-ui/icons";
import axios from "axios";
import moment from "moment";

function CL(args) {
  console.log(args);
}

const PAGE_LIMIT = 10;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articleIds: [],
      articles: [],
      diff: [],
      currentPage: 1,
      loading: false
    };
  }
  componentDidMount() {
    this.getArticleIds();
  }

  getArticleIds = async () => {
    const { articleIds = [] } = this.state;

    this.setState({ loading: true });
    const response = await axios.get(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    const { data: newIds } = response;
    const oldIds = articleIds;
    const diff = newIds.filter(id => !oldIds.includes(id));
    this.setState(
      { articleIds: newIds, diff, loading: false },
      this.getArticles
    );
    setTimeout(this.getArticleIds, 5000);
  };

  getArticles = async () => {
    const { articleIds, currentPage, diff = [], articles = [] } = this.state;
    if (diff.length) {
      this.setState({ loading: true });
      const startIndex = (currentPage - 1) * PAGE_LIMIT;
      const topArtcles = articleIds.slice(startIndex, startIndex + PAGE_LIMIT);
      const promises = topArtcles.map(article =>
        axios.get(`https://hacker-news.firebaseio.com/v0/item/${article}.json`)
      );
      const responses = await Promise.all(promises);
      const newArticles = responses.map(res => {
        const data = res.data;
        if (diff.includes(data.id)) {
          return { ...data, highlight: true };
        }
        return { ...data, highlight: false };
      });
      this.setState({ articles: newArticles, loading: false });
    } else {
      this.setState({
        articles: articles.map(article => ({ ...article, highlight: false }))
      });
    }
  };

  render() {
    const { loading, articles = [] } = this.state;
    return (
      <div style={{ padding: 50 }}>
        <div style={{ display: "flex", marginBottom: 10 }}>
          <div style={{ flex: 1, display: "flex" }}>
            <Typography variant="h3" style={{ marginRight: 10 }}>
              Hacker News
            </Typography>
            {loading && (
              <CircularProgress size={20} style={{ alignSelf: "center" }} />
            )}
          </div>
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
          {articles.map(article => {
            const { title, score, by, time, url, highlight } = article;
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
                      <div style={{ display: "flex" }}>
                        <Tooltip
                          title={title}
                          placement="left"
                          style={{ width: "80%" }}
                        >
                          <Typography
                            variant="h6"
                            style={{
                              "white-space": "nowrap",
                              overflow: "hidden",
                              "text-overflow": "ellipsis"
                            }}
                          >
                            <b>{title}</b>
                          </Typography>
                        </Tooltip>
                        {highlight && (
                          <span style={{ color: "green" }}>
                            <Star />
                          </span>
                        )}
                      </div>
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
          })}
        </div>
      </div>
    );
  }
}

export default App;
