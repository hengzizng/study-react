import './App.css';

function Header(props) {
  return (
    <header>
      <h1>
        <a
          href="/"
          // (event) => {}  =  function (event) {}
          onClick={(event) => {
            // 원래 a 태그의 동작을 방지 (reload 방지)
            event.preventDefault();
            // 상위 컴포넌트(App) 에서 정의한 onChangeMode를 호출
            props.onChangeMode();
          }}>
          {props.title}
        </a>
      </h1>
    </header>
  );
}

function Nav(props) {
  const lis = [];

  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    // 자동으로 생성한 태그의 경우
    // react가 이 태그들을 추적해야 하는데
    // 이때 이 추적의 근거로서 key라는 약속된 prop을 부여
    lis.push(
      <li key={t.id}>
        <a id={t.id} href={'/read/' + t.id} onClick={event => {
          event.preventDefault();
          // event.target : event를 유발시킨 태그를 가리킴
          props.onChangeMode(event.target.id);
        }}>{t.title}</a>
      </li>
    );
  }

  return (
    <nav>
      <ol>
        {lis}
      </ol>
    </nav>
  );
}

function Article(props) {
  return (
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  );
}

function App() {
  const topics = [
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'javascript is ...'}
  ]

  return (
    <div className="App">
      <Header
        title="WEB"
        onChangeMode={() => {
          alert('Header');
        }}>
      </Header>
      <Nav
        topics={topics}
        onChangeMode={(id) => {
          alert(id);
        }}
      >
      </Nav>
      <Article title="Welcome" body="Hello, WEB"></Article>
    </div>
  );
}

export default App;
