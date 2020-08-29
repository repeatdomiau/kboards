import React from 'react';
import styled from 'styled-components';
import Card from './Card';


const StyledKanbanColumn = styled.div`
    background-color:#121212;
    border-right:1px dotted rgba(255,255,255,0.03);
`;

const StyledH1 = styled.h1`
    font-family: 'Merriweather', serif;
    font-size:22px;
    font-weight:400;
    text-align:center;
    //color:white;
    color:#BB86FC;
`;

const StyledCards = styled.div`
    display:flex;
    justify-content:flex-start;
    align-items: flex-start;
    flex-wrap:wrap;
    padding:10px;
    overflow-y: auto;
    margin:10px;
    max-height:90vh;

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
`;

function KanbanColumn({ removeCard, changeContent, changeColumn, columnIndex, lastColumn, title, cards = [] }) {

    return (
        <StyledKanbanColumn>
            <StyledH1>{title}</StyledH1>
            <StyledCards className="cards">
                {
                    cards.map(card =>
                        <Card
                            key={card.id}
                            id={card.id}
                            columnIndex={columnIndex}
                            lastColumn={lastColumn}
                            removeCard={removeCard(card.id)}
                            changeContent={changeContent(card.id)}
                            changeColumn={changeColumn}>
                            {card.content}
                        </Card>)
                }
            </StyledCards>
        </StyledKanbanColumn>
    );

}

export default KanbanColumn;