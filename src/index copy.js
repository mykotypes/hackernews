import './index.css';
import React from "react";
import ReactDOM from "react-dom";
import moment from 'moment'

function HackerNewsPosts({ posts }) {
  if (posts.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>HackerNews Top 10 Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <a href={post.url}>
                <span>Score: </span><span>{post.score}</span>
                <h3>{post.title}</h3>
                <span>posted at: {moment(post.time).format("dddd MMM YYYY")}{" "}</span>
                <p>Author: {post.by}</p>
                </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [posts, setPosts] = React.useState([]);
//   const [posts, setPosts] = React.useState([]);

  React.useEffect(() => {
    async function getTopStories() {
      const url = "https://hacker-news.firebaseio.com/v0/topstories.json";
      try {
        const response = await fetch(url);
        if (response.ok === false) {
          throw new Error("Response Error:" + response.text);
        }
        const json = await response.json();
        const promises = json
          .slice(0, 10)
          .map(id =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
              response => response.json()
            )
          );
        const result = await Promise.all(promises);
        setPosts(result);
      } catch (err) {
        console.error(err);
      }
    }
    getTopStories();
  }, []);

  return (
    <div className="app">
      <HackerNewsPosts posts={posts} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
