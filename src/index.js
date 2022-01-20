import './index.scss';
import { useState } from "react";
import React from "react";
import ReactDOM from "react-dom";
import moment from 'moment'
import axios from "axios";
import blog from './img/blog.jpg';

function HackerNewsPosts({ posts }) {
  if (posts.length === 0) {
    return <div>Loading...</div>;
  }

  // const [info, setAuthor] = useState(null);

  const clickMe = (parameter) => (event) => {
    
      const responseAuthor = axios.get(
        `https://hacker-news.firebaseio.com/v0/user/${parameter}.json`
      );
      
      console.log(responseAuthor);
  }

  return (
    <div>
        <header>
          <h1>HackerNews Top 10 Posts</h1>
          <img src={blog} alt="blog" />
      </header>
      <ul className='news'>
        {posts.map(post => (
            <div className='inner'>
              <li key={post.id}>
                <div className='front'>
                  <h3>{post.title}</h3>
                </div>
                <div className='back'>
                  <span>Score: </span><span>{post.score}</span>
                  <span>posted on: {moment(post.time).format('dddd')}</span>
                  <p>Author id: {post.by}</p>
                  <button onClick={clickMe(post.by)} >Karma</button>
                  <a href={post.url}>Link url</a>

                </div>
              </li>
            </div>
        ))}
        
      </ul>
    </div>
  );
}

function App() {
  const [posts, setPosts] = React.useState([]);

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
