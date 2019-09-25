import React from "react";
import {
  Button,
  Divider,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid
} from "@material-ui/core";
import axios from "axios";
import moment from "moment";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articleIds: [],
      articles: [],
      limit: 10,
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
    const { limit, articleIds } = this.state;
    const topArtcles = articleIds.slice(0, limit);
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
        <Typography variant="h3">Hacker News</Typography>
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
                        <Typography variant="h6">
                          <b>{title}</b>
                        </Typography>
                        <Typography variant="subtitle1">{by}</Typography>
                        <Typography variant="overline" display="block">
                          {moment(time).format("LLL")}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Typography variant="h4">{score}</Typography>
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
