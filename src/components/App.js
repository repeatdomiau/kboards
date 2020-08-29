import React, { useState, useEffect } from 'react';
import Editor from './Editor';
import KanbanColumn from './KanbanColumn';
import { v4 as guid } from 'uuid';
import styled from 'styled-components';

const { todo = [], doing = [], done = [] } = JSON.parse(localStorage.getItem('kboards')) || {};

const StyledMain = styled.main`
        display: grid;
        grid-template-columns: 300px repeat(3, 1fr);
        grid-template-rows: 1fr;
        height: 100vh;
    `;

function App() {

    const [todoCards, setTodoCards] = useState(todo);
    const [doingCards, setDoingCards] = useState(doing);
    const [doneCards, setDoneCards] = useState(done);

    useEffect(() => {

        localStorage.setItem('kboards', JSON.stringify({ todo: todoCards, doing: doingCards, done: doneCards }));

    }, [todoCards, doingCards, doneCards]);

    const findList = index => index === 0 ? todoCards : index === 1 ? doingCards : index === 2 ? doneCards : null;
    const findSetter = index => index === 0 ? setTodoCards : index === 1 ? setDoingCards : index === 2 ? setDoneCards : null;

    const addTodoCard = content => setTodoCards([...todoCards, { id: guid(), content }]);

    const changeColumn = columnIndex => targetColumnIndex => cardId => () => {

        const list = findList(columnIndex);
        const listSet = findSetter(columnIndex);

        const target = findList(targetColumnIndex);
        const targetSet = findSetter(targetColumnIndex);

        if (list !== null) {
            const card = list.find(c => c.id === cardId);
            if (card) {
                listSet(list.filter(c => c.id !== cardId));
                targetSet([...target, card]);
            }
        }
    }

    const changeContent = columnIndex => cardId => content => () => {

        console.log(columnIndex, cardId, content);

        const list = findList(columnIndex);
        const listSet = findSetter(columnIndex);

        if (list !== null) {
            const cardIndex = list.findIndex(c => c.id === cardId);
            if (cardIndex > -1) {
                const newList = list.reduce((res, item, index) => [...res, index === cardIndex ? { ...item, content: content } : item], []);
                listSet(newList);
            }
        }
    }

    const removeCard = columnIndex => cardId => () => {

        const list = findList(columnIndex);
        const listSet = findSetter(columnIndex);

        if (list !== null) {
            const card = list.find(c => c.id === cardId);
            if (card) {
                listSet(list.filter(c => c.id !== cardId));
            }
        }

    }

    const kanbanColumnsList = ["To Do", "Doing", "Done"];

    return (
        <StyledMain>
            <Editor addTodoCard={addTodoCard}></Editor>
            {kanbanColumnsList.map((column, index, arr) =>
                <KanbanColumn
                    key={index}
                    title={column}
                    columnIndex={index}
                    lastColumn={arr.length - 1}
                    cards={findList(index)}
                    removeCard={removeCard(index)}
                    changeColumn={changeColumn(index)}
                    changeContent={changeContent(index)} />
            )}
        </StyledMain>
    );

}

export default App;