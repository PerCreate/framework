import { Excel } from '@/js/components/excel/Excel';
import { Header } from '@/js/components/header/Header';
import { Toolbar } from '@/js/components/toolbar/Toolbar';
import { Formula } from '@/js/components/formula/Formula';
import { Table } from '@/js/components/table/Table';
import './scss/index.scss';
import { Store } from '@/js/core/createStore';
import { rootReducer } from '@/js/redux/rootReducer';
import { storage, debounce } from '@/js/core/utils';

const initialState = {
	colState: {},
	rowState: {},
	cellStyles: {},
	currentCell: '',
	currentText: '',
	rowState: {},
	selectedCells: [],
	tableTitle: 'New table'
};

const storageState = JSON.parse(localStorage.getItem('excel-state')) || initialState;

const store = new Store(rootReducer, storageState);

const stateManager = debounce(state => {
	storage('excel-state', state);
}, 1000);

store.subscribe(stateManager);

const excel = new Excel('#app', {
	components: [Header, Toolbar, Formula, Table],
	store
});

excel.render();
