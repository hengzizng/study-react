import './App.css';
import { useState } from 'react'; // react에서 제공하는 useState라는 기본 훅

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
          // t.id 값은 숫자 형태였지만, 태그의 id 속성으로 넘기면 문자가 됨
          // -> a 태그의 id 속성에서 값을 가져와서 넘겨주기 때문에,
          //    그냥 event.target.id 로 넘기면 숫자가 아닌 문자가 넘어감
          props.onChangeMode(Number(event.target.id));
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
  // // useState('WELCOME') 은 배열을 return
  // // 그 배열의 0번 원소는 상태(state)의 값을 읽을 때 사용하는 데이터
  // // 1번 원소는 그 상태(state)의 값을 변경할 때 사용하는 함수
  // const _mode = useState('WELCOME');
  // const mode = _mode[0];
  // const setMode = _mode[1];
  // 아래 한 줄은 위의 세 줄과 동일
  const [mode, setMode] = useState('WELCOME');

  // 초깃값이 없는 state를 만듦
  const [id, setId] = useState(null);

  const topics = [
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'javascript is ...'}
  ]

  let content = null;
  if (mode === 'WELCOME') {
    content = <Article title="Welcome" body="Hello, WEB"></Article>;
  } else if (mode === 'READ') {
    // id(state, 현재 누른 것)와 같은 값을 찾음
    let title, body = null;
    for (let i = 0; i < topics.length; i++) {
      console.log(topics[i].id, id);
      // === 로 두 값을 비교할 때에는 데이터 타입도 고려해야 함
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>;
  }

  return (
    <div className="App">
      <Header
        title="WEB"
        onChangeMode={() => {
          // mode(state)의 값을 변경할 때는 setMode(state의 값을 set하는 함수)를 사용해야 함
          setMode('WELCOME');
        }}>
      </Header>
      <Nav
        topics={topics}
        onChangeMode={(_id) => {
          // mode(state)의 값을 변경할 때는 setMode(state의 값을 set하는 함수)를 사용해야 함
          setMode('READ');
          // 어떤 것을 눌렀는지 id(state)에 저장
          // 이 값은 Nav 컴포넌트의 onChangeMode 함수 인자를 통해 가져옴
          setId(_id);
        }}
      >
      </Nav>
      {content}
    </div>
  );
}

export default App;
