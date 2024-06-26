import React, { useCallback, useMemo, useState } from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Helmet } from 'react-helmet'
import { FingoHomeLayout } from 'src/components/layouts'
import styled from 'styled-components'
import { FingoButton, FingoInput } from 'src/components/core'
import { ReactComponent as AddSvg } from 'src/assets/svg/add.svg'
import DraggableItem from 'src/components/admin/test-dnd/DraggableItem'
import toast from 'react-hot-toast'
import { useApp } from 'src/hooks'
import { v4 as uuidv4 } from 'uuid'
import { Col, Row } from 'react-bootstrap'
import { ReactComponent as CloseIcon } from 'src/assets/svg/close.svg'

const FOOTER_HEIGHT = 70
const TITLE = 'Label The Candlestick'
const INITIAL_PLACE_KEY = 'INITIAL_PLACE'

const TestDNDPage2 = () => {
    const { app_isDarkTheme } = useApp()
    const INITIAL_TARGET_PLACES = {
        [INITIAL_PLACE_KEY]: {
            id: INITIAL_PLACE_KEY,
            list: [
                {
                    id: 'b8535264-ab2b-4a3e-96b3-30c0dbb95e39',
                    label: 'Hight',
                },
                {
                    id: 'aa0a3233-d95e-411a-a4d5-410331dc5670',
                    label: 'Close',
                },
                {
                    id: '26be1540-967e-4490-a8c8-cffab40d365f',
                    label: 'Open',
                },
                {
                    id: '56721605-682b-4b4e-94fa-5b22228109eb',
                    label: 'Low',
                },
            ],
        },
        place1: {
            id: 'place1',
            list: [],
        },
        place2: {
            id: 'place2',
            list: [],
        },
        place3: {
            id: 'place3',
            list: [],
        },
        place4: {
            id: 'place4',
            list: [],
        },
    }
    const [inputValue, setInputValue] = useState('')
    const [values, setValues] = useState([])

    const onChange = e => {
        setInputValue(e.target.value)
    }

    const handleKeyDown = e => {
        if (e.key === 'Enter' && inputValue) {
            const newValue = {
                id: uuidv4(),
                label: inputValue,
            }

            // prettier-ignore
            const newInitialPlaceList = listDroppable[INITIAL_PLACE_KEY].list = [...listDroppable[INITIAL_PLACE_KEY].list, newValue]
            setInputValue('')
        }
    }

    const onClickReset = () => {
        // setAvailableValues(INITIAL_AVAILABLE_VALUES)
        setListDroppable(INITIAL_TARGET_PLACES)
    }

    const onClickAddDroppable = () => {
        const id = uuidv4()
        setListDroppable({
            ...listDroppable,
            [id]: {
                id: id,
                list: [],
            },
        })
    }

    const [listDroppable, setListDroppable] = useState(INITIAL_TARGET_PLACES)

    const onClickDeleteDroppable = droppableId => {
        const currentListDroppable = Object.values(listDroppable)
        const filteredListDroppable = currentListDroppable.filter(
            x => x.id !== droppableId
        )
        const result = filteredListDroppable.reduce(function (acc, cur, i) {
            acc[cur.id] = cur
            return acc
        }, {})

        setListDroppable(result)
    }

    const onClickAdd = useCallback(() => {
        if (inputValue) {
            const newValue = {
                id: uuidv4(),
                label: inputValue,
            }
            // prettier-ignore
            listDroppable[INITIAL_PLACE_KEY].list = [...listDroppable[INITIAL_PLACE_KEY].list, newValue]

            setInputValue('')
        }
    }, [inputValue, listDroppable])

    const onDragEnd = ({ source, destination }) => {
        // Make sure we have a valid destination
        if (destination === undefined || destination === null) return null

        // Make sure we're actually moving the item
        // prettier-ignore
        if (source.droppableId === destination.droppableId && destination.index === source.index) {
            return null
        }

        console.log('source.droppableId', source.droppableId)
        console.log('destination.droppableId', destination.droppableId)

        // Set start and end variables
        const start = listDroppable[source.droppableId]
        const end = listDroppable[destination.droppableId]

        // If start is the same as end, we're in the same column
        if (start === end) {
            // Move the item within the list
            // Start by making a new list without the dragged item
            const newList = start.list.filter((_, idx) => idx !== source.index)

            // Then insert the item at the right location
            newList.splice(destination.index, 0, start.list[source.index])

            // Then create a new copy of the column object
            const newCol = {
                id: start.id,
                list: newList,
            }

            // Update the state
            setListDroppable(state => ({ ...state, [newCol.id]: newCol }))
            return null
        } else {
            // If start is different from end, we need to update multiple listDroppable
            // Filter the start list like before
            const newStartList = start.list.filter(
                (_, idx) => idx !== source.index
            )

            // Create a new start column
            const newStartCol = {
                id: start.id,
                list: newStartList,
            }

            // Make a new end list array
            const newEndList = end.list

            // Insert the item into the end list
            newEndList.splice(destination.index, 0, start.list[source.index])

            // Create a new end column
            const newEndCol = {
                id: end.id,
                list: newEndList,
            }

            console.log('newStartCol,', newStartCol)
            console.log('newEndCol,', newEndCol)

            // Update the state
            setListDroppable(state => ({
                ...state,
                [newStartCol.id]: newStartCol,
                [newEndCol.id]: newEndCol,
            }))
            return null
        }
    }

    const onClickDelete = (source, paramIndex) => {
        // prettier-ignore
        const updatedValue = listDroppable[source].list.filter((_, index) => index !== paramIndex)
        // prettier-ignore
        listDroppable[source].list = updatedValue

        setListDroppable({
            ...listDroppable,
        })
    }

    const disabeldSaveButton = useMemo(() => {
        return listDroppable[INITIAL_PLACE_KEY].list.length > 0
    }, [listDroppable])

    const onClickSave = () => {
        toast.error('Still development to save to db')
    }

    return (
        <FingoHomeLayout>
            <Helmet>
                <title>Experiment Quiz DND</title>
            </Helmet>
            <DragDropContext onDragEnd={onDragEnd}>
                <Container>
                    <FormWrapper>
                        <InputGroup>
                            <FingoInput
                                size='lg'
                                name='value'
                                value={inputValue}
                                onChange={onChange}
                                onKeyDown={handleKeyDown}
                                placeholder='Input value...'
                            />
                            <Button onClick={onClickAdd} type='button'>
                                <AddSvg />
                                {/* <span>Add</span> */}
                            </Button>
                        </InputGroup>

                        <Droppable droppableId={INITIAL_PLACE_KEY}>
                            {(provided, snapshot) => {
                                console.log('snapshot', snapshot)
                                return (
                                    <InitialPlaceBox
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`${
                                            app_isDarkTheme ? 'dark' : ''
                                        }`}
                                    >
                                        <ItemContainer>
                                            {Object.values(listDroppable)
                                                .find(
                                                    x =>
                                                        x.id ===
                                                        INITIAL_PLACE_KEY
                                                )
                                                .list.map((x, itemIndex) => (
                                                    <DraggableItem
                                                        key={x.id}
                                                        id={x.id}
                                                        text={x.label}
                                                        index={itemIndex}
                                                        onDelete={() =>
                                                            onClickDelete(
                                                                INITIAL_PLACE_KEY,
                                                                itemIndex
                                                            )
                                                        }
                                                    />
                                                ))}
                                            {provided.placeholder}
                                        </ItemContainer>
                                    </InitialPlaceBox>
                                )
                            }}
                        </Droppable>

                        {/* <FingoButton
                            style={{ minWidth: 170 }}
                            // disabled={availableValues.length > 0}
                            enableHoverEffect={false}
                        >
                            Add More
                        </FingoButton> */}
                    </FormWrapper>

                    <DraggableWrapper>
                        <DraggableHeader>
                            <h2 className='text-center mb-2'>{TITLE}</h2>
                            <h4 className='text-center mb-0'>Drag and Drop</h4>
                        </DraggableHeader>

                        <DroppablePlaceContainer>
                            {Object.values(listDroppable)
                                .filter(x => x.id !== INITIAL_PLACE_KEY)
                                .map((droppable, index) => (
                                    <Droppable
                                        key={droppable.id + index}
                                        droppableId={droppable.id}
                                    >
                                        {(provided, snapshot) => {
                                            // console.log('provided', provided)
                                            // console.log('snapshot', snapshot)
                                            return (
                                                <StyledDroppablePlaceItemContainer>
                                                    <StyledDroppablePlaceItem
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        className={`DroppablePlaceItem-${index} ${
                                                            app_isDarkTheme
                                                                ? 'dark'
                                                                : ''
                                                        } ${
                                                            snapshot.isDraggingOver
                                                                ? 'isDraggingOver'
                                                                : ''
                                                        }`}
                                                    >
                                                        <DeleteDroppableBtn
                                                            className='DeleteDroppableBtn'
                                                            onClick={() =>
                                                                onClickDeleteDroppable(
                                                                    droppable.id
                                                                )
                                                            }
                                                        >
                                                            <CloseIcon />
                                                        </DeleteDroppableBtn>
                                                        {droppable.list.length >
                                                            0 &&
                                                            droppable.list.map(
                                                                (
                                                                    x,
                                                                    itemIndex
                                                                ) => (
                                                                    <DraggableItem
                                                                        key={
                                                                            x.id
                                                                        }
                                                                        id={
                                                                            x.id
                                                                        }
                                                                        text={
                                                                            x.label
                                                                        }
                                                                        index={
                                                                            itemIndex
                                                                        }
                                                                        onDelete={() =>
                                                                            onClickDelete(
                                                                                droppable.id,
                                                                                itemIndex
                                                                            )
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                        {provided.placeholder}
                                                    </StyledDroppablePlaceItem>
                                                </StyledDroppablePlaceItemContainer>
                                            )
                                        }}
                                    </Droppable>
                                ))}
                        </DroppablePlaceContainer>

                        <div className='w-100 text-center'>
                            <FingoButton
                                className='text-center'
                                style={{ minWidth: 200 }}
                                onClick={onClickAddDroppable}
                            >
                                + Add Droppable
                            </FingoButton>
                        </div>
                    </DraggableWrapper>
                </Container>
            </DragDropContext>
            <FormFooter>
                <Row>
                    <Col xs={12} md={6}>
                        <FingoButton
                            className='text-center'
                            style={{ minWidth: 200 }}
                            onClick={onClickSave}
                            disabled={disabeldSaveButton}
                        >
                            Save
                        </FingoButton>
                    </Col>
                    <Col xs={12} md={6}>
                        <FingoButton
                            className='text-center'
                            style={{ minWidth: 160 }}
                            color='danger'
                            onClick={onClickReset}
                        >
                            Reset
                        </FingoButton>
                    </Col>
                </Row>

                {/* {availableValues.length === 0 && (
                    <FingoButton
                        color='success'
                        style={{ minWidth: 240 }}
                        enableHoverEffect={false}
                    >
                        Save
                    </FingoButton>
                )} */}
            </FormFooter>
        </FingoHomeLayout>
    )
}

const Container = styled.div`
    width: 100%;
    padding: 0 20px;
    display: flex;
    flex-wrap: nowrap;
    padding-bottom: ${FOOTER_HEIGHT}px;
`

const DraggableWrapper = styled.div`
    width: 500px;
    padding: 10px;
`

const DraggableHeader = styled.div`
    margin-bottom: 1rem;
    h2 {
        font-size: 1.6rem;
        font-weight: 700;
    }
    h4 {
        font-size: 1.2rem;
        font-weight: 700;
    }
`

const DroppablePlaceContainer = styled.div`
    display: block;
    position: relative;
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    width: 480px;

    .DroppablePlaceItem-1 {
        /* transform: translate(220px, -200px); */
    }

    .DroppablePlaceItem-2 {
        /* transform: translate(0px, -180px); */
    }

    .DroppablePlaceItem-3 {
        /* transform: translate(220px, -380px); */
    }
`

const StyledDroppablePlaceItemContainer = styled.div`
    padding: 10px;
    width: 240px;
    position: relative;
`

const StyledDroppablePlaceItem = styled.div`
    padding: 1rem;
    width: 100%;
    min-height: 240px;
    border-radius: 0.3rem;
    background-color: #f9fffa;
    border: 2px dashed #9ecfab;
    &.dark {
        background-color: #1b2926;
        border: 2px dashed #1b2b25;
    }
    &:hover {
        .DeleteDroppableBtn {
            transform: scale(1);
        }
    }

    &.isDraggingOver {
        background-color: #fbf7e9;
        border: 2px dashed #e37b20;
    }
`

const DeleteDroppableBtn = styled.div`
    border: none;
    outline: none;
    padding: 0;
    height: 28px;
    width: 28px;
    border-radius: 28px;
    background-color: red;
    color: white;
    position: absolute;
    top: 0px;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default !important;
    transform: scale(0);
    transition: all 0.2s;
    svg {
        width: 16px;
        height: auto;
    }
`

const FormWrapper = styled.div`
    width: 320px;
    padding: 1.2rem;
`

const InitialPlaceBox = styled.div`
    min-height: 200px;
    border-radius: 0.3rem;
    background-color: #fafcff;
    border: 2px dashed #a3d1eb;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 1rem;
    margin-bottom: 0.8rem;

    &.dark {
        background-color: #1a1f21;
        border: 2px dashed #1a1e21;
    }
`

const InputGroup = styled.div`
    width: 100%;
    display: flex;
    position: relative;
    margin-bottom: 1.2rem;
`

const ItemContainer = styled.div`
    width: 170px;
`

const FormFooter = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    height: ${FOOTER_HEIGHT}px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`

const Button = styled.button`
    position: absolute;
    top: 3px;
    right: 3px;
    border: none;
    outline: 0;
    padding: 0;
    width: 50px;
    height: 37px;
    background-color: #007bff;
    color: #fff;
    border-radius: 8px;
    svg {
        width: 22px;
        height: auto;
    }
`

export default TestDNDPage2
