import React, { useState, useRef, useEffect } from 'react';
import MarkDownParser from './MarkdownParser'
import { ensureArray } from '../libs/functional';
import styled from 'styled-components';
import { MdNavigateNext, MdNavigateBefore, MdDelete, MdSave, MdUndo, MdEdit } from 'react-icons/md';
import { GoMarkdown } from 'react-icons/go';

const StyledCard = styled.div`
    background-color:rgba(255,255,255,.2);
    color:white;
    font-family: 'Merriweather', serif;    
    width: 200px;
    padding: 5px 0;
    margin: 20px;
    margin-bottom: 10px;
    min-height: 150px;
    max-height: 300px;
    border-radius:3px;

    display:flex;
    flex-direction:column;
    justify-content:space-between;

    .card *{
        padding-left:10px;
    }

    .generated-from-MD{
        overflow-y: auto;
    }

    .generated-from-MD::-webkit-scrollbar{
        width: 5px;
    }

    .generated-from-MD::-webkit-scrollbar-track{
        -webkit-box-shadow: inset 0 0 1px rgba(0,0,0,0.3);
        border: 1px solid black;
        background: rgb(41,41,41);
    }

    .generated-from-MD::-webkit-scrollbar-thumb{
        border: 1px solid black;
        background: rgb(111,111,111);
        -webkit-box-shadow: 0 1px 1px rgb(0,0,0);
    }

    .generated-from-MD{
        margin:0;
        padding:0;
    }

    .generated-from-MD h1, 
    .generated-from-MD h2, 
    .generated-from-MD h3, 
    .generated-from-MD h4, 
    .generated-from-MD h5, 
    .generated-from-MD h6, 
    .generated-from-MD h7 {
        margin:5px 0;
        font-size:12px;
        font-weight:400;
        padding:0 10px;
    }

    .generated-from-MD h1{
        border-bottom:1px solid silver;
        font-size:18px;
        font-spacing:0px;
    }

    .generated-from-MD h2{
        margin:0;
        font-size:16px;
    }

    .generated-from-MD p{
        font-size:12px;
        font-weight:300;
        padding:0 10px;
    }

    .generated-from-MD table {
        width:100%;
        border-collapse: collapse;
        margin: 5px 0;
    }
      
    .generated-from-MD table th {
        font-weight: 600;
    }
    
    .generated-from-MD table td,
    .generated-from-MD table th {
        padding: 5px 0px;
        border-bottom: 1px solid #dfe2e5;
    }
    
    .generated-from-MD table tr {
        background-color: transparent;
        border-top: 1px solid #c6cbd1;
    }
    
    .generated-from-MD table tr:nth-child(2n) {
        background-color: rgba(255,255,255,.05);
    }

    :hover .styled-actions{
        opacity:1;
    }
`;

const StyledActions = styled.div`
    display:flex;
    justify-content: space-between;
    opacity:0;
    transition: opacity .5s;
`;

const StyledButton = styled.button`
    background-color: #BB86FC;
    color:black;
    border:none;
    opacity:.9;
    border-radius:50%;
    padding:5px;
    margin:0px 10px;
    cursor:pointer;
    outline:none;
    :hover{
        opacity: 1;
    }
`;

const InnerEditor = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const StyledTextArea = styled.textarea`
    font-family: 'Merriweather', serif;
    width: 190px;
    margin-bottom: 10px;
    padding:5px;
    height: 150px;
    border: none;
    background-color:transparent;
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

const StyledEditorButton = styled.button`
    background-color: #BB86FC;
    color:black;
    opacity:.9;
    border:none;
    border-radius:50%;
    padding:5px;
    cursor:pointer;
    margin:10px 20px;
    outline:none;
    :hover{
        opacity: 1;
    }
`

const StyledEditorControls = styled.div`
    display: flex;
    justify-content:space-around;
    width:100%;
    padding:0px;
`;

const MarkdownCapable = styled.div`
    margin: 0;
    padding: 0 10px 0 0;
    text-align: right;
    width: 190px;
`;

function Card(props) {

    const { columnIndex, lastColumn, id, changeColumn, changeContent, removeCard, children, content } = props;

    const cardContent = ensureArray(children || content);

    const [editMode, setEditMode] = useState(false);
    const [editorContent, setEditorContent] = useState(cardContent);
    const textArea = useRef(null);

    const renderButtons = (columnIndex, lastColumn, cardId, changeColumn, changeContent) => {

        if (changeColumn) {

            const hiddenButton = <StyledButton style={{ visibility: 'hidden' }} key="btn4">X</StyledButton>
            const editButton = changeContent ? <StyledButton title="Editar" key="btn3"><MdEdit size={14} onClick={changeToEditorMode} /></StyledButton> : hiddenButton;

            const buttons = [
                <StyledButton key="btn1"><MdNavigateBefore title="Voltar Coluna" size={14} onClick={changeColumn(columnIndex - 1)(cardId)} /></StyledButton>,
                <StyledButton key="btn2"><MdNavigateNext title="Avançar Coluna" size={14} onClick={changeColumn(columnIndex + 1)(cardId)} /></StyledButton>
            ];

            return (
                <StyledActions columnIndex={columnIndex} lastColumn={lastColumn} className="styled-actions">
                    {
                        columnIndex === 0 ?
                            [hiddenButton, editButton, buttons[1]] :
                            columnIndex === lastColumn ?
                                [buttons[0], editButton, hiddenButton] :
                                [buttons[0], editButton, buttons[1]]
                    }
                </StyledActions>
            );
        }
    }

    useEffect(() => {
        if (editMode) {
            textArea.current.focus();
            textArea.current.setSelectionRange(textArea.current.value.length, textArea.current.value.length);
        }
    }, [editMode]);

    const changeToEditorMode = (evt) => {
        if (changeContent) setEditMode(true);
    }

    const persistEdition = () => {
        const content = editorContent instanceof Array ? editorContent[0] : editorContent;
        changeContent(content)();
        setEditMode(false);
    }

    const renderDisplayCard = () => (
        <StyledCard className="card">
            <MarkDownParser>{cardContent}</MarkDownParser>
            {renderButtons(columnIndex, lastColumn, id, changeColumn, changeContent)}
        </StyledCard>
    );

    const renderEditModeCard = () => (
        <StyledCard className="card">
            <InnerEditor>
                <MarkdownCapable title="Markdown Capable">
                    <GoMarkdown></GoMarkdown>
                </MarkdownCapable>
                <StyledTextArea ref={textArea} value={editorContent} onChange={evt => setEditorContent([evt.target.value])}></StyledTextArea>
                <StyledEditorControls>
                    <StyledEditorButton onClick={persistEdition} title="Salvar"><MdSave size={14} /></StyledEditorButton>
                    <StyledEditorButton onClick={() => setEditMode(false)} title="Cancelar"><MdUndo size={14} /></StyledEditorButton>
                    <StyledEditorButton onClick={removeCard} title="Remover"><MdDelete size={14} /></StyledEditorButton>
                </StyledEditorControls>
            </InnerEditor>
        </StyledCard>
    )

    return !editMode ? renderDisplayCard() : renderEditModeCard();
}

export default Card;