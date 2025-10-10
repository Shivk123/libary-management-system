import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { User, Book, Group, Borrowing } from '@/lib/schemas';
import { userService } from '@/services/userService';
import { booksService } from '@/services/booksService';
import { groupsService } from '@/services/groupsService';
import { borrowingService } from '@/services/borrowingService';

interface LibraryState {
  user: User | null;
  books: Book[];
  groups: Group[];
  borrowings: Borrowing[];
  loading: {
    user: boolean;
    books: boolean;
    groups: boolean;
    borrowings: boolean;
  };
  error: string | null;
}

type LibraryAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_BOOKS'; payload: Book[] }
  | { type: 'SET_GROUPS'; payload: Group[] }
  | { type: 'SET_BORROWINGS'; payload: Borrowing[] }
  | { type: 'SET_LOADING'; payload: { key: keyof LibraryState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_BORROWING'; payload: Borrowing };

const initialState: LibraryState = {
  user: null,
  books: [],
  groups: [],
  borrowings: [],
  loading: {
    user: true,
    books: true,
    groups: true,
    borrowings: true,
  },
  error: null,
};

function libraryReducer(state: LibraryState, action: LibraryAction): LibraryState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_BOOKS':
      return { ...state, books: action.payload };
    case 'SET_GROUPS':
      return { ...state, groups: action.payload };
    case 'SET_BORROWINGS':
      return { ...state, borrowings: action.payload };
    case 'SET_LOADING':
      return { 
        ...state, 
        loading: { ...state.loading, [action.payload.key]: action.payload.value } 
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_BORROWING':
      return { ...state, borrowings: [...state.borrowings, action.payload] };
    default:
      return state;
  }
}

interface LibraryContextType extends LibraryState {
  borrowBook: (bookId: string, type: 'individual' | 'group', groupId?: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(libraryReducer, initialState);

  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'user', value: true } });
      const user = await userService.getCurrentUser();
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_LOADING', payload: { key: 'user', value: false } });

      dispatch({ type: 'SET_LOADING', payload: { key: 'books', value: true } });
      const books = await booksService.getBooks();
      dispatch({ type: 'SET_BOOKS', payload: books });
      dispatch({ type: 'SET_LOADING', payload: { key: 'books', value: false } });

      dispatch({ type: 'SET_LOADING', payload: { key: 'groups', value: true } });
      const groups = await groupsService.getUserGroups(user.id);
      dispatch({ type: 'SET_GROUPS', payload: groups });
      dispatch({ type: 'SET_LOADING', payload: { key: 'groups', value: false } });

      dispatch({ type: 'SET_LOADING', payload: { key: 'borrowings', value: true } });
      const borrowings = await borrowingService.getUserBorrowings(user.id);
      dispatch({ type: 'SET_BORROWINGS', payload: borrowings });
      dispatch({ type: 'SET_LOADING', payload: { key: 'borrowings', value: false } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
    }
  };

  const borrowBook = async (bookId: string, type: 'individual' | 'group', groupId?: string) => {
    if (!state.user) throw new Error('User not found');
    
    const borrowing = await borrowingService.borrowBook({
      bookId,
      borrowerId: state.user.id,
      type,
      groupId,
    });
    
    dispatch({ type: 'ADD_BORROWING', payload: borrowing });
  };

  const refreshData = async () => {
    await loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  const contextValue: LibraryContextType = {
    ...state,
    borrowBook,
    refreshData,
  };

  return (
    <LibraryContext.Provider value={contextValue}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}