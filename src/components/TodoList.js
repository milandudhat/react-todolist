import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Textarea from '@mui/joy/Textarea';
import { useFormik } from 'formik';
import {
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';


export default function TodoList() {
  const [todoList, setTodoList] = React.useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");


  // stop the page from refreshing and losing the data
  React.useEffect(() => {
    window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault();
      return (ev.returnValue = "Are you sure you want to close?");
    });
  }, []);
  

  // Store the todoList in localStorage
  React.useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }, [todoList]);

  React.useEffect(() => {
    const data = JSON.parse(localStorage.getItem('todoList'))
    if (data) {
      setTodoList(data)
    }
  })

  const formik = useFormik({
    initialValues: {
      todo: "",
    },
    validate: values => {
      const errors = {};
      if (!values.todo) {
        errors.todo = "Please enter valid value";
      }
      return errors;
    },
    onSubmit: (values, { resetForm }) => {
      setTodoList([...todoList, values.todo]);
      resetForm()
    }
  });

  const deleteTodo = (index) => {
    const newTodoList = [...todoList];
    newTodoList.splice(index, 1);
    setTodoList(newTodoList);
  }

  const updateTodo = (index, value) => {
    setEditIndex(index);
    setEditValue(value);
  };

  const handleSaveTodo = (value) => {
    const newTodos = [...todoList];
    newTodos[editIndex] = value;
    const temp = newTodos[editIndex];
    // check if the value is empty
    if (temp === "") {
      // if the value is empty, THEN show the alert
      alert("Please enter valid value");
      return;
    }
    setTodoList(newTodos);
    setEditIndex(null);
    setEditValue("");
  };





  return (
    <>
      <Card variant="outlined" sx={{ width: 500 }}>
        <Box>
          <div>
            <h1 sx={{align:'center'}}> TodoList</h1>
            <form onSubmit={formik.handleSubmit}>
              <Textarea
                placeholder="Add Todo"
                name="todo"
                onChange={formik.handleChange}
                value={formik.values.todo}
                sx={{ width: 500 }}
              />
              {formik.errors.todo && formik.touched.todo && (
                <div className='alert-for-required'>
                  {formik.errors.todo}
                </div>
              )}
              <Button sx={
                { width: 500, marginTop: 2 }
              } type="submit">Add</Button>
            </form>
            <Grid item lg={8}>
              {
                todoList.map((todo, index) => (
                  <>
                    <Box sx={{ display: 'flex', gap: '1rem', marginTop: 2 }}>
                      <Textarea disabled sx={{ width: 500, }}
                        value={todo}
                      />
                      <Tooltip arrow placement="left" title="Edit">
                        <IconButton onClick={() => updateTodo(index , todo)} >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip arrow placement="right" title="Delete">
                        <IconButton onClick={() => deleteTodo(index)} color="error">
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </>
                ))
              }
            </Grid>
            <div>
              <p>Total: {todoList.length}</p>
              <Button sx={{ width: 500 }} onClick={() => setTodoList([])}>Clear all TodoList</Button>
            </div>
          </div>
        </Box>
      </Card>

      <Dialog open={editIndex !== null} onClose={() => setEditIndex(null)}>
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="Edit Todo"
              name="editTodo"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditIndex(null)} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => handleSaveTodo(editValue)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>



    </>

  );
}