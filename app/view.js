
var page = {
    init: function () {
        this.gameInterface.init();
    },
    gameInterface: {
        table: null,
        init: function () {
            game.start();// генерация нового поля
            this.btnStart = document.querySelector('.start');
            this.btnStart.addEventListener('click', game.restart);
            this.div = document.querySelector('.field'); // получаем блок для вывода
            this.drawField();//вызываем отрисовку поля
            var self = this; //сохраняем this
            this.div.addEventListener('click',function (e) {
                if (e.target.matches('td') && !(e.target.matches('.lock'))) self.open(e);
            })
            this.div.addEventListener('contextmenu', self.lock);
        },
        drawField: function () { //отрисовка поля
            this.div.innerHTML = ''; //очистка поля
            var table = document.createElement('table'); //создание основной таблици
            this.table = table; //сохранение таблицы в поле класса
            for (var i = 0; i < MinesweeperModel.options.height; i++){ //цикл создания строк
                var tr = document.createElement('tr'); //создание строки
                for (var j = 0; j < MinesweeperModel.options.width; j++){ //цикл создания ячеек
                    var td = document.createElement('td'); //создание ячейки
                    tr.appendChild(td); //вставка ячейки в строку
                }
                table.appendChild(tr); // вставка строки в таблицу
            }
            this.div.appendChild(table); //вставка таблици в основной блок
        },
        open: function (e) { // обработчик клика по ячейке
            x = e.target.cellIndex; //получение номера столбца
            y = e.target.parentNode.rowIndex; //получение номера строки
            this.recurceOpen(x,y); //открываем ячейку
        },
        recurceOpen: function (x,y) { // ф-ия рекурсивного открытия ячеек
            var td = this.table.rows[y].children[x]; //получаем ячейку по координатам
            if (MinesweeperModel.options.field[x][y].isOpen) return; // если уже открывали - выходим
            if (MinesweeperModel.options.field[x][y].isMine){ // если попали на мину
                alert('Game Over');
                game.start();
                this.drawField();
            } else { // если мины нет:
                td.innerHTML = MinesweeperModel.options.field[x][y].mineAround; //записываем в ячейку таблици к-во мин рядом
                MinesweeperModel.options.field[x][y].isOpen = true; // ставим метку, что ячейка открыта
                td.classList.add('open'); //добавляем класс открытой ячейки
                MinesweeperModel.options.openCount++; // инкрементируем счетчик открытых
                if (MinesweeperModel.options.width * MinesweeperModel.options.height - MinesweeperModel.options.mineCount == MinesweeperModel.options.openCount){ // если ячейка последняя
                    alert('You win!'); // победа
                    game.start();
                    this.drawField();
                }
                if (MinesweeperModel.options.field[x][y].mineAround == 0){ //если рядом мин нет, то
                    var xStart = x > 0 ? x-1 : x;
                    var yStart = y > 0 ? y-1 : y;
                    var xEnd = x < MinesweeperModel.options.width-1 ? x+1 : x;
                    var yEnd = y < MinesweeperModel.options.height-1 ? y+1 : y;
                    for (var i = xStart; i <= xEnd; i++){ //пробегаемся по всем соседним ячейкам
                        for (var j = yStart; j <= yEnd; j++){
                            this.recurceOpen(i,j); // и открываем их
                        }
                    }
                }
            }
        },
        lock: function (e) {
            x = e.target.cellIndex;
            y = e.target.parentNode.rowIndex;
            if (MinesweeperModel.options.field[x][y].isOpen) return;
            e.target.classList.toggle('lock');
            e.preventDefault();
        }
    }
};