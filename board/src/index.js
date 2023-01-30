const THEMES = [{name:"Blue", color:['blue', 'purple']}, {name:"Green", color:['green', 'orange']}, {name:"Classic", color:['white', 'black']}];
function main() {
  // define constants
  const DIMENSIONS = 500;
  const boards = [];
  let selectedTheme = 2;

  // define the colors and Dropdown functionality
  function dropdown() {
  	const arrow = document.querySelector('.heading .arrow');
    arrow.addEventListener('click', function (e) {
      this.nextElementSibling.classList.toggle('hidden');
      this.classList.toggle('rotate');
    });
    let options = document.querySelector('.heading .options').children;
    for (let index = 0; index < options.length; index++) {
      options[index].addEventListener('click', () => {
        options[index].parentElement.classList.toggle('hidden');
        options[index].parentElement.previousElementSibling.classList.toggle('rotate');

        let colorT = options[index].innerHTML;
        const theme = THEMES.find((theme) => theme.name === colorT);
        selectedTheme = THEMES.indexOf(theme);
        boards.forEach((board) => {
          board.setTheme(theme);
        });
        document.querySelectorAll('.color-desc')[0].innerHTML = options[index].innerHTML;
      });
    }
  }
  dropdown();

  // check if input is correct
  function checkInput() {
    const countN = document.getElementById('countN').value;

    if (countN <= 0) {
      alert('Please enter an usefull value!');
    } else {
      CompilateBoard(countN);
    }
  }

  // compilate a board
  function CompilateBoard(countN) {
    const container = document.getElementsByClassName('boards-container')[0];
    let chessBoard = new ChessBoard(countN, container, DIMENSIONS);
    chessBoard.compilateBoard();
    boards.push(chessBoard);
    chessBoard.setTheme(THEMES[selectedTheme]);
  }

  document.getElementById('start').addEventListener('click', checkInput);
}

document.addEventListener('DOMContentLoaded', main);

class ChessBoard {
	static counter = -1;
  // Constructor method
  constructor(countN, container, dimensions) {
  	ChessBoard.counter++;
    this.countN = countN;
    this.container = container;
    this.createDropdown();
    this.board = document.createElement('div');
    this.board.classList.add('board');
    this.dimensions = dimensions;
    this.setTheme(THEMES[0]);
  }

  createDropdown() {
  	this.dropdown = document.createElement('div');
    this.dropdown.innerHTML = document.getElementById('colorPicker').innerHTML;
    this.dropdown.classList.add("colors");
    this.dropdown.id = `colorPicker${ChessBoard.counter}`;
    this.container.appendChild(this.dropdown);

    const arrow = this.dropdown.querySelector('.arrow');
    arrow.addEventListener('click', function (e) {
      this.nextElementSibling.classList.toggle('hidden');
      this.classList.toggle('rotate');
    });
    let options = this.dropdown.querySelector('.options').children;
    for (let index = 0; index < options.length; index++) {
      options[index].addEventListener('click', () => {
        options[index].parentElement.classList.toggle('hidden');
        options[index].parentElement.previousElementSibling.classList.toggle('rotate');
        let colorT = options[index].innerHTML;
        const colors = THEMES.find((theme) => theme.name === colorT).color;
        this.setColors(colors);
        this.dropdown.querySelectorAll('.color-desc')[0].innerHTML = options[index].innerHTML;
      });
    }
  }
  // Method to create the board
  compilateBoard() {
    for (let rowIndex = 0; rowIndex < this.countN; rowIndex++) {
      const row = document.createElement('div');
      row.classList.add('row');
      row.style.height = this.dimensions / this.countN + 'px';
      this.board.appendChild(row);
      this.createCells(row, rowIndex);
    }
    this.container.appendChild(this.board);
  }

  // Create the cells in each row
  createCells(row, rowIndex) {
    for (let cellIndex = 0; cellIndex < this.countN; cellIndex++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.style.width = this.dimensions / this.countN + 'px';
      cell.classList.add(this.getColor(rowIndex, cellIndex));
      cell.addEventListener('click', () => {
        cell.classList.toggle(this.colors[0]);
        cell.classList.toggle(this.colors[1]);
      });
      row.appendChild(cell);
    }
  }

  // Define the initial cell color
  getColor(rowIndex, cellIndex) {
    if (rowIndex % 2 === 0) {
      return this.colors[cellIndex % 2];
    } else {
      return this.colors[(cellIndex + 1) % 2];
    }
  }

  setColors(colors) {
    const oldColors = this.colors;
    this.colors = colors;
    this.board.querySelectorAll('div').forEach((itm) => {
      if (itm.classList.contains(oldColors[0])) {
        itm.classList.remove(oldColors[0]);
        itm.classList.add(colors[0]);
      } else {
        itm.classList.remove(oldColors[1]);
        itm.classList.add(colors[1]);
      }
    });
  }

  setTheme(theme) {
  	this.setColors(theme.color);
  	this.dropdown.querySelector('.color-desc').innerHTML = theme.name;
  }

  setModel(model) {
  	this.model = model;
  	model.subscribe(this.onModelChange.bind(this))
  }

  onModelChange() {

  }
}

class Model {
	constructor(n) {
		this.data = [];
	}  

	subscribe(callback) {
		
	}

	notifyAll() {
		this.callbacks.forEach(callback => {
			callback();
		})
	}

	change(row, column, value) {
		this.data[row][column] = value;
		this.notifyAll();
	}
}
