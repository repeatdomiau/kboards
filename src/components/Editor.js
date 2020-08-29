import React, { useState, useRef, useEffect } from 'react';
import Card from './Card';
import styled from 'styled-components';

const StyledEditor = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    background-color: #121212;
    border-right:1px dotted rgba(255,255,255,0.03);
    height:100vh;
`

const StyledH1 = styled.h1`
    font-family: 'Merriweather', serif;
    font-size:22px;
    font-weight:400;
    text-align:center;
    margin:20px 0px;
    color:#BB86FC;
`;

const Preview = styled.div`
    display: flex;
    justify-content: space-around;
`

const InnerEditor = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const StyledTextArea = styled.textarea`
    font-family: 'Merriweather', serif;
    width: 220px;
    margin-bottom: 10px;
    height: 150px;
    background-color: rgba(255,255,255,.2);
    border: none;
    color:rgba(255,255,255,.9);
    border-radius:0;
    outline:none;

    ::-webkit-scrollbar{
        width: 5px;
    }

    ::-webkit-scrollbar-track{
        -webkit-box-shadow: inset 0 0 1px rgba(0,0,0,0.3);
        border: 1px solid black;
        background: rgb(41,41,41);
    }

    ::-webkit-scrollbar-thumb{
        border: 1px solid black;
        background: rgb(111,111,111);
        -webkit-box-shadow: 0 1px 1px rgb(0,0,0);
    }
`

const StyledButton = styled.button`
    font-family: 'Merriweather', serif;
    background-color: rgba(255,255,255,.2);
    color:rgba(255,255,255,.9);
    border:none;
    width:226px;
    padding:5px;
    cursor:pointer;
`

function Editor({ addTodoCard }) {

    const [content, setContent] = useState("");

    const textArea = useRef(null);

    const changeContent = evt => setContent(evt.target.value);

    useEffect(() => textArea.current.focus());

    return (
        <StyledEditor>
            <div>
                <StyledH1>Nova Tarefa</StyledH1>
                <InnerEditor>
                    <StyledTextArea ref={textArea} value={content} onChange={changeContent}></StyledTextArea>
                    <StyledButton onClick={() => { addTodoCard(content); setContent(''); }}>Adicionar</StyledButton>
                </InnerEditor>
            </div>
            <div>
                <StyledH1>Preview</StyledH1>
                <Preview>
                    <Card>{content}</Card>
                </Preview>
            </div>
        </StyledEditor>
    );
}

export default Editor;