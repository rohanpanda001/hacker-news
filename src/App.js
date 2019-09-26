import React from "react";
import "./App.css";
import { Tooltip } from "antd";
import {
  Divider,
  Typography,
  Card,
  CardContent,
  Grid
} from "@material-ui/core";
import { Star } from "@material-ui/icons";
import axios from "axios";
import moment from "moment";
import Header from "./Header";

function CL(args) {
  console.log(args);
}

const POLLING_INTERVAL = 1000 * 60 * 5;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articleIds: [],
      articles: [],
      diff: [],
      currentPage: 1,
      loading: false,
      sortBy: "none",
      sortOrder: "asc",
      pageLimit: 20
    };
  }
  componentDidMount() {
    this.getArticleIds();
  }

  getArticleIds = async () => {
    const { articleIds = [], articles = [] } = this.state;

    this.setState({ loading: true });
    const response = await axios.get(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    const { data: newIds } = response;
    const oldIds = articleIds;
    const diff = newIds.filter(id => !oldIds.includes(id));
    this.setState({ articleIds: newIds, diff, loading: false }, () => {
      if (!diff.length) {
        this.setState({
          articles: articles.map(article => ({ ...article, highlight: false }))
        });
      } else {
        this.getArticles();
      }
    });
    setTimeout(this.getArticleIds, POLLING_INTERVAL);
  };

  getArticles = async () => {
    const {
      articleIds,
      currentPage,
      diff = [],
      pageLimit = 0,
      sortBy
    } = this.state;
    CL({ pageLimit, currentPage });
    this.setState({ loading: true });
    const startIndex = (currentPage - 1) * pageLimit;
    const topArtcles = articleIds.slice(startIndex, startIndex + pageLimit);
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
    this.setState({ articles: newArticles, loading: false }, () =>
      this.onSort(sortBy)
    );
  };

  onSort = sortBy => {
    const { articles = [], sortOrder } = this.state;

    let sortedArticles = [...articles];

    if (sortBy === "score") {
      sortedArticles = articles.sort((a, b) => a.score - b.score);
    } else {
      sortedArticles = articles.sort((a, b) =>
        a[sortBy] > b[sortBy] ? 1 : -1
      );
    }
    if (sortOrder === "desc") {
      sortedArticles.reverse();
    }
    this.setState({
      articles: sortedArticles,
      sortBy
    });
  };

  onSortOrderChange = ({ key: sortOrder }) =>
    this.setState({ sortOrder }, () => this.onSort(this.state.sortBy));

  render() {
    const {
      loading,
      articles = [],
      articleIds = [],
      sortBy,
      sortOrder,
      pageLimit
    } = this.state;

    return (
      <div style={{ paddingLeft: 50, paddingRight: 50 }}>
        <Header
          loading={loading}
          sortOrder={sortOrder}
          sortBy={sortBy}
          totalLength={articleIds.length}
          onSortOrderChange={this.onSortOrderChange}
          onSort={this.onSort}
          pageLimit={pageLimit}
          setPageLimit={limit =>
            this.setState({ pageLimit: limit }, this.getArticles)
          }
          onPageChange={page =>
            this.setState({ currentPage: page }, this.getArticles)
          }
        />
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
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}
                          >
                            <b>{title}</b>
                          </Typography>
                        </Tooltip>
                        {highlight && (
                          <span
                            style={{
                              color: "green",
                              alignSelf: "center",
                              paddingLeft: 5
                            }}
                          >
                            <Star />
                          </span>
                        )}
                      </div>
                      <Tooltip title="Author" placement="left">
                        <Typography variant="subtitle1">{by}</Typography>
                      </Tooltip>
                      <Tooltip title="Publish Date" placement="left">
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
