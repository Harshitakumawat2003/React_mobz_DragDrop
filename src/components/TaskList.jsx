import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../styles/TaskList.css"; // For custom styling

const initialTasks = Array.from({ length: 10 }, (_, index) => ({
  id: `task-${index + 1}`,
  content: `Test Task ${index + 1}`
}));

const initialColumns = {
  unplanned: {
    name: "UNPLANNED",
    tasks: initialTasks
  },
  today: {
    name: "TODAY",
    tasks: []
  },
  tomorrow: {
    name: "TOMORROW",
    tasks: []
  },
  thisWeek: {
    name: "THIS WEEK",
    tasks: []
  },
  nextWeek: {
    name: "NEXT WEEK",
    tasks: []
  }
};

const TaskList = () => {
  const [columns, setColumns] = useState(initialColumns);

  // Handle the drag-and-drop logic
  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      // Reorder tasks within the same column
      const column = columns[source.droppableId];
      const copiedTasks = [...column.tasks];
      const [removed] = copiedTasks.splice(source.index, 1);
      copiedTasks.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          tasks: copiedTasks
        }
      });
    } else {
      // Move tasks between different columns
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceTasks = [...sourceColumn.tasks];
      const destTasks = [...destColumn.tasks];
      const [removed] = sourceTasks.splice(source.index, 1);

      destTasks.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceTasks
        },
        [destination.droppableId]: {
          ...destColumn,
          tasks: destTasks
        }
      });
    }
  };

  return (
    <div>
      <h3>Create a Drag & Drop Task List</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns-container">
          {Object.entries(columns).map(([columnId, column], index) => (
            <div key={columnId} className="column">
              <h4>{column.name}</h4>
              <Droppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`task-list ${
                      snapshot.isDraggingOver ? "dragging-over" : ""
                    }`}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`task-item ${
                              snapshot.isDragging ? "dragging" : ""
                            }`}
                          >
                            {task.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskList;
