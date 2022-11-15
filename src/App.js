import './App.css';
import { useState } from 'react'; // react에서 제공하는 useState라는 기본 훅

function Header(props) {
  return (
    <header>
      <h1>
        <a
          href="/ff"
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

function Create(props) {
  return (
    <article>
      <h2>Create</h2>
      <form onSubmit={event => {
        // form 태그의 onSubmit : submit 버튼을 클릭했을 때 form 태그에서 발생하는 이벤트
        // form 태그는 submit을 했을 때 reload 되기 때문에 막아줌
        event.preventDefault();
        // 여기서 event.target : form 태그 (event를 발생시킨 태그)
        // event.target.title : form 태그 안의 name이 title인 태그
        const title = event.target.title.value;
        const body = event.target.body.value;
        // 상위 컴포넌트(App)의 onCreate 함수를 실행시킴
        props.onCreate(title, body);
      }}>
        <p><input type="text" name="title" placeholder="title" /></p>
        <p><textarea name="body" placeholder="body"></textarea></p>
        <p><input type="submit" value="Create" /></p>
      </form>
    </article>
  );
}

function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);

  return (
    <article>
      <h2>Update</h2>
      <form onSubmit={event => {
        // form 태그의 onSubmit : submit 버튼을 클릭했을 때 form 태그에서 발생하는 이벤트
        // form 태그는 submit을 했을 때 reload 되기 때문에 막아줌
        event.preventDefault();
        // 여기서 event.target : form 태그 (event를 발생시킨 태그)
        // event.target.title : form 태그 안의 name이 title인 태그
        const title = event.target.title.value;
        const body = event.target.body.value;
        // 상위 컴포넌트(App)의 onUpdate 함수를 실행시킴
        props.onUpdate(title, body);
      }}>
        <p>
          <input
            type="text"
            name="title"
            placeholder="title"
            value={title}
            onChange={event => {
              setTitle(event.target.value);
            }}
          />
        </p>
        <p>
          <textarea
            name="body"
            placeholder="body"
            value={body}
            onChange={event => {
              setBody(event.target.value);
            }}
          >
          </textarea>
        </p>
        <p>
          <input type="submit" value="Update" />
        </p>
      </form>
    </article>
  );
}

function App() {
  // state의 값이 하나라도 바뀌면 App 컴포넌트가 다시 실행됨
  // useState('WELCOME') 은 배열을 return
  // 그 배열의 0번 원소는 상태(state)의 값을 읽을 때 사용하는 데이터
  // 1번 원소는 그 상태(state)의 값을 변경할 때 사용하는 함수
  // -> react는 이 함수를 호출했을 때, original data와 new data가 같은지 확인하고, 같다면 컴포넌트를 다시 렌더링하지 않음

  // const _mode = useState('WELCOME');
  // const mode = _mode[0];
  // const setMode = _mode[1];
  // 아래 한 줄은 위의 세 줄과 동일
  const [mode, setMode] = useState('WELCOME');

  // 초깃값이 없는 state를 만듦
  const [id, setId] = useState(null);

  // id 값을 별도로 관리하기 위해 만듦
  // (topics 배열 내에 다음에 생성되어야 할 id값을 가리킴)
  const [nextId, setNextId] = useState(4);

  // topics 가 그냥 배열이면 내용이 업데이트되어도 화면이 바뀌지 않기 때문에
  // (App 컴포넌트가 다시 실행되니 않음)
  // state로 만들어줌 => setTopics 도 같이 만들어주기
  const [topics, setTopics] = useState([
    { id: 1, title: 'html', body: 'html is ...' },
    { id: 2, title: 'css', body: 'css is ...' },
    { id: 3, title: 'javascript', body: 'javascript is ...' }
  ]);

  let content = null;
  // 맥락적으로 노출되는 UI (상세 항목을 눌렀을 때만 Update 노출)
  let contextControl = null;

  if (mode === 'WELCOME') {
    content = <Article title="Welcome" body="Hello, WEB"></Article>;
  } else if (mode === 'READ') {
    // id(state, 현재 누른 것)와 같은 값을 찾음
    let title, body = null;
    for (let i = 0; i < topics.length; i++) {
      // === 로 두 값을 비교할 때에는 데이터 타입도 고려해야 함
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>;
    contextControl = <li>
      <a
        href={"/update/" + id}
        onClick={event => {
          event.preventDefault();
          setMode('UPDATE');
        }}>
        Update
      </a>
    </li>;
  } else if (mode === 'CREATE') {
    content = <Create
      // 사용자가 create 버튼을 눌렀을 때 실행되는 함수를 Create 컴포넌트에 props로 전달
      onCreate={(_title, _body) => {
        // {title : title} 에서 왼쪽 title은 객체의 property
        // 오른쪽 title은 파라미터로부터 온 title
        const newTopic = { id: nextId, title: _title, body: _body }

        // topics가 Primitive 타입이 아닌 Object 이기 때문에
        // topics 자체 내의 값을 update해주는 것이 아닌
        // topics의 값들을 복사해서 새로운 Object를 만든 뒤,
        //  -> newValue = {...value} / [...value] 후에 setValue(newValue)
        // setTopics를 사용해서 topics에 대입하는 방식으로 사용해야 함
        const newTopics = [...topics]
        newTopics.push(newTopic)
        setTopics(newTopics);

        // 입력이 완료되면 상세 페이지로 이동
        setMode('READ');
        setId(nextId)

        // 다음 글의 id값 1 늘려줌
        setNextId(nextId + 1);
      }}
    ></Create>
  } else if (mode === 'UPDATE') {
    let title, body = null;
    for (let i = 0; i < topics.length; i++) {
      // === 로 두 값을 비교할 때에는 데이터 타입도 고려해야 함
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update
      title={title}
      body={body}
      onUpdate={(title, body) => {
        const newTopics = [...topics];
        const updatedTopic = { id : id, title : title, body : body };
        for (let i = 0; i < newTopics.length; i++) {
          if (newTopics[i].id === id) {
            newTopics[i] = updatedTopic;
            break;
          }
        }
        setTopics(newTopics);
        setMode('READ');
      }}>
    </Update>
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
      <ul>
        <li>
          <a href="/create" onClick={event => {
            // a 태그의 기본 동작(reload)을 막음 -> url이 바뀌지 않음
            event.preventDefault();
            setMode('CREATE');
          }}>Create</a>
        </li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
