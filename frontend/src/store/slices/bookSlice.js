import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchBooks = createAsyncThunk('books/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/books');
    return data.data?.books || data.data || data.books || data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch books');
  }
});

export const addBook = createAsyncThunk('books/add', async (bookData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/books', bookData);
    return data.data || data.book || data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add book');
  }
});

const bookSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchBooks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addBook.fulfilled, (state, action) => {
        state.books.push(action.payload);
      });
  },
});

export default bookSlice.reducer;
